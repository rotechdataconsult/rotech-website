import io
import uuid
import os

import pandas as pd
from fastapi import APIRouter, File, Form, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from supabase import create_client, Client

from services.cleaner import clean_dataset
from services.stats import generate_stats
from services.charts import generate_charts
from services.ai import generate_insights

router = APIRouter()

# ── Supabase client ────────────────────────────────────────────────────────────

_supabase: Client | None = None

def _get_supabase() -> Client:
    global _supabase
    if _supabase is None:
        url = os.getenv("SUPABASE_URL")
        key = os.getenv("SUPABASE_SERVICE_KEY")
        if not url or not key:
            raise RuntimeError("SUPABASE_URL and SUPABASE_SERVICE_KEY must be set.")
        _supabase = create_client(url, key)
    return _supabase

# ── Constants ──────────────────────────────────────────────────────────────────

ALLOWED_EXTENSIONS = {".csv", ".xlsx", ".xls"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB


# ── Helpers ────────────────────────────────────────────────────────────────────

def _read_dataframe(filename: str, contents: bytes) -> pd.DataFrame:
    ext = os.path.splitext(filename)[1].lower()
    if ext == ".csv":
        return pd.read_csv(io.BytesIO(contents))
    return pd.read_excel(io.BytesIO(contents))


def _error(message: str, status_code: int) -> JSONResponse:
    return JSONResponse(
        status_code=status_code,
        content={"error": message, "status": "failed"},
    )


# ── ENDPOINT 1: POST /api/upload ───────────────────────────────────────────────

@router.post("/api/upload")
async def upload_file(
    file: UploadFile = File(...),
    domain: str = Form(...),
    user_id: str = Form(...),
):
    # Validate file extension
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail={"error": f"Unsupported file type '{ext}'. Allowed: .csv, .xlsx, .xls", "status": "failed"},
        )

    # Read and validate file size
    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail={"error": "File exceeds the 10 MB limit.", "status": "failed"},
        )

    try:
        df = _read_dataframe(file.filename, contents)
    except Exception as exc:
        raise HTTPException(
            status_code=400,
            detail={"error": f"Could not parse file: {exc}", "status": "failed"},
        )

    # Run the analysis pipeline
    try:
        clean_result = clean_dataset(df)
        cleaned_df = clean_result["cleaned_df"]
        cleaning_report = clean_result["report"]

        stats = generate_stats(cleaned_df)
        charts = generate_charts(cleaned_df, domain)
        insights = generate_insights(stats, domain, file.filename)
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail={"error": f"Analysis pipeline failed: {exc}", "status": "failed"},
        )

    # Persist to Supabase
    analysis_id = str(uuid.uuid4())
    try:
        _get_supabase().table("analyses").insert({
            "id": analysis_id,
            "user_id": user_id,
            "filename": file.filename,
            "domain": domain,
            "cleaning_report": cleaning_report,
            "stats": stats,
            "status": "completed",
        }).execute()

        _get_supabase().table("insights").insert({
            "analysis_id": analysis_id,
            "user_id": user_id,
            "charts": charts,
            "insights": insights,
        }).execute()
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail={"error": f"Failed to save results: {exc}", "status": "failed"},
        )

    return {
        "analysis_id": analysis_id,
        "filename": file.filename,
        "domain": domain,
        "cleaning_report": cleaning_report,
        "stats": stats,
        "charts": charts,
        "insights": insights,
        "status": "success",
    }


# ── ENDPOINT 2: GET /api/analyses/{user_id} ────────────────────────────────────

@router.get("/api/analyses/{user_id}")
def get_user_analyses(user_id: str):
    try:
        result = (
            _get_supabase().table("analyses")
            .select("*, insights(*)")
            .eq("user_id", user_id)
            .order("created_at", desc=True)
            .execute()
        )
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail={"error": f"Failed to fetch analyses: {exc}", "status": "failed"},
        )

    return result.data


# ── ENDPOINT 3: GET /api/analysis/{analysis_id} ────────────────────────────────

@router.get("/api/analysis/{analysis_id}")
def get_analysis(analysis_id: str):
    try:
        result = (
            _get_supabase().table("analyses")
            .select("*, insights(*)")
            .eq("id", analysis_id)
            .single()
            .execute()
        )
    except Exception as exc:
        raise HTTPException(
            status_code=404,
            detail={"error": f"Analysis not found: {exc}", "status": "failed"},
        )

    if not result.data:
        raise HTTPException(
            status_code=404,
            detail={"error": "Analysis not found.", "status": "failed"},
        )

    return result.data

import io
import uuid
import os
import logging

import pandas as pd
from fastapi import APIRouter, Depends, File, Form, HTTPException, Request, UploadFile
from supabase import create_client, Client

from services.cleaner import clean_dataset
from services.stats import generate_stats
from services.charts import generate_charts
from services.ai import generate_insights
from limiter import limiter
from auth import get_current_user, _get_supabase as _get_auth_supabase

router = APIRouter()
logger = logging.getLogger("rotech.upload")


def _get_supabase() -> Client:
    return _get_auth_supabase()


# ── Constants ──────────────────────────────────────────────────────────────────

ALLOWED_EXTENSIONS = {".csv", ".xlsx", ".xls"}
MAX_FILE_SIZE      = 10 * 1024 * 1024  # 10 MB


# ── ENDPOINT: POST /api/upload ─────────────────────────────────────────────────

@router.post("/api/upload")
@limiter.limit("10/minute")           # max 10 uploads per IP per minute
async def upload_file(
    request: Request,
    file:   UploadFile = File(...),
    domain: str        = Form(...),
    user_id: str       = Depends(get_current_user),   # from verified JWT, not form
):
    # Validate extension
    ext = os.path.splitext(file.filename or "")[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail={"error": f"Unsupported file type '{ext}'. Allowed: .csv, .xlsx, .xls", "status": "failed"},
        )

    # Validate domain input — must be a plain string, no injection
    domain = domain.strip()[:100]

    # Read and validate file size
    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail={"error": "File exceeds the 10 MB limit.", "status": "failed"},
        )

    # Parse file
    try:
        buf = io.BytesIO(contents)
        df  = pd.read_csv(buf) if ext == ".csv" else pd.read_excel(buf)
    except Exception:
        raise HTTPException(
            status_code=400,
            detail={"error": "Could not parse file. Make sure it is a valid CSV or Excel file.", "status": "failed"},
        )

    # Run analysis pipeline
    try:
        clean_result    = clean_dataset(df)
        cleaned_df      = clean_result["cleaned_df"]
        cleaning_report = clean_result["report"]
        stats           = generate_stats(cleaned_df)
        charts          = generate_charts(cleaned_df, domain)
        insights        = generate_insights(stats, domain, file.filename)
    except Exception as exc:
        logger.error("Analysis pipeline error for user %s: %s", user_id, exc, exc_info=True)
        raise HTTPException(
            status_code=500,
            detail={"error": "Analysis pipeline failed. Please try a different file.", "status": "failed"},
        )

    # Persist to Supabase — using service key, user_id comes from verified JWT
    analysis_id = str(uuid.uuid4())
    try:
        sb = _get_supabase()
        sb.table("analyses").insert({
            "id":              analysis_id,
            "user_id":         user_id,
            "filename":        file.filename,
            "domain":          domain,
            "cleaning_report": cleaning_report,
            "stats":           stats,
            "status":          "completed",
        }).execute()

        sb.table("insights").insert({
            "analysis_id": analysis_id,
            "user_id":     user_id,
            "charts":      charts,
            "insights":    insights,
        }).execute()
    except Exception as exc:
        logger.error("Supabase insert error for user %s: %s", user_id, exc, exc_info=True)
        raise HTTPException(
            status_code=500,
            detail={"error": "Failed to save results. Please try again.", "status": "failed"},
        )

    return {
        "analysis_id":    analysis_id,
        "filename":       file.filename,
        "domain":         domain,
        "cleaning_report": cleaning_report,
        "stats":          stats,
        "charts":         charts,
        "insights":       insights,
        "status":         "success",
    }

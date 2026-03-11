from dotenv import load_dotenv
load_dotenv()

import os
import logging

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from limiter import limiter
from routers.upload import router as upload_router

logger = logging.getLogger("rotech")

app = FastAPI(
    title="Rotech Data Consult API",
    docs_url=None,       # disable Swagger UI in production
    redoc_url=None,      # disable ReDoc in production
    openapi_url=None,    # disable OpenAPI schema endpoint
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# ── CORS — restrict to known frontend origins only ────────────────────────────
ALLOWED_ORIGINS = [
    "https://rotech-website-production-7cb7.up.railway.app",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["Authorization", "Content-Type"],
)

# ── Security headers middleware ────────────────────────────────────────────────
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"]    = "nosniff"
    response.headers["X-Frame-Options"]           = "DENY"
    response.headers["Referrer-Policy"]           = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"]        = "camera=(), microphone=(), geolocation=()"
    return response

app.include_router(upload_router)

# ── Safe global exception handler — never leak internals ──────────────────────
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error("Unhandled error on %s: %s", request.url.path, exc, exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"error": "An internal server error occurred.", "status": "failed"},
    )


@app.get("/")
def root():
    return {"message": "Rotech Data Consult API is running."}


@app.get("/health")
def health():
    return {"status": "healthy", "service": "rotech-api"}

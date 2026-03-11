import os
import logging
from fastapi import Header, HTTPException
from supabase import create_client, Client

logger = logging.getLogger("rotech.auth")

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


def get_current_user(authorization: str = Header(None)) -> str:
    """Verify token via Supabase auth and return the user's ID."""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Please log in to continue.")

    token = authorization.split(" ", 1)[1]

    try:
        response = _get_supabase().auth.get_user(token)
        user = response.user
        if not user or not user.id:
            raise HTTPException(status_code=401, detail="Session invalid. Please log in again.")
        return user.id
    except HTTPException:
        raise
    except Exception as exc:
        logger.error("Token verification failed: %s", type(exc).__name__, exc)
        raise HTTPException(status_code=403, detail=f"Auth error: {type(exc).__name__}: {str(exc)[:200]}")

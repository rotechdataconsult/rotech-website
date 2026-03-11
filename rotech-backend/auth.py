import os
import logging
import jwt
from fastapi import Header, HTTPException

logger = logging.getLogger("rotech.auth")


def get_current_user(authorization: str = Header(None)) -> str:
    """Verify Supabase JWT and return the user's ID."""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Please log in to continue.")

    token = authorization.split(" ", 1)[1]

    jwt_secret = os.getenv("SUPABASE_JWT_SECRET")
    if not jwt_secret:
        logger.error("SUPABASE_JWT_SECRET is not set.")
        raise HTTPException(status_code=503, detail="Auth service misconfigured. Contact support.")

    try:
        payload = jwt.decode(
            token,
            jwt_secret,
            algorithms=["HS256"],
            options={"verify_aud": False},
        )
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Session invalid. Please log in again.")
        return user_id
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Your session has expired. Please log in again.")
    except jwt.InvalidTokenError as exc:
        logger.warning("Invalid JWT: %s", exc)
        raise HTTPException(status_code=401, detail="Session invalid. Please log in again.")
    except HTTPException:
        raise
    except Exception as exc:
        logger.error("Auth error: %s", exc, exc_info=True)
        raise HTTPException(status_code=401, detail="Authentication failed. Please log in again.")

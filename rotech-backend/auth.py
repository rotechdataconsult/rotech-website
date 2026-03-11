import os
import jwt
from fastapi import Header, HTTPException


def get_current_user(authorization: str = Header(None)) -> str:
    """Verify Supabase JWT and return the authenticated user's ID."""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid Authorization header.")

    token = authorization.split(" ", 1)[1]
    jwt_secret = os.getenv("SUPABASE_JWT_SECRET")
    if not jwt_secret:
        raise HTTPException(status_code=500, detail="Server authentication not configured.")

    try:
        payload = jwt.decode(
            token,
            jwt_secret,
            algorithms=["HS256"],
            audience="authenticated",
        )
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token: missing subject.")
        return user_id
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired. Please log in again.")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token. Please log in again.")

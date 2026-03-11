import os
import logging

from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel

from limiter import limiter
from auth import get_current_user

router = APIRouter()
logger = logging.getLogger("rotech.chat")

SYSTEM_PROMPT = """You are Rota, a friendly data analytics assistant for Rotech Data Consult — a platform that helps African businesses and learners understand their data.

Your role:
- Answer questions about data analysis, statistics, Excel, SQL, Power BI, Python, and business intelligence
- Help Nigerian and African SME owners understand their business data (sales, expenses, inventory)
- Explain data concepts in simple, practical terms — avoid heavy jargon
- Give short, clear answers (2–4 sentences max unless a longer explanation is truly needed)
- Use real-world examples relevant to African businesses (retail shops, restaurants, pharmacies, agribusinesses)
- Be warm, encouraging, and professional

You do NOT:
- Answer questions unrelated to data, business, or analytics
- Write full code projects (you can explain short snippets)
- Give financial/legal/medical advice

If someone asks something outside your scope, politely redirect them to data-related questions.
Always end with a practical tip or next step when relevant."""


class ChatRequest(BaseModel):
    message: str


@router.post("/api/chat")
@limiter.limit("20/minute")
async def chat(
    request: Request,
    body: ChatRequest,
    user_id: str = Depends(get_current_user),
):
    message = body.message.strip()[:1000]
    if not message:
        raise HTTPException(status_code=400, detail="Message cannot be empty.")

    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        logger.error("ANTHROPIC_API_KEY is not set in environment variables.")
        raise HTTPException(
            status_code=503,
            detail="AI service is not configured. Please contact support.",
        )

    try:
        import anthropic
        client = anthropic.Anthropic(api_key=api_key)
        response = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=400,
            system=SYSTEM_PROMPT,
            messages=[{"role": "user", "content": message}],
        )
        answer = response.content[0].text.strip()
    except Exception as exc:
        logger.error("Chat error for user %s: %s", user_id, exc, exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Claude error: {type(exc).__name__}: {str(exc)[:300]}",
        )

    return {"answer": answer}

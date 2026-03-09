from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from routers.upload import router as upload_router

app = FastAPI(title="Rotech Data Consult API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload_router)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"error": str(exc), "status": "failed"},
    )


@app.get("/")
def root():
    return {"message": "Rotech Data Consult API is running."}


@app.get("/health")
def health():
    return {"status": "healthy", "service": "rotech-api"}

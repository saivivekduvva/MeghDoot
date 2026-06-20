from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import api

app = FastAPI(
    title="MeghDoot API",
    description="Multi Agent Climate Intelligence Platform",
    version="1.0.0"
)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all for hackathon/development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to MeghDoot API"}

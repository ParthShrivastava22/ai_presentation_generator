from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import presentations

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://ai-presentation-generator-txbl.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Slate backend is running"}


app.include_router(presentations.router)
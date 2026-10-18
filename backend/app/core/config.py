import os
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseModel):
    app_name: str = "Nivorq - Enterprise Agentic Copilot & Knowledge Intelligence"
    app_version: str = "1.0.0"
    gemini_api_key: str = os.getenv("GEMINI_API_KEY", os.getenv("GOOGLE_API_KEY", ""))
    gemini_model: str = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
    gemini_pro_model: str = os.getenv("GEMINI_PRO_MODEL", "gemini-1.5-pro")
    embedding_model: str = "text-embedding-004"
    gcp_project_id: str = os.getenv("GCP_PROJECT_ID", "nivorq-enterprise-ai")
    gcp_region: str = os.getenv("GCP_REGION", "us-central1")
    environment: str = os.getenv("ENV", "development")

settings = Settings()

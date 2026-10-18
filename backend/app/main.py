import os
import uuid
from typing import List, Dict, Any, Optional
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import PlainTextResponse, JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from app.core.config import settings
from app.rag.vector_store import vector_store
from app.rag.doc_loader import extract_text_from_pdf, chunk_text
from app.agents.orchestrator import orchestrator_agent
from app.agents.meeting_agent import meeting_agent
from app.agents.gemini_client import gemini_client
from app.services.analytics_service import analytics_service
from app.services.export_service import export_service

app = FastAPI(
    title="Nivorq API",
    description="Enterprise Autonomous Intelligence & Productivity Copilot API",
    version="1.0.0"
)

# CORS configuration for modern local and production hosting
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Action Items State
GLOBAL_ACTIONS: List[Dict[str, Any]] = [
    {
        "id": "act-init-01",
        "title": "Complete Cloud Run production containerization & achieve <1s latency",
        "assignee": "Dr. Elena Vance (Chief AI Architect)",
        "priority": "CRITICAL",
        "due_date": "2026-10-25",
        "department": "Engineering",
        "status": "IN_PROGRESS"
    },
    {
        "id": "act-init-02",
        "title": "Roll out Nivorq agent pilot to top 20 Enterprise customer accounts",
        "assignee": "Priya Patel (VP Customer Success)",
        "priority": "HIGH",
        "due_date": "2026-11-10",
        "department": "Customer Success",
        "status": "TODO"
    },
    {
        "id": "act-init-03",
        "title": "Submit Q4 revised financial forecast reflecting Cloud Run cost savings ($340k/yr)",
        "assignee": "David Zhao (CFO)",
        "priority": "MEDIUM",
        "due_date": "2026-10-22",
        "department": "Finance",
        "status": "REVIEW"
    },
    {
        "id": "act-init-04",
        "title": "Coordinate Singapore AI Builder Cup Grand Finale logistics and demo deck",
        "assignee": "Marcus Sterling (Chief of Staff)",
        "priority": "HIGH",
        "due_date": "2026-11-15",
        "department": "Operations",
        "status": "TODO"
    }
]

# Request / Response Schemas
class ChatRequest(BaseModel):
    query: str
    model_name: Optional[str] = None

class MeetingRequest(BaseModel):
    transcript: str
    title: Optional[str] = "Q3 Executive & Technical Review"

class ActionItemModel(BaseModel):
    title: str
    assignee: str
    priority: str = "MEDIUM"
    due_date: str = "2026-10-30"
    department: str = "General"
    status: str = "TODO"

class ConfigUpdateRequest(BaseModel):
    gemini_api_key: Optional[str] = None
    gemini_model: Optional[str] = None

# --- Health & Status ---
@app.get("/api/health")
def get_health():
    return {
        "status": "healthy",
        "version": settings.app_version,
        "environment": settings.environment,
        "gemini_api_configured": bool(settings.gemini_api_key),
        "active_model": settings.gemini_model,
        "indexed_documents": len(vector_store.documents),
        "indexed_chunks": len(vector_store.chunks),
        "cloud_run_telemetry": {
            "platform": "Google Cloud Run (Serverless)",
            "region": settings.gcp_region,
            "project_id": settings.gcp_project_id,
            "bigquery_sync": "ONLINE"
        }
    }

# --- Knowledge Documents ---
@app.get("/api/documents")
def get_documents():
    return {
        "count": len(vector_store.documents),
        "documents": vector_store.get_all_documents()
    }

@app.post("/api/documents/reset-samples")
def reset_sample_corpus():
    vector_store.load_samples()
    return {
        "status": "success",
        "message": "Reset to 5 core enterprise sample documents.",
        "documents_count": len(vector_store.documents),
        "chunks_count": len(vector_store.chunks)
    }

@app.post("/api/documents/upload")
async def upload_document(
    file: UploadFile = File(...),
    category: str = Form("General Document")
):
    try:
        content_bytes = await file.read()
        filename = file.filename or "uploaded_document.txt"
        doc_id = f"doc-upload-{uuid.uuid4().hex[:6]}"

        if filename.lower().endswith(".pdf"):
            chunks = extract_text_from_pdf(content_bytes, doc_id=doc_id, doc_title=filename, category=category)
            full_text = "\n\n".join([c["content"] for c in chunks])
            vector_store.add_document(
                doc_id=doc_id,
                title=filename,
                category=category,
                content=full_text,
                author="Uploaded User PDF",
                chunks=chunks
            )
        else:
            text = content_bytes.decode("utf-8", errors="ignore")
            vector_store.add_document(
                doc_id=doc_id,
                title=filename,
                category=category,
                content=text,
                author="Uploaded Text / Markdown"
            )

        return {
            "status": "success",
            "doc_id": doc_id,
            "title": filename,
            "category": category,
            "chunks_added": len(vector_store.chunks)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process upload: {str(e)}")

# --- Agentic Chat & Copilot ---
@app.post("/api/chat")
def process_chat(req: ChatRequest):
    if not req.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty.")

    result = orchestrator_agent.process_query(req.query, model_name=req.model_name)

    # Log telemetry for BigQuery
    analytics_service.log_query(
        query=req.query,
        category="Multi-Agent Copilot",
        model=result["model_used"],
        latency_ms=result["latency_ms"],
        confidence=result["grounding_score"] / 100.0
    )

    return result

# --- Meeting Intelligence ---
@app.post("/api/meeting/analyze")
def analyze_meeting(req: MeetingRequest):
    if not req.transcript.strip():
        raise HTTPException(status_code=400, detail="Meeting transcript cannot be empty.")

    result = meeting_agent.analyze_transcript(req.transcript, meeting_title=req.title or "Enterprise Strategy Meeting")

    # Automatically add newly generated actions to the global action tracker
    for act in result["action_items"]:
        GLOBAL_ACTIONS.insert(0, act)

    analytics_service.log_query(
        query=f"Meeting Analysis: {req.title}",
        category="Meeting Intelligence",
        model=settings.gemini_model,
        latency_ms=result["latency_ms"],
        confidence=0.98
    )

    return result

# --- Action Items & Kanban Board ---
@app.get("/api/actions")
def get_actions():
    return {"actions": GLOBAL_ACTIONS}

@app.post("/api/actions")
def create_action(act: ActionItemModel):
    new_item = act.model_dump()
    new_item["id"] = f"act-{uuid.uuid4().hex[:8]}"
    GLOBAL_ACTIONS.insert(0, new_item)
    return {"status": "success", "action": new_item}

@app.put("/api/actions/{action_id}")
def update_action(action_id: str, act: ActionItemModel):
    for idx, item in enumerate(GLOBAL_ACTIONS):
        if item["id"] == action_id:
            updated = act.model_dump()
            updated["id"] = action_id
            GLOBAL_ACTIONS[idx] = updated
            return {"status": "success", "action": updated}
    raise HTTPException(status_code=404, detail="Action not found.")

@app.delete("/api/actions/{action_id}")
def delete_action(action_id: str):
    global GLOBAL_ACTIONS
    initial_len = len(GLOBAL_ACTIONS)
    GLOBAL_ACTIONS = [a for a in GLOBAL_ACTIONS if a["id"] != action_id]
    if len(GLOBAL_ACTIONS) == initial_len:
        raise HTTPException(status_code=404, detail="Action not found.")
    return {"status": "success", "deleted_id": action_id}

@app.post("/api/actions/export/ics")
def export_calendar_ics():
    ics_text = export_service.generate_ics(GLOBAL_ACTIONS)
    return PlainTextResponse(
        content=ics_text,
        media_type="text/calendar",
        headers={"Content-Disposition": "attachment; filename=nivorq-enterprise-actions.ics"}
    )

@app.post("/api/actions/export/jira")
def export_jira_payload():
    payload = export_service.generate_jira_payload(GLOBAL_ACTIONS)
    return JSONResponse(content=payload)

# --- Analytics & Telemetry ---
@app.get("/api/analytics")
def get_analytics():
    return analytics_service.get_metrics()

# --- Config & Keys ---
@app.post("/api/config")
def update_config(req: ConfigUpdateRequest):
    if req.gemini_api_key is not None:
        gemini_client.update_api_key(req.gemini_api_key.strip())
    if req.gemini_model:
        settings.gemini_model = req.gemini_model.strip()

    return {
        "status": "success",
        "gemini_api_configured": bool(settings.gemini_api_key),
        "active_model": settings.gemini_model
    }

# Mount compiled React frontend if present
frontend_dist = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "dist"))
if os.path.exists(frontend_dist):
    app.mount("/assets", StaticFiles(directory=os.path.join(frontend_dist, "assets")), name="assets")

    @app.api_route("/{full_path:path}", methods=["GET", "HEAD"])
    def serve_spa(full_path: str):
        # Allow API routes to be handled by FastAPI
        if full_path.startswith("api/"):
            raise HTTPException(status_code=404, detail="API route not found")
        file_path = os.path.join(frontend_dist, full_path)
        if os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(frontend_dist, "index.html"))

import os
import sys
import uvicorn

# Ensure backend directory is in python path
backend_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "backend")
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    host = os.environ.get("HOST", "0.0.0.0")
    print(f"\n=======================================================")
    print(f"  NIVORQ: Enterprise Autonomous Intelligence & Copilot")
    print(f"  Future of Work & Enterprise Productivity")
    print(f"  AI Builder Cup 2026 Submission")
    print(f"  Serving on: http://127.0.0.1:{port}")
    print(f"=======================================================\n")
    uvicorn.run("app.main:app", host=host, port=port, reload=False)

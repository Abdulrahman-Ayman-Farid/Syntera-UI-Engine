import os
import json
from typing import List, Dict, Any, Optional
from contextlib import asynccontextmanager
from dotenv import load_dotenv

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from fastapi_mcp import FastApiMCP
from rapidfuzz import process, fuzz

# Load environment variables
load_dotenv()

# ----------------------------------
# 1. Configuration
# ----------------------------------

TEMPLATE_DIR = os.getenv("TEMPLATE_DIR", "/data/templates-repo/templates")
os.makedirs(TEMPLATE_DIR, exist_ok=True)

TEMPLATES_DB: List[Dict[str, Any]] = []


# ----------------------------------
# 2. Data Loading Logic
# ----------------------------------

def load_templates() -> None:
    """Reads all template.json + page.tsx from subfolders into memory."""
    global TEMPLATES_DB
    TEMPLATES_DB = []

    if not os.path.exists(TEMPLATE_DIR):
        print(f"⚠️ Warning: Directory '{TEMPLATE_DIR}' not found.")
        os.makedirs(TEMPLATE_DIR, exist_ok=True)
        return

    print(f"📂 Scanning '{TEMPLATE_DIR}'...")

    try:
        entries = os.listdir(TEMPLATE_DIR)
    except PermissionError:
        print(f"❌ Permission denied reading {TEMPLATE_DIR}")
        return

    for entry in entries:
        subdir_path = os.path.join(TEMPLATE_DIR, entry)
        if not os.path.isdir(subdir_path):
            continue

        json_path = os.path.join(subdir_path, "template.json")
        tsx_path = os.path.join(subdir_path, "page.tsx")

        if not os.path.exists(json_path):
            print(f"⚠️ Skipping '{entry}': template.json not found.")
            continue

        try:
            with open(json_path, "r", encoding="utf-8") as f:
                data = json.load(f)

            data["_folder"] = entry
            data["_filename"] = "template.json"

            if os.path.exists(tsx_path):
                with open(tsx_path, "r", encoding="utf-8") as f:
                    data["page.tsx"] = f.read()
            else:
                print(f"⚠️ No page.tsx found for '{entry}'.")

            TEMPLATES_DB.append(data)

        except Exception as e:
            print(f"❌ Failed to load template from '{entry}': {e}")

    print(f"✅ Loaded {len(TEMPLATES_DB)} templates into memory.")


# ----------------------------------
# 3. Lifecycle Manager
# ----------------------------------

@asynccontextmanager
async def lifespan(app: FastAPI):
    load_templates()
    yield


# ----------------------------------
# 4. FastAPI Setup
# ----------------------------------

app = FastAPI(
    title="UI Template MCP Server",
    description="MCP server with GitHub template sync",
    version="1.0.0",
    lifespan=lifespan
)


class TemplateResult(BaseModel):
    title: str
    filename: str
    score: float
    react_code: Optional[str] = Field(None, description="The full page.tsx React code")
    full_data: Dict[str, Any] = Field(..., description="The entire JSON content of the template")


# ----------------------------------
# 5. SMART SEARCH ENDPOINT
# ----------------------------------

@app.get(
    "/search",
    operation_id="search_templates",
    response_model=List[TemplateResult],
)
async def search_templates(query: str, limit: int = 3):
    """Smart fuzzy search for UI templates."""
    if not TEMPLATES_DB:
        return []

    clean_query = query.lower().strip()

    def get_searchable_text(item: Dict[str, Any]) -> str:
        if isinstance(item, dict):
            features = " ".join(item.get("features", []))
            text = (
                f"{item.get('title', '')} "
                f"{item.get('description', '')} "
                f"{item.get('category', '')} "
                f"{features}"
            )
            return text.lower()
        return str(item).lower()

    try:
        results = process.extract(
            clean_query,
            TEMPLATES_DB,
            processor=get_searchable_text,
            scorer=fuzz.WRatio,
            limit=limit,
        )

        matches: List[TemplateResult] = []
        for template, score, _ in results:
            if score <= 30:
                continue

            code_snippet = template.get("page.tsx", "")

            matches.append(
                TemplateResult(
                    title=template.get("title", "Untitled"),
                    filename=template.get("_filename", ""),
                    score=float(score),
                    react_code=code_snippet,
                    full_data=template,
                )
            )

        return matches

    except Exception as e:
        print(f"❌ Search Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/health")
async def health():
    return {
        "status": "ok",
        "templates_loaded": len(TEMPLATES_DB),
        "template_dir": TEMPLATE_DIR
    }


# ----------------------------------
# 6. MCP Setup
# ----------------------------------

mcp = FastApiMCP(app)
mcp.mount_http()


# ----------------------------------
# 7. Local dev entrypoint
# ----------------------------------

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=3002)

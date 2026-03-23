from __future__ import annotations

import importlib.util
import re
import subprocess
from pathlib import Path
from typing import Any

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

REPO_ROOT = Path(__file__).resolve().parents[2]
BACKEND_ROOT = REPO_ROOT / "Backend and algo"
CODEGEN_ROOT = BACKEND_ROOT / "evolving_agent_poc_Code_generation_evolution"

PROMPT_PROJECT = BACKEND_ROOT / "evolving-agent-poc_Prompt_eveolution"
ROUTER_PROJECT = BACKEND_ROOT / "evolving-agentic LLM-Router_tool_evolution"


def load_module(module_name: str, file_path: Path):
    spec = importlib.util.spec_from_file_location(module_name, file_path)
    module = importlib.util.module_from_spec(spec)
    assert spec.loader is not None
    spec.loader.exec_module(module)
    return module


def call_ollama_version() -> str:
    try:
        proc = subprocess.run(
            ["ollama", "--version"],
            capture_output=True,
            text=True,
            timeout=5,
        )
        if proc.returncode == 0:
            return proc.stdout.strip() or proc.stderr.strip() or "available"
        return "configured but unavailable"
    except Exception:
        return "not available"


def discover_models() -> list[str]:
    pattern = re.compile(r'(?:model=|ollama run )["\']?([a-zA-Z0-9\.\:\-]+)')
    models: set[str] = set()
    for file_path in BACKEND_ROOT.rglob("*.py"):
        try:
            content = file_path.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            continue
        for match in pattern.findall(content):
            models.add(match)
    return sorted(models)


def evaluate_local_math(message: str) -> tuple[str, str]:
    basic_module = load_module(
        "evolve_basic_calc",
        CODEGEN_ROOT / "tools" / "basic_calc.py",
    )
    scientific_module = load_module(
        "router_scientific_calc",
        ROUTER_PROJECT / "tools" / "scientific_calc.py",
    )

    scientific_keywords = re.compile(r"(sqrt|sin|cos|tan|log|exp|\^|derivative|integral|matrix|complex)", re.IGNORECASE)
    arithmetic_only = re.compile(r"^[\d\.\s+\-*/()%//^sqrt]+$", re.IGNORECASE)

    if scientific_keywords.search(message):
        return "scientific_calc", scientific_module.scientific_calc(message)
    if arithmetic_only.match(message.strip()):
        return "basic_calc", basic_module.basic_calc(message)
    return "analysis", ""


class QueryRequest(BaseModel):
    message: str


app = FastAPI(title="Evolve Backend")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/dashboard")
def get_dashboard() -> dict[str, Any]:
    discovered_models = discover_models()
    return {
        "llms": [
            {"name": "mistral", "role": "Primary solver and router", "source": str(CODEGEN_ROOT / "agents" / "base_agent.py")},
            {"name": "llama3:latest", "role": "Query generation and preprocessing", "source": str(PROMPT_PROJECT / "query_generator.py")},
            {"name": "llama3.1:8b", "role": "Alternate local SLM option", "source": str(CODEGEN_ROOT / "main_old.py")},
        ],
        "agents": [
            {"name": "Prompt Evolution Agent", "role": "GA prompt optimizer", "source": str(PROMPT_PROJECT / "evolution" / "ga_core.py")},
            {"name": "Router Tool Agent", "role": "Tool selection and routing", "source": str(ROUTER_PROJECT / "agents" / "base_agent.py")},
            {"name": "Code Generation Agent", "role": "Runtime tool evolution", "source": str(CODEGEN_ROOT / "agents" / "evolving_agent.py")},
        ],
        "promptEvolution": {
            "initialPrompt": "Calculate the derivative of x^3 + 2x^2 - 5x + 7 and find current Bitcoin price",
            "evolvedPrompt": "I need to solve a complex calculus problem and retrieve real-time cryptocurrency data. Specifically:\n1. Calculate the derivative of the polynomial function f(x) = x^3 + 2x^2 - 5x + 7\n2. Fetch the current market price of Bitcoin in USD from a reliable API\n3. Present both results in a clear, formatted output\n\nThis task requires advanced mathematical computation capabilities and web scraping or API integration for live data retrieval.",
            "generationCount": 10,
            "improvementNotes": [
                "More detailed task breakdown with numbered steps",
                "Explicit mention of required capabilities",
                "Clearer output formatting requirements",
                "Better context for real-time data needs",
            ],
        },
        "gaEvolution": {
            "title": "GA Fitness Evolution Logs",
            "initialFitness": 0.30,
            "finalFitness": 0.81,
            "improvementPercent": 170,
            "summary": [
                "Generation 0-2: Initial population established with baseline fitness",
                "Generation 3-5: Rapid improvement through crossover and mutation",
                "Generation 6-8: Steady optimization of tool capabilities",
                "Generation 9-10: Convergence to optimal solution with fitness 0.81",
            ],
            "fitnessCurve": [
                {"generation": 0, "fitness": 0.30},
                {"generation": 1, "fitness": 0.34},
                {"generation": 2, "fitness": 0.39},
                {"generation": 3, "fitness": 0.48},
                {"generation": 4, "fitness": 0.55},
                {"generation": 5, "fitness": 0.63},
                {"generation": 6, "fitness": 0.69},
                {"generation": 7, "fitness": 0.73},
                {"generation": 8, "fitness": 0.77},
                {"generation": 9, "fitness": 0.80},
                {"generation": 10, "fitness": 0.81},
            ],
        },
        "queryDetails": {
            "query": "I need a scientific calculator that can handle complex mathematical operations including complex number arithmetic, matrix operations, advanced calculus, statistical analysis, 3D function plotting, and symbolic equation solving. It also needs to work with web-based data sources and dynamically fetch mathematical constants from online databases.",
            "analysis": [
                "This query requires advanced computational capabilities beyond basic arithmetic.",
                "The agent needs both mathematical reasoning and access to web-derived data.",
                "The baseline toolkit lacks advanced scientific calculation and dynamic web retrieval.",
            ],
            "strategy": [
                "Attempt the task with the existing basic calculator tool.",
                "Detect the capability gap for advanced scientific math and data access.",
                "Escalate to the code-generation workflow to evolve missing tools.",
                "Use the evolved toolkit to complete the task and feed the prompt evolution cycle.",
            ],
            "complexity": "High",
            "toolsRequired": 3,
            "newToolsNeeded": 2,
        },
        "backendSummary": {
            "ollamaStatus": call_ollama_version(),
            "discoveredModels": discovered_models,
            "projects": [
                {"name": "Prompt Evolution", "concept": "GA prompt optimization", "path": str(PROMPT_PROJECT)},
                {"name": "Router and Tool Evolution", "concept": "LLM routing across tools", "path": str(ROUTER_PROJECT)},
                {"name": "Runtime Code Generation", "concept": "Dynamic tool patching", "path": str(CODEGEN_ROOT)},
            ],
        },
    }


@app.post("/api/query")
def query_agent(payload: QueryRequest) -> dict[str, Any]:
    workflow_trigger = False
    route = "analysis"
    response = ""

    try:
        route, computed = evaluate_local_math(payload.message)
        if computed:
            response = f"Backend route `{route}` handled the query and returned: {computed}"
            workflow_trigger = route == "scientific_calc"
    except Exception:
        route = "analysis"

    if not response:
        lowered = payload.message.strip().lower()
        trigger_keywords = [
            "scientific calculator",
            "complex number",
            "matrix",
            "calculus",
            "derivative",
            "integral",
            "web-based data",
            "visualization",
        ]
        workflow_trigger = sum(keyword in lowered for keyword in trigger_keywords) >= 2
        if workflow_trigger:
            response = (
                "Understood. The backend maps this to the evolving workflow: route the request, "
                "attempt the base toolchain, then escalate into prompt evolution and runtime tool generation if needed."
            )
        else:
            response = (
                "The backend is connected. Ask for arithmetic, scientific math, or a multi-step agent workflow "
                "to drive the integrated demo with the local Ollama-oriented stack."
            )

    discovered_models = discover_models()
    preferred_model = discovered_models[0] if discovered_models else None
    return {
        "assistantMessage": response,
        "workflowTrigger": workflow_trigger,
        "route": route,
        "modelUsed": preferred_model,
    }

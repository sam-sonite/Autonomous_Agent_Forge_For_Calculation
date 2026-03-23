# utils/evaluator.py
import sympy as sp
from langchain_ollama import ChatOllama

# --- Sympy Ground Truth ---
def compute_ground_truth(expr: str):
    try:
        return float(sp.sympify(expr).evalf())
    except Exception:
        return None

# --- LLM Solver (Mistral or any model) ---
solver_llm = ChatOllama(model="mistral:latest", temperature=0)

def solve_with_llm(query: str, system_prompt: str = "") -> str:
    """Ask LLM to solve the math problem"""
    full_prompt = f"{system_prompt}\nSolve this problem:\n{query}"
    try:
        response = solver_llm.invoke(full_prompt)
        return response.content.strip()
    except Exception:
        return "ERROR"

# --- Evaluator ---
def evaluate_query(expr: str, system_prompt: str = ""):
    """Compare LLM solution against Sympy ground truth"""
    expected = compute_ground_truth(expr)
    if expected is None:
        return {"query": expr, "expected": None, "answer": "Invalid ground truth", "correct": False}

    llm_answer = solve_with_llm(expr, system_prompt=system_prompt)

    # try numeric compare
    try:
        llm_val = float(sp.sympify(llm_answer).evalf())
        correct = abs(llm_val - expected) < 1e-6
    except Exception:
        correct = False

    return {
        "query": expr,
        "expected": expected,
        "answer": llm_answer,
        "correct": correct
    }

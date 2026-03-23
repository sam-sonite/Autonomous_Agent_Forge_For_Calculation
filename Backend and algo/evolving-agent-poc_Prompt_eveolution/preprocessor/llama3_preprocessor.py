# preprocessor/llama3_preprocessor.py
from langchain_community.chat_models import ChatOllama
import re

SYSTEM_PROMPT = """
You are a math query normalizer. Given a user input, return EXACTLY ONE plain symbolic expression
that is Python/Sympy-compatible. NO explanation, NO markdown, NO code fences, NO extra text.
Return only the expression in a single line.

Examples:
Input: "What is 2 + 2?" -> 2+2
Input: "Calculate the integral of sin x" -> integrate(sin(x), x)
Input: "square root of 16" -> sqrt(16)
Input: "What is the limit as x approaches 0 of sin(x)/x?" -> limit(sin(x)/x, x, 0)
Input: "Evaluate ∫(2x+1) dx from 0 to 2" -> integrate(2*x+1, (x,0,2))
Input: "Find sine of 30 degrees" -> sin(pi/6)
"""

def clean_input(query: str) -> str:
    """Strip numbering or fluff from user input before sending to Llama3."""
    return re.sub(r"^\s*\d+[\.\)]\s*", "", query).strip()

def fix_common_patterns(expr: str) -> str:
    """Patch common Sympy syntax mistakes that Llama3 sometimes generates."""
    if not expr or expr == "ERROR":
        return expr

    # limit(..., x=0) -> limit(..., x, 0)
    expr = re.sub(r"limit\((.*),\s*x\s*=\s*([^,\)]+)\)", r"limit(\1, x, \2)", expr)

    # integrate(expr, x, (0, 2)) -> integrate(expr, (x, 0, 2))
    expr = re.sub(r"integrate\((.*),\s*x,\s*\((.*)\)\)", r"integrate(\1, (x, \2))", expr)

    # π → pi
    expr = expr.replace("π", "pi")

    # radians(N) → N*pi/180
    expr = re.sub(r"radians\((\d+)\)", lambda m: f"({m.group(1)}*pi/180)", expr)

    # weird log(e) → 1
    expr = expr.replace("log(e)", "1")

    return expr.strip()

class Llama3Preprocessor:
    def __init__(self, model_name="llama3:latest", temperature=0, max_retries=2):
        self.llm = ChatOllama(model=model_name, temperature=temperature)
        self.max_retries = max_retries

    def preprocess(self, query: str) -> str:
        q = clean_input(query)
        expr = None

        for attempt in range(self.max_retries):
            prompt = SYSTEM_PROMPT + f"\nInput: {q}\nOutput:"
            resp = self.llm.invoke(prompt)
            text = getattr(resp, "content", str(resp)).strip()

            expr = ""
            for ln in text.splitlines():
                ln = ln.strip().replace("`", "")
                if self._looks_like_expression(ln):
                    expr = ln
                    break

            expr = fix_common_patterns(expr)

            if expr and expr != "ERROR":
                break  # ✅ success, stop retrying

        return expr if expr else "ERROR"

    def _looks_like_expression(self, s: str) -> bool:
        if not s:
            return False
        tokens = ("+", "-", "*", "/", "integrate", "diff", "limit",
                  "sqrt", "sin", "cos", "log", "exp", "**", "(", ")")
        if any(t in s for t in tokens) or any(ch.isdigit() for ch in s):
            if len(s.split()) > 8 and not any(t in s for t in tokens):
                return False
            return True
        return False

# utils/codegen.py
import subprocess
import re
from pathlib import Path
import importlib.util
import importlib
import math
import sys
import os
TOOLS_DIR = Path(__file__).resolve().parent.parent / "tools"
EXT_PATH = TOOLS_DIR / "scientific_calc_ext.py"

SYSTEM_INSTRUCTIONS = """You are a code generator.
Output ONLY a single Python function definition:

def _preprocess_expr(expr: str) -> str:
    \"\"\"Return a cleaned math-only expression suitable for ast.parse/eval\"\"\"
    # ...
"""

def call_mistral(prompt: str, model: str = "mistral") -> str:
    proc = subprocess.run(
        ["ollama", "run", model],
        input=prompt.encode("utf-8"),
        capture_output=True,
    )
    if proc.returncode != 0:
        raise RuntimeError(f"Ollama error: {proc.stderr.decode().strip()}")
    return proc.stdout.decode().strip()

def _extract_function(code_text: str) -> str:
    """Extract the _preprocess_expr function, fallback if missing."""
    # Strip code fences
    if "```" in code_text:
        parts = [p for p in code_text.split("```") if "def " in p]
        if parts:
            code_text = parts[0]

    # Regex search
    m = re.search(
        r"def\s+_preprocess_expr\s*\([^)]*\):[\s\S]+", code_text
    )
    if m:
        return m.group(0).rstrip()

    # Fallback if model didn’t comply
    print("⚠️ No valid function found in model output. Using fallback sanitizer.")
    return """def _preprocess_expr(expr: str) -> str:
    \"\"\"Fallback sanitizer for math expressions.\"\"\"
    import re
    # allow digits, operators, parentheses, decimal points, and math functions
    expr = expr.lower()
    expr = re.sub(r'[^0-9+\-*/().e%a-z]', '', expr)
    return expr
"""

def evolve_scientific_calc(user_expr: str, error: str = "", model: str = "mistral"):
    """Evolve scientific calculator preprocessing function."""
    prompt = (
        SYSTEM_INSTRUCTIONS
        + f"\nUser query: {user_expr}\nError: {error}\n\nNow output only the function definition."
    )
    out = call_mistral(prompt, model=model)

    func_code = _extract_function(out)

    # Wrap with full calculator
    wrapper_code = f"""{func_code}

import math
def scientific_calc(expr: str):
    \"\"\"Evaluate scientific expression using _preprocess_expr and math.\"\"\"
    expr = _preprocess_expr(expr)
    # convert ^ into ** for exponentiation
    expr = expr.replace("^", "**")
    allowed = {{k: getattr(math, k) for k in dir(math) if not k.startswith("_")}}
    try:
        return eval(expr, {{"__builtins__": {{}}}}, allowed)
    except Exception as e:
        raise ValueError(f"scientific_calc failed: {{e}}")
"""

    EXT_PATH.write_text(wrapper_code, encoding="utf-8")
    print(f"✅ Evolved scientific calculator patch written to {EXT_PATH}")

    spec = importlib.util.spec_from_file_location("tools.scientific_calc_ext", EXT_PATH)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)

    return mod

import os
import subprocess
from pathlib import Path

TOOLS_DIR = Path(__file__).resolve().parent.parent / "tools"
EXT_FILE = TOOLS_DIR / "scientific_calc_ext.py"

SYSTEM_PROMPT = """You are an AI code generator.
You will ONLY output valid Python function code.
Your task: generate a `_preprocess_expr(expr: str) -> str` function
that converts natural language requests into pure math expressions.

Constraints:
- Do not modify other functions.
- Do not import anything extra.
- Only implement `_preprocess_expr`.
- Expression must be compatible with ast.parse in Python.
"""

def call_mistral(prompt: str) -> str:
    """Call Ollama Mistral and return its response as text."""
    try:
        result = subprocess.run(
            ["ollama", "run", "mistral"],
            input=prompt.encode(),
            capture_output=True,
            check=True,
        )
        return result.stdout.decode().strip()
    except subprocess.CalledProcessError as e:
        return f"# ERROR: {e.stderr.decode()}"

def evolve_scientific_calc(user_expr: str, error: str):
    """Ask Mistral to evolve `_preprocess_expr` and save it to scientific_calc_ext.py."""
    prompt = f"""{SYSTEM_PROMPT}

User query: {user_expr}
Error: {error}

Now generate Python code:
```python
def _preprocess_expr(expr: str) -> str:
    ...
```"""

    code = call_mistral(prompt)

    # Extract code block if wrapped in ```python ... ```
    if "```" in code:
        parts = code.split("```")
        for part in parts:
            if part.strip().startswith("python"):
                code = part.split("python", 1)[1].strip()
            elif part.strip().startswith("def _preprocess_expr"):
                code = part.strip()
                break

    # Safety: only allow definitions of _preprocess_expr
    if not code.strip().startswith("def _preprocess_expr"):
        raise ValueError("Mistral did not return a valid _preprocess_expr")

    # Write/overwrite the extension file
    EXT_FILE.write_text(code, encoding="utf-8")
    print(f"✅ Evolved scientific calculator patch written to {EXT_FILE}")
    return code

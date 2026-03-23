# utils/evaluator.py
import sympy as sp
import re

def evaluate_query(expr_str: str):
    expr_str = expr_str.strip()
    if not expr_str:
        return "Error: empty expression"
    expr_str = expr_str.replace("^", "**")

    m = re.search(r"integrate\((.+)\)\s*from\s*([^\s]+)\s*to\s*([^\s]+)", expr_str, re.IGNORECASE)
    if m:
        inner, a, b = m.group(1), m.group(2), m.group(3)
        expr_str = f"integrate({inner}, (x, {a}, {b}))"

    try:
        if "integrate(" in expr_str or "diff(" in expr_str or "limit(" in expr_str or "solve(" in expr_str:
            res = sp.sympify(expr_str, evaluate=False)
            return str(sp.simplify(res))

        parsed = sp.sympify(expr_str)
        if parsed.is_Number or parsed.free_symbols == set():
            val = parsed.evalf()
            if abs(val - int(val)) < 1e-12:
                return str(int(val))
            return str(val)
        return str(sp.simplify(parsed))

    except Exception as e:
        try:
            safe_globals = {"__builtins__": {}}
            safe_locals = {k: getattr(sp, k) for k in dir(sp) if not k.startswith("_")}
            import math as _math
            for fn in ("sin", "cos", "tan", "sqrt", "log", "exp", "pi", "E"):
                if hasattr(_math, fn):
                    safe_locals[fn] = getattr(_math, fn)
            val = eval(expr_str, safe_globals, safe_locals)
            return str(val)
        except Exception as e2:
            return f"Error: cannot compute ({e})"

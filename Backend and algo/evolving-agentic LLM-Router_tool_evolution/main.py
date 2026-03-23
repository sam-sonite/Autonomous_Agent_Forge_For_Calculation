# main.py
from query_generator import QueryGenerator
from preprocessor.llama3_preprocessor import Llama3Preprocessor

import sympy as sp
import re


def evaluate_query(expr_str: str):
    """
    Try to evaluate a math expression string using sympy.
    Supports:
     - arithmetic (2+2)
     - sqrt, sin, cos, log, exp
     - integrate(expr, x) or integrate(expr, (x, a, b))
     - diff(expr, x)
     - limit(expr, x, value)
     - solve(expr, x)
    Returns a string answer or raises a descriptive Exception.
    """
    expr_str = expr_str.strip()
    if not expr_str:
        return "Error: empty expression"

    expr_str = expr_str.replace("^", "**")

    # definite integral pattern
    m = re.search(r"integrate\((.+)\)\s*from\s*([^\s]+)\s*to\s*([^\s]+)", expr_str, re.IGNORECASE)
    if m:
        inner, a, b = m.group(1), m.group(2), m.group(3)
        expr_str = f"integrate({inner}, (x, {a}, {b}))"

    try:
        if "integrate(" in expr_str:
            res = sp.sympify(expr_str, evaluate=False)
            return str(sp.simplify(res))
        if "diff(" in expr_str:
            res = sp.sympify(expr_str, evaluate=False)
            return str(sp.simplify(res))
        if "limit(" in expr_str:
            res = sp.sympify(expr_str, evaluate=False)
            return str(res)
        if "solve(" in expr_str:
            res = sp.sympify(expr_str, evaluate=False)
            return str(res)

        # otherwise: numeric or symbolic eval
        parsed = sp.sympify(expr_str)
        if parsed.is_Number or parsed.free_symbols == set():
            val = parsed.evalf()
            if abs(val - int(val)) < 1e-12:
                return str(int(val))
            return str(val)
        return str(sp.simplify(parsed))

    except Exception as e:
        # fallback to safe eval
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


def main():
    generator = QueryGenerator()
    pre = Llama3Preprocessor()

    queries = generator.generate_queries(n=10)
    print(f"\nGenerated {len(queries)} queries.\n")

    for idx, raw in enumerate(queries, 1):
        print(f"Query {idx}: {raw}")

        # retry preprocessing
        cleaned = "ERROR"
        for attempt in range(pre.max_retries):
            cleaned = pre.preprocess(raw)
            if cleaned != "ERROR":
                break

        print("Preprocessed:", cleaned)

        ans = evaluate_query(cleaned)
        print("Answer:", {"query": cleaned, "answer": ans})
        print("")


if __name__ == "__main__":
    main()

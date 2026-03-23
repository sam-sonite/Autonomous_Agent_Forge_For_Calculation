import sympy as sp

def scientific_calc(input_text: str) -> str:
    try:
        expr = sp.sympify(input_text)
        result = sp.simplify(expr)
        return str(result)
    except Exception:
        return "Error: cannot compute scientific expression"

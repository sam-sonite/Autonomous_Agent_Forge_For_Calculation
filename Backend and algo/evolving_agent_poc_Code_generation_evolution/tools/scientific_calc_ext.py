def _preprocess_expr(expr: str) -> str:
    """Fallback sanitizer for math expressions."""
    import re
    # allow digits, operators, parentheses, decimal points, and math functions
    expr = expr.lower()
    expr = re.sub(r'[^0-9+\-*/().e%a-z]', '', expr)
    return expr


import math
def scientific_calc(expr: str):
    """Evaluate scientific expression using _preprocess_expr and math."""
    expr = _preprocess_expr(expr)
    # convert ^ into ** for exponentiation
    expr = expr.replace("^", "**")
    allowed = {k: getattr(math, k) for k in dir(math) if not k.startswith("_")}
    try:
        return eval(expr, {"__builtins__": {}}, allowed)
    except Exception as e:
        raise ValueError(f"scientific_calc failed: {e}")

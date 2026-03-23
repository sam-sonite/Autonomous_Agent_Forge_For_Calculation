import ast
import operator as op
import math
import re
from langchain_core.tools import tool

# allowed operators
_ALLOWED_OPS = {
    ast.Add: op.add,
    ast.Sub: op.sub,
    ast.Mult: op.mul,
    ast.Div: op.truediv,
    ast.Pow: op.pow,
    ast.USub: op.neg,
    ast.UAdd: lambda x: x,
    ast.Mod: op.mod,
    ast.FloorDiv: op.floordiv,
}

_ALLOWED_NAMES = {
    "pi": math.pi,
    "e": math.e,
    "tau": math.tau,
    "inf": math.inf,
    "sqrt": math.sqrt,
    "exp": math.exp,
    "log": math.log,
    "log10": math.log10,
    "sin": math.sin,
    "cos": math.cos,
    "tan": math.tan,
    "asin": math.asin,
    "acos": math.acos,
    "atan": math.atan,
    "degrees": math.degrees,
    "radians": math.radians,
    "fabs": math.fabs,
    "factorial": math.factorial,
}

def _eval_node(node):
    if isinstance(node, ast.Constant):
        return node.value
    if isinstance(node, ast.BinOp):
        left, right = _eval_node(node.left), _eval_node(node.right)
        return _ALLOWED_OPS[type(node.op)](left, right)
    if isinstance(node, ast.UnaryOp):
        return _ALLOWED_OPS[type(node.op)](_eval_node(node.operand))
    if isinstance(node, ast.Call):
        func_name = node.func.id
        args = [_eval_node(arg) for arg in node.args]
        return _ALLOWED_NAMES[func_name](*args)
    if isinstance(node, ast.Name):
        return _ALLOWED_NAMES[node.id]
    raise ValueError(f"Unsupported expression: {type(node).__name__}")

# 👇 This is the hook Mistral will patch
def _preprocess_expr(expr: str) -> str:
    """Hook for evolution: strip natural language fluff."""
    return expr

# 🔑 Allow external evolution patches to override _preprocess_expr dynamically
try:
    from tools.scientific_calc_ext import _preprocess_expr as evolved_preprocess_expr
    _preprocess_expr = evolved_preprocess_expr
except ImportError:
    pass  # no evolved patch yet

def scientific_calc(expression: str) -> str:
    expr = expression.strip()
    if not expr:
        raise ValueError("Empty expression")

    # 🔑 evolved hook cleans the input
    expr = _preprocess_expr(expr)

    # allow ^ for power
    expr = expr.replace("^", "**")

    try:
        tree = ast.parse(expr, mode="eval")
        result = _eval_node(tree.body)
        return str(result)
    except Exception as e:
        raise ValueError(f"scientific_calc failed: {e}")

@tool
def scientific_tool(expr: str) -> str:
    """Evaluate advanced scientific math expressions (sin, cos, log, sqrt, pi, etc.)."""
    return scientific_calc(expr)

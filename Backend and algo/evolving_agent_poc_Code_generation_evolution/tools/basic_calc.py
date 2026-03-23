# tools/basic_calc.py
import ast
import operator as op

# safe operators
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

def _eval_node(node):
    if isinstance(node, ast.Constant):  # Py >=3.8: ast.Num -> ast.Constant
        return node.value
    if isinstance(node, ast.BinOp):
        left = _eval_node(node.left)
        right = _eval_node(node.right)
        op_type = type(node.op)
        if op_type not in _ALLOWED_OPS:
            raise ValueError("Unsupported operator")
        return _ALLOWED_OPS[op_type](left, right)
    if isinstance(node, ast.UnaryOp):
        operand = _eval_node(node.operand)
        op_type = type(node.op)
        if op_type not in _ALLOWED_OPS:
            raise ValueError("Unsupported unary operator")
        return _ALLOWED_OPS[op_type](operand)
    raise ValueError(f"Unsupported expression: {type(node).__name__}")

def basic_calc(expression: str) -> str:
    """
    Safely evaluate basic arithmetic expressions (numbers and + - * / ** % //, parentheses).
    Returns result as string or raises ValueError for unsupported input.
    """
    expr = expression.strip()
    if not expr:
        raise ValueError("Empty expression")
    # parse expression into AST and evaluate allowed nodes only
    try:
        tree = ast.parse(expr, mode="eval")
        result = _eval_node(tree.body)
        return str(result)
    except Exception as e:
        raise ValueError(f"basic_calc failed: {e}")

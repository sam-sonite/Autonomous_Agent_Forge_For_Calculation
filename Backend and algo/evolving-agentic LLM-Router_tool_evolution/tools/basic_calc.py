def basic_calc(input_text: str) -> str:
    try:
        return str(eval(input_text))
    except Exception:
        return "Error: cannot compute"

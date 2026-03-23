# evolution/tool_mutator.py
from langchain.agents import initialize_agent, Tool
import importlib
import sys

def add_scientific_tool(llm, codegen=None, query=None, error=""):
    if not codegen:
        raise ValueError("codegen function is required for evolving")

    try:
        # codegen writes out tools/scientific_calc_ext.py and returns module name
        module_name = codegen("Create a function to evaluate advanced math expressions safely")
        if isinstance(module_name, str):
            # dynamically reload to avoid stale import cache
            if module_name in sys.modules:
                del sys.modules[module_name]
            mod = importlib.import_module(module_name)
        else:
            mod = module_name

        if not hasattr(mod, "scientific_calc"):
            raise ImportError(f"{module_name} does not define scientific_calc()")

        new_tool = mod.scientific_calc   # ✅ function, not module
    except Exception as e:
        print("[mutator] ❌ Codegen failed:", e)
        return None

    tools = [
        Tool(
            name="scientific_calc",
            func=new_tool,
            description=new_tool.__doc__ or "Auto-generated scientific calculator tool"
        )
    ]

    agent = initialize_agent(
        tools,
        llm,
        agent="zero-shot-react-description",
        verbose=True,
        handle_parsing_errors=True   # ✅ prevents crashes on messy model output
    )
    print("[mutator] ✅ Added evolved tool: scientific_calc")

    # Auto-run the failed query again if provided
    if query:
        try:
            print("[mutator] 🔄 Retrying query with evolved tool...")
            result = agent.run(query)
            print(f"[mutator] ✅ Result after evolution: {result}")
            return agent
        except Exception as e:
            print("[mutator] ❌ Retry with evolved tool failed:", e)

    return agent

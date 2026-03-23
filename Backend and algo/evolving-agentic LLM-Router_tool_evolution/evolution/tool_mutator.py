from tools.scientific_calc import scientific_calc

def add_scientific_tool(agent):
    # Placeholder: in real case, recompile agent graph with new node
    agent.add_node("scientific_calc", scientific_calc)
    return agent

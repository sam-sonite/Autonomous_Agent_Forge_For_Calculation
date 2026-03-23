from langgraph.prebuilt import create_react_agent


def mutate_prompt(agent):
    """Update the agent’s system prompt to handle more complex tasks."""
    # Clone the LLM but with updated instructions
    llm = agent.llm
    tools = agent.tools

    new_system_prompt = "You are an AI assistant capable of both basic and scientific calculations."
    return create_react_agent(llm, tools=tools, state_modifier=new_system_prompt)
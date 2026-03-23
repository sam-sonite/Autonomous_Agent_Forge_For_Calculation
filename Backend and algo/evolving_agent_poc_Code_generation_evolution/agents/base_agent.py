
from langchain_ollama import ChatOllama
from langgraph.prebuilt import create_react_agent
from tools.basic_calc import basic_calc

def create_base_agent(model: str = "mistral"):
    """
    Create a base agent with a calculator tool attached so simple arithmetic
    runs locally (no model call needed).
    Returns (agent, llm) so callers can reuse the llm.
    """
    llm = ChatOllama(
        model=model,
        temperature=0,
        stream=False   # 🔑 Disable streaming so Ollama behaves like direct CLI call
    )

    # Attach the safe local calculator so 2+2 never needs the model
    agent = create_react_agent(llm, tools=[basic_calc])
    return agent, llm
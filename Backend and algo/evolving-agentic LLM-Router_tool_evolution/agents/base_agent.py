from langgraph.graph import StateGraph
from langchain_community.chat_models import ChatOllama
from tools.basic_calc import basic_calc
from tools.scientific_calc import scientific_calc
from typing import TypedDict, List

# State definition
class AgentState(TypedDict):
    query: str
    prompt: str
    tools: List[str]
    answer: str

def create_base_agent():
    # LLM brain for routing
    llm = ChatOllama(model="mistral", temperature=0)

    graph = StateGraph(AgentState)

    # Tool nodes
    graph.add_node("basic_calc", basic_calc)
    graph.add_node("scientific_calc", scientific_calc)

    # Router node that decides which tool to use
    def router(state: AgentState) -> AgentState:
        query = state["query"]
        # Ask the LLM which tool is appropriate
        decision = llm.invoke(
            f"You are a router. Decide the best tool for this query.\n"
            f"Query: {query}\n"
            f"Options: [basic_calc, scientific_calc]\n"
            f"Respond with only one tool name."
        ).content.strip().lower()

        if "scientific" in decision:
            state["answer"] = scientific_calc(query)
        else:
            state["answer"] = basic_calc(query)

        return state

    # Add router as entry point
    graph.add_node("router", router)
    graph.set_entry_point("router")

    return graph.compile()

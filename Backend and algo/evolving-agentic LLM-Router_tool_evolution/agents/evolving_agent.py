from agents.base_agent import create_base_agent
from evolution.prompt_mutator import mutate_prompt
from evolution.tool_mutator import add_scientific_tool

class EvolvingAgent:
    def __init__(self):
        self.agent = create_base_agent()
        self.prompt = "You are a helpful calculator agent."
        self.tools = ["basic_calc"]

    def run(self, query: str):
        try:
            return self.agent.invoke({"query": query})
        except Exception:
            # If the agent fails, try evolving and retry the query
            self.evolve()
            return self.agent.invoke({"query": query})

    def evolve(self):
        # Add scientific tool only once
        if "scientific_calc" not in self.tools:
            self.prompt = mutate_prompt(self.prompt)
            self.agent = add_scientific_tool(self.agent)
            self.tools.append("scientific_calc")
        else:
            # Placeholder for future evolution (e.g., reasoning, new tools, etc.)
            self.prompt += " You continue to improve with more reasoning skills."

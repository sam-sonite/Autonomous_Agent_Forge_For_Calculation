import random
from langgraph.prebuilt import create_react_agent
from langchain_community.llms import Ollama
from tools.basic_calc import basic_calc
from tools.scientific_calc import scientific_calc


class GAEngine:
    def __init__(self):
        self.population_size = 3
        self.generations = 2

    def fitness(self, agent):
        try:
            res1 = agent.invoke({"input": "2+2"})
            res2 = agent.invoke({"input": "integrate sin(x) dx"})
            return ("4" in str(res1)) + ("cos(x)" in str(res2))
        except Exception:
            return 0

    def evolve(self):
        llm = Ollama(model="mistral")
        base_tools = [basic_calc]

        population = [create_react_agent(llm, tools=base_tools) for _ in range(self.population_size)]

        for _ in range(self.generations):
            scored = [(agent, self.fitness(agent)) for agent in population]
            scored.sort(key=lambda x: x[1], reverse=True)

            best = scored[0][0]

            # Mutation: randomly add scientific tool
            if random.random() > 0.5:
                population = [create_react_agent(llm, tools=[basic_calc, scientific_calc])] * self.population_size
            else:
                population = [best] * self.population_size

        return scored[0][0]
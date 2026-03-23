import random
from agents.evolving_agent import EvolvingAgent

class GAEngine:
    def __init__(self, population_size=3, generations=2):
        self.population_size = population_size
        self.generations = generations

    def fitness(self, agent, eval_set):
        score = 0
        for q, expected in eval_set:
            ans = agent.run(q)
            if expected in ans:
                score += 1
        return score

    def run(self, eval_set):
        population = [EvolvingAgent() for _ in range(self.population_size)]
        for _ in range(self.generations):
            scored = [(self.fitness(agent, eval_set), agent) for agent in population]
            scored.sort(key=lambda x: x[0], reverse=True)
            parents = scored[:2]
            offspring = EvolvingAgent()
            offspring.prompt = parents[0][1].prompt
            population[-1] = offspring
        return population[0]

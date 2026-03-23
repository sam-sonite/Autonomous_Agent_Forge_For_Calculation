# ga_core.py
import pygad
import sympy as sp
import matplotlib
matplotlib.use("Agg")  # headless-safe backend
import matplotlib.pyplot as plt

from query_generator import QueryGenerator
from preprocessor.llama3_preprocessor import Llama3Preprocessor
from solver.mistral_solver import MistralSolver  # ✅ GA evolves Mistral prompts

# -------------------------------
# Query pipeline (dynamic, no hardcoding)
# -------------------------------
def get_dynamic_queries(n=5):
    generator = QueryGenerator()
    pre = Llama3Preprocessor()
    raw_queries = generator.generate_queries(n=n)

    queries = []
    for q in raw_queries:
        expr = pre.preprocess(q)
        if expr and expr != "ERROR":
            expected = safe_eval(expr)  # ✅ sympy ground truth
            if expected is not None:
                queries.append((expr, expected))
    return queries

# -------------------------------
# Helpers
# -------------------------------
def safe_eval(expr: str):
    try:
        return float(sp.sympify(expr).evalf())
    except Exception:
        return None

def decode_solution(solution):
    """Convert numeric genes (ASCII codes) into string prompt."""
    return "".join(chr(int(g)) for g in solution if 32 <= int(g) < 127).strip()

def evaluate_prompt(prompt, test_queries):
    """Score a prompt by running MistralSolver with it."""
    solver = MistralSolver(system_prompt=prompt)
    score = 0

    for expr, expected in test_queries:
        try:
            answer = solver.solve(expr)
            result = safe_eval(answer)
            if result is not None and abs(result - expected) < 1e-6:
                score += 1
        except Exception:
            continue

    # small bonus for longer/more informative prompts
    score += 0.1 * len(prompt.split())
    return score

def fitness_func_factory(test_queries):
    def fitness_func(ga_instance, solution, solution_idx):
        prompt = decode_solution(solution)
        return evaluate_prompt(prompt, test_queries)
    return fitness_func

# -------------------------------
# GA Evolution
# -------------------------------

def evolve_prompt_with_ga(generations=10, n_queries=5):
    test_queries = get_dynamic_queries(n_queries)
    print(f"✅ Pulled {len(test_queries)} dynamic test queries from Llama3")

    # --- callback for progress logging ---
    def on_generation(ga_instance):
        gen = ga_instance.generations_completed
        best = ga_instance.best_solution()[1]  # fitness of best solution
        print(f"📈 Generation {gen} | Best Fitness = {best:.3f}")

    ga_instance = pygad.GA(
        num_generations=generations,
        num_parents_mating=2,
        fitness_func=fitness_func_factory(test_queries),
        sol_per_pop=8,
        num_genes=50,  # prompt length (tunable)
        gene_space=list(range(32, 127)),  # printable ASCII
        mutation_percent_genes=20,
        keep_parents=1,
        on_generation=on_generation  # 👈 hook added
    )

    ga_instance.run()

    # --- save fitness curve ---
    plt.figure()
    ga_instance.plot_fitness(title="GA Fitness Evolution", linewidth=2)
    plt.savefig("fitness_curve.png")
    print("📊 Fitness curve saved as fitness_curve.png")

    # --- best solution ---
    best_solution, best_fitness, *_ = ga_instance.best_solution()
    best_prompt = decode_solution(best_solution)

    return best_prompt, best_fitness

if __name__ == "__main__":
    evolved_prompt, score = evolve_prompt_with_ga()
    print("🔥 Evolved Prompt:", evolved_prompt)
    print("⭐ Fitness Score:", score)

# main.py
from query_generator import QueryGenerator
from preprocessor.llama3_preprocessor import Llama3Preprocessor
from evolution.ga_core import evolve_prompt_with_ga
from solver.mistral_solver import MistralSolver

def main():
    # --- run GA first and get best evolved prompt ---
    evolved_prompt, fitness = evolve_prompt_with_ga(generations=10, n_queries=5)
    print("\n=============================")
    print("🔥 Using Evolved Prompt from GA:")
    print(evolved_prompt)
    print("⭐ Fitness Score:", fitness)
    print("=============================\n")

    # --- generate queries (not affected by GA prompt) ---
    generator = QueryGenerator()
    pre = Llama3Preprocessor()
    solver = MistralSolver(system_prompt=evolved_prompt)  # ✅ use GA prompt here

    queries = generator.generate_queries(n=10)
    print(f"\nGenerated {len(queries)} queries.\n")

    for idx, raw in enumerate(queries, 1):
        print(f"Query {idx}: {raw}")

        # retry preprocessing
        cleaned = "ERROR"
        for attempt in range(pre.max_retries):
            cleaned = pre.preprocess(raw)
            if cleaned != "ERROR":
                break

        print("Preprocessed:", cleaned)

        ans = solver.solve(cleaned)
        print("Answer:", {"query": cleaned, "answer": ans})
        print("")

if __name__ == "__main__":
    main()

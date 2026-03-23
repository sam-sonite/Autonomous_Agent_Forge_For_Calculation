# main.py
from agents.evolving_agent import EvolvingAgent
from utils.codegen import evolve_scientific_calc as generate_and_patch_tool
from evolution.tool_mutator import add_scientific_tool


if __name__ == "__main__":
    print("=" * 60)
    print("🐛  Welcome to Agentics Evolution  🦋")
    print("   (from larva → cocoon → butterfly)")
    print("=" * 60)

    agent = EvolvingAgent(
        model="mistral",
        codegen=generate_and_patch_tool,
        mutator=add_scientific_tool,
    )

    while True:
        query = input("\n🔹 Enter query (or type 'exit' to quit): ")
        if query.lower().strip() in ["exit", "quit"]:
            print("👋 Exiting agent. Goodbye!")
            break
        try:
            answer = agent.run(query)
            print(f"✅ Answer: {answer}")
        except Exception as e:
            print(f"❌ Error: {e}")

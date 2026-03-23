from agents.base_agent import create_base_agent



# main.py
from agents.evolving_agent import EvolvingAgent

def main():
    agent = EvolvingAgent(model="mistral")  # or "llama3.1:8b"
    while True:
        q = input("Enter query (or 'exit' to quit): ").strip()
        if q.lower() in {"exit", "quit"}:
            break
        out = agent.run(q)
        print("Agent result:", out)

if __name__ == "__main__":
    main()

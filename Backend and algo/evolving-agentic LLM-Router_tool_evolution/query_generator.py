from langchain_ollama import ChatOllama

class QueryGenerator:
    def __init__(self, model="llama3:latest"):
        self.llm = ChatOllama(model=model, temperature=0.2)

    def generate_queries(self, n=10):
        """Ask Llama3 to generate progressively complex math queries"""
        prompt = f"""
        Generate {n} math queries for testing.
        Start from very simple (like 2+2), then slightly harder (sqrt, sin, log),
        then calculus (derivatives, integrals, limits).
        Do not solve them, only output queries as plain text, one per line.
        """
        response = self.llm.invoke(prompt)
        queries = [q.strip() for q in response.content.splitlines() if q.strip()]
        return queries

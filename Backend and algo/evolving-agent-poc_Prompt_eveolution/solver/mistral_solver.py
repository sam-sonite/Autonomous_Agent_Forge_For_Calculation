# solver/mistral_solver.py
from langchain_community.chat_models import ChatOllama
import re

class MistralSolver:
    def __init__(self, model="mistral:latest", system_prompt="You are a math solver."):
        self.model = model
        self.system_prompt = system_prompt
        self.llm = ChatOllama(model=model, temperature=0)

    def solve(self, query: str) -> str:
        """Ask Mistral to solve a math query (already preprocessed into symbolic form)."""
        prompt = f"{self.system_prompt}\nSolve this expression and return the result only:\n{query}"
        resp = self.llm.invoke(prompt)
        text = getattr(resp, "content", str(resp)).strip()

        # clean up answer (strip markdown/code fences)
        text = re.sub(r"[`\*]", "", text).strip()
        return text

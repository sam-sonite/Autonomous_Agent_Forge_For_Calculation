# agents/evolving_agent.py

import re
import time
from agents.base_agent import create_base_agent
from evolution.tool_mutator import add_scientific_tool
from tools.basic_calc import basic_calc
from tools.scientific_calc import scientific_calc

# regex for simple arithmetic (numbers, + - * / % // ^ sqrt)
_SIMPLE_ARITH_RE = re.compile(r'^[\d\.\s+\-*/()%//^sqrt]+$', re.IGNORECASE)

# regex for detecting scientific expressions
_SCIENTIFIC_KEYWORDS = re.compile(r'(sqrt|sin|cos|tan|log|exp|\^)', re.IGNORECASE)


class EvolvingAgent:
    def __init__(self, model: str = "mistral"):
        self.model_name = model
        self.agent, self.llm = create_base_agent(model=self.model_name)
        self.evolution_count = 0

    def run(self, query: str):
        # 1) Direct scientific expression check
        if self._is_scientific_expression(query):
            try:
                result = scientific_calc(query)
                print("[scientific_calc direct] →", result)
                return result
            except Exception as e:
                print("scientific_calc failed:", e)
                print("Falling back to LLM...")

        # 2) Simple arithmetic check
        elif self._is_simple_arithmetic(query):
            try:
                result = basic_calc(query)
                print("[basic_calc] →", result)
                return result
            except Exception as e:
                print("basic_calc failed, falling back:", e)

        # 3) Try LLM agent
        try:
            result = self._invoke_agent(query)
            print("[base_agent] →", result)
            return result
        except Exception as e:
            text = str(e)
            if any(err in text for err in ["No data received", "empty response", "load"]):
                print("Model streaming error detected. Recreating model and retrying (no evolution).")
                try:
                    self.agent, self.llm = create_base_agent(model=self.model_name)
                    time.sleep(0.5)
                    result = self._invoke_agent(query)
                    print("[base_agent retry] →", result)
                    return result
                except Exception:
                    print("Retry also failed. Triggering evolution...")
                    return self._evolve_and_retry(query)
            else:
                print("Base agent failed. Triggering evolution...", e)
                return self._evolve_and_retry(query)

    def _invoke_agent(self, query: str):
        result = self.agent.invoke({"input": query})
        # unwrap LangChain’s dict return
        if isinstance(result, dict) and "output" in result:
            return result["output"]
        return result

    def _evolve_and_retry(self, query: str):
        self.evolution_count += 1
        print(f"Evolving agent... attempt {self.evolution_count}")
        self.agent = add_scientific_tool(self.llm)
        time.sleep(0.5)
        try:
            result = self._invoke_agent(query)
            print("[evolved_agent] →", result)
            return result
        except Exception as e:
            print("Evolved agent also failed:", e)
            # last resort: try scientific_calc if it looks like math
            if self._is_scientific_expression(query) or self._is_simple_arithmetic(query):
                try:
                    result = scientific_calc(query)
                    print("[scientific_calc fallback] →", result)
                    return result
                except Exception as e2:
                    print("scientific_calc fallback failed:", e2)
            raise

    def _is_simple_arithmetic(self, query: str) -> bool:
        if not query or len(query) > 200:
            return False
        return bool(_SIMPLE_ARITH_RE.match(query.strip()))

    def _is_scientific_expression(self, query: str) -> bool:
        if not query:
            return False
        return bool(_SCIENTIFIC_KEYWORDS.search(query))

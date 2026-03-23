export interface PromptEvolutionData {
  initialPrompt: string;
  evolvedPrompt: string;
  generationCount: number;
  improvementNotes: string[];
}

export interface FitnessPoint {
  generation: number;
  fitness: number;
}

export interface GAEvolutionData {
  title: string;
  initialFitness: number;
  finalFitness: number;
  improvementPercent: number;
  summary: string[];
  fitnessCurve: FitnessPoint[];
}

export interface QueryDetailsData {
  query: string;
  analysis: string[];
  strategy: string[];
  complexity: string;
  toolsRequired: number;
  newToolsNeeded: number;
}

export interface AgentDescriptor {
  name: string;
  role: string;
  source: string;
}

export interface ModelDescriptor {
  name: string;
  role: string;
  source: string;
}

export interface DashboardData {
  llms: ModelDescriptor[];
  agents: AgentDescriptor[];
  promptEvolution: PromptEvolutionData;
  gaEvolution: GAEvolutionData;
  queryDetails: QueryDetailsData;
  backendSummary: {
    ollamaStatus: string;
    discoveredModels: string[];
    projects: Array<{
      name: string;
      concept: string;
      path: string;
    }>;
  };
}

export interface QueryResponse {
  assistantMessage: string;
  workflowTrigger: boolean;
  route: string;
  modelUsed: string | null;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export function fetchDashboard() {
  return request<DashboardData>('/api/dashboard');
}

export function sendQuery(message: string) {
  return request<QueryResponse>('/api/query', {
    method: 'POST',
    body: JSON.stringify({ message }),
  });
}

import { Card } from './ui/card';
import { useState } from 'react';
import { LLMModal } from './LLMModal';
import { AgentsModal } from './AgentsModal';
import type { AgentDescriptor, ModelDescriptor } from '../lib/api';

interface ActionPanelProps {
  llms: ModelDescriptor[];
  agents: AgentDescriptor[];
}

export function ActionPanel({ llms, agents }: ActionPanelProps) {
  const [showLLMModal, setShowLLMModal] = useState(false);
  const [showAgentsModal, setShowAgentsModal] = useState(false);

  return (
    <>
      <Card className="bg-white shadow-lg p-4">
        <div className="flex items-center gap-2 flex-wrap">
          <button className="px-3 py-1 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors">
            System Prompts
          </button>
          <button 
            className="px-3 py-1 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors" 
            onClick={() => setShowLLMModal(true)}
          >
            LLMs
          </button>
          <button 
            className="px-3 py-1 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors" 
            onClick={() => setShowAgentsModal(true)}
          >
            Agents
          </button>
          <button className="px-3 py-1 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors">
            Logs
          </button>
          <button className="px-3 py-1 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors">
            Retry
          </button>
        </div>
      </Card>

      {/* Modals */}
      <LLMModal isOpen={showLLMModal} onClose={() => setShowLLMModal(false)} llms={llms} />
      <AgentsModal isOpen={showAgentsModal} onClose={() => setShowAgentsModal(false)} agents={agents} />
    </>
  );
}

import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';

interface StageDetailsProps {
  currentStep: number;
}

export function StageDetails({ currentStep }: StageDetailsProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const stages = [
    {
      step: 0,
      title: 'Ready to Start',
      description: 'Click Play to begin the agentic workflow demonstration.',
      category: 'System',
      color: 'bg-slate-100 text-slate-700',
    },
    {
      step: 1,
      title: 'Query Task Arrives',
      description: 'A user query for a complex scientific calculator enters the system, requiring sophisticated processing and web scraping capabilities.',
      category: 'Input',
      color: 'bg-blue-100 text-blue-700',
    },
    {
      step: 2,
      title: 'Base LLM: Interpret & Route',
      description: 'The base LLM analyzes the query complexity and routes it to an appropriate specialized agent (SLM).',
      category: 'Orchestration',
      color: 'bg-blue-100 text-blue-700',
    },
    {
      step: 3,
      title: 'Agent Attempts Task',
      description: 'The agent attempts to solve the task with its current capabilities but encounters limitations.',
      category: 'Agent',
      color: 'bg-blue-100 text-blue-700',
    },
    {
      step: 4,
      title: 'Self-Reflection & Tool Selection',
      description: 'The agent reflects on its failure, analyzes what went wrong, and tries the Basic Calculator tool but realizes it needs more advanced capabilities.',
      category: 'Agent',
      color: 'bg-green-100 text-green-700',
    },
    {
      step: 5,
      title: 'Tool Execution',
      description: 'The selected tool executes and provides a partial solution, but the task still requires additional capabilities.',
      category: 'Agent',
      color: 'bg-green-100 text-green-700',
    },
    {
      step: 6,
      title: 'Escalation Decision',
      description: 'The agent detects that it needs TWO higher-order tools that don\'t exist yet: Scientific Calculator and Advanced Web Scraper. It escalates to the code generation system.',
      category: 'Agent',
      color: 'bg-amber-100 text-amber-700',
    },
    {
      step: 7,
      title: 'Code-Gen LLM Invoked',
      description: 'The base LLM invokes a specialized code generation LLM to create two new tools tailored to the specific needs: Scientific Calculator and Advanced Web Scraper.',
      category: 'Code Generation',
      color: 'bg-orange-100 text-orange-700',
    },
    {
      step: 8,
      title: 'Tool Generation & Installation',
      description: 'The code-gen LLM generates both new tools, tests them, and hot-deploys them into the agent\'s available toolkit.',
      category: 'Code Generation',
      color: 'bg-orange-100 text-orange-700',
    },
    {
      step: 9,
      title: 'Task Completed Successfully',
      description: 'With both new tools now available, the agent successfully completes the complex scientific calculator task using the Scientific Calculator and Advanced Web Scraper together.',
      category: 'Success',
      color: 'bg-green-100 text-green-700',
    },
    {
      step: 10,
      title: 'System Ready for New Query',
      description: 'The system is now enhanced with the new tool and ready to handle similar complex queries more efficiently.',
      category: 'Complete',
      color: 'bg-green-100 text-green-700',
    },
  ];

  const currentStage = stages.find(s => s.step === currentStep) || stages[0];

  return (
    <Card className="bg-white shadow-lg overflow-hidden">
      <div 
        className="p-6 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center gap-3">
          <h3 className="mb-0">Stage Details</h3>
          <Badge className={currentStage.color}>
            {currentStage.category}
          </Badge>
        </div>
        <motion.div
          animate={{ rotate: isCollapsed ? 0 : 180 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronUp size={20} className="text-slate-600" />
        </motion.div>
      </div>
      
      <AnimatePresence initial={false}>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 space-y-3">
              <h4 className="text-blue-600">
                {currentStage.title}
              </h4>
              
              <p className="text-slate-600">
                {currentStage.description}
              </p>

              {currentStep >= 4 && currentStep <= 6 && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-blue-800 mb-0">
                    💡 The agent uses self-reflection to understand its limitations and adaptively select or request new tools.
                  </p>
                </div>
              )}

              {currentStep >= 7 && currentStep <= 8 && (
                <div className="mt-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <p className="text-orange-800 mb-0">
                    🔧 Code generation enables the system to dynamically expand its capabilities without manual intervention.
                  </p>
                </div>
              )}

              {currentStep >= 9 && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-green-800 mb-0">
                    ✨ The system has successfully learned and can now handle similar complex queries more efficiently.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
import { motion } from 'motion/react';
import { Card } from './ui/card';
import { Search, Compass, Bot, Wrench, Settings, AlertTriangle, Puzzle, Code, CheckCircle, RotateCw, TriangleAlert, Users, Shuffle, Dna, Zap, Flag, ScrollText, ArrowLeft, Eye, Hand } from 'lucide-react';
import { useState } from 'react';
import { QueryDetailModal } from './QueryDetailModal';
import { EvolutionModal } from './EvolutionModal';
import { GALogsModal } from './GALogsModal';
import { PromptModal } from './PromptModal';
import type { GAEvolutionData, PromptEvolutionData, QueryDetailsData } from '../lib/api';

interface FlowVisualizationProps {
  currentStep: number;
  isManualMode: boolean;
  onStartWorkflow?: () => void;
  isGAWorkflow?: boolean;
  onInitiateEvolution?: (proceed: boolean) => void;
  onGoBackToMainPage?: () => void;
  hasCompletedEvolution?: boolean;
  promptEvolution?: PromptEvolutionData;
  gaEvolution?: GAEvolutionData;
  queryDetails?: QueryDetailsData;
}

export function FlowVisualization({ currentStep, isManualMode, onStartWorkflow, isGAWorkflow = false, onInitiateEvolution, onGoBackToMainPage, hasCompletedEvolution = false, promptEvolution, gaEvolution, queryDetails }: FlowVisualizationProps) {
  const [showQueryDetail, setShowQueryDetail] = useState(false);
  const [showEvolutionModal, setShowEvolutionModal] = useState(false);
  const [showGALogsModal, setShowGALogsModal] = useState(false);
  const [showPromptModal, setShowPromptModal] = useState<'evolved' | 'initial' | null>(null);

  const defaultStages = [
    { id: 1, icon: Search, label: 'Query Task Arrives', category: 'input', clickable: true },
    { id: 2, icon: Compass, label: 'Base LLM Routes to Agent', category: 'orch' },
    { id: 3, icon: Bot, label: 'Agent Attempts Task', category: 'agent' },
    { id: 4, icon: Wrench, label: 'Self-Reflection & Tool Selection', category: 'agent' },
    { id: 5, icon: Settings, label: 'Tool Executes', category: 'agent' },
    { id: 6, icon: AlertTriangle, label: 'Escalate for New Tool', category: 'agent' },
    { id: 7, icon: Puzzle, label: 'Invoke Code-Gen LLM', category: 'codegen' },
    { id: 8, icon: Code, label: 'Generate & Install Tool', category: 'codegen' },
    { id: 9, icon: CheckCircle, label: 'Task Completed', category: 'finish' },
    { id: 10, icon: RotateCw, label: 'Ready for New Query', category: 'finish' },
  ];

  const gaStages = [
    { id: 1, icon: Users, label: 'Population Initialization', category: 'ga' },
    { id: 2, icon: Shuffle, label: 'Selection', category: 'ga' },
    { id: 3, icon: Dna, label: 'Crossover', category: 'ga' },
    { id: 4, icon: Zap, label: 'Mutation', category: 'ga' },
    { id: 5, icon: Users, label: 'New Population', category: 'ga', clickable: true },
    { id: 6, icon: Flag, label: 'Terminate', category: 'finish' },
  ];

  const stages = isGAWorkflow ? gaStages : defaultStages;
  const maxStep = isGAWorkflow ? 6 : 10;

  const handleEvolutionIconClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowEvolutionModal(true);
  };

  return (
    <>
      <Card className={`p-6 shadow-lg h-[800px] flex flex-col transition-all duration-300 ${
        isManualMode ? 'bg-amber-50 ring-2 ring-amber-400' : 'bg-white'
      }`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="mb-0">Workflow Timeline</h3>
          <div className="flex items-center gap-3">
            {!isManualMode && (
              <button
                onClick={onStartWorkflow}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Start a workflow
              </button>
            )}
            <motion.button
              animate={{
                scale: isManualMode ? 1.05 : 1,
              }}
              className={`px-4 py-2 rounded-lg transition-all ${
                isManualMode 
                  ? 'bg-amber-500 text-white shadow-lg ring-2 ring-amber-300' 
                  : 'bg-green-500 text-white shadow-md'
              }`}
            >
              {isManualMode ? (
                <span className="flex items-center gap-2">
                  <Hand size={16} />
                  Manual Mode
                </span>
              ) : (
                'Autonomous Mode'
              )}
            </motion.button>
          </div>
        </div>
        
        <div className="relative flex-1 overflow-auto scrollbar-thin">
          {/* Progress line */}
          {/* Removed pre-built lines */}

          {currentStep === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center space-y-4 max-w-md">
                <div className="w-20 h-20 mx-auto rounded-full bg-slate-100 flex items-center justify-center">
                  <Search className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-slate-700 mb-2">Ready to Begin</h3>
                <p className="text-slate-500 mb-0">
                  {isManualMode 
                    ? "Ask me a complex query in the chat to start the agentic workflow"
                    : "Click 'Start a workflow' to begin the visualization"}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {stages.map((stage) => {
                const Icon = stage.icon;
                const isActive = currentStep >= stage.id;
                const isHighlighted = currentStep === stage.id;
                
                const categoryColor = {
                  input: 'bg-blue-500',
                  orch: 'bg-blue-500',
                  agent: 'bg-green-500',
                  codegen: 'bg-orange-500',
                  finish: 'bg-purple-500',
                  ga: 'bg-pink-500',
                }[stage.category];

                return (
                  <motion.div
                    key={stage.id}
                    initial={{ opacity: 0.3, x: -20 }}
                    animate={{ 
                      opacity: isActive ? 1 : 0.3,
                      x: isHighlighted ? 10 : 0,
                      scale: isHighlighted ? 1.02 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                    className="relative flex items-center gap-4"
                    onClick={() => {
                      if (stage.clickable) {
                        if (isGAWorkflow) {
                          setShowGALogsModal(true);
                        } else {
                          setShowQueryDetail(true);
                        }
                      }
                    }}
                    style={{ cursor: stage.clickable ? 'pointer' : 'default' }}
                  >
                    {/* Node circle */}
                    <motion.div
                      animate={{
                        scale: isHighlighted ? 1.2 : 1,
                        boxShadow: isHighlighted 
                          ? '0 0 0 4px rgba(59, 130, 246, 0.2)' 
                          : '0 0 0 0px rgba(59, 130, 246, 0)',
                      }}
                      className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center ${
                        isActive ? categoryColor : 'bg-slate-300'
                      }`}
                    >
                      <Icon className="text-white" size={20} />
                    </motion.div>

                    {/* Content */}
                    <div className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                      isHighlighted
                        ? 'border-blue-500 bg-blue-50'
                        : isActive
                        ? 'border-slate-200 bg-white'
                        : 'border-slate-100 bg-slate-50'
                    } ${stage.clickable ? 'hover:border-blue-300' : ''}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <p className={`mb-0 ${isHighlighted ? 'text-blue-900' : 'text-slate-700'}`}>
                            {stage.id}. {stage.label}
                            {!isGAWorkflow && stage.id === 5 && currentStep >= 10 && !hasCompletedEvolution && ' (Partial)'}
                            {stage.clickable && !isGAWorkflow && <Eye size={16} className="inline ml-2 text-blue-500" />}
                            {stage.clickable && isGAWorkflow && <ScrollText size={16} className="inline ml-2 text-blue-500" />}
                          </p>
                          {!isGAWorkflow && stage.id === 5 && currentStep >= 10 && !hasCompletedEvolution && (
                            <button
                              onClick={handleEvolutionIconClick}
                              className="hover:scale-110 transition-transform cursor-pointer"
                            >
                              <TriangleAlert size={16} className="text-yellow-500" />
                            </button>
                          )}
                        </div>
                        {isActive && currentStep > stage.id && (
                          <CheckCircle size={16} className="text-green-600" />
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {/* Show prompt comparison buttons and go back option after GA workflow completes */}
              {isGAWorkflow && currentStep >= 6 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-8 space-y-4"
                >
                  {/* Prompt buttons */}
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setShowPromptModal('evolved')}
                      className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                    >
                      <span>Evolved Prompt</span>
                    </button>
                    <button
                      onClick={() => setShowPromptModal('initial')}
                      className="px-4 py-2.5 bg-slate-600 hover:bg-slate-700 text-white rounded-md transition-colors shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                    >
                      <span>Initial Prompt</span>
                    </button>
                  </div>

                  {/* Go back option */}
                  <button
                    onClick={onGoBackToMainPage}
                    className="w-full px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                  >
                    <ArrowLeft size={18} />
                    <span>Go Back to Main Page</span>
                  </button>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </Card>

      <QueryDetailModal 
        isOpen={showQueryDetail} 
        onClose={() => setShowQueryDetail(false)} 
        details={queryDetails}
      />

      <EvolutionModal
        isOpen={showEvolutionModal}
        onClose={() => setShowEvolutionModal(false)}
        onInitiateEvolution={onInitiateEvolution || (() => {})}
      />

      <GALogsModal
        isOpen={showGALogsModal}
        onClose={() => setShowGALogsModal(false)}
        gaData={gaEvolution}
      />

      {showPromptModal && (
        <PromptModal
          isOpen={true}
          onClose={() => setShowPromptModal(null)}
          type={showPromptModal}
          promptData={promptEvolution}
        />
      )}
    </>
  );
}

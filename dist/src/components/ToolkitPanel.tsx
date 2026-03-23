import { motion, AnimatePresence } from 'motion/react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Wrench, FileSearch, Calculator, Database, Globe, Sparkles, CheckCircle, Loader2 } from 'lucide-react';
import { ChatBot } from './ChatBot';

interface ToolkitPanelProps {
  currentStep: number;
  isChatExpanded: boolean;
  onChatToggle: () => void;
  onStartWorkflow: () => void;
  isGAWorkflow?: boolean;
}

interface Tool {
  id: string;
  name: string;
  icon: typeof Wrench;
  description: string;
  addedAt: number;
  usedAt?: number;
  isGenerating?: boolean;
  category: 'built-in' | 'generated';
}

export function ToolkitPanel({ currentStep, isChatExpanded, onChatToggle, onStartWorkflow, isGAWorkflow = false }: ToolkitPanelProps) {
  // During GA workflow, freeze the toolkit at the completed state (step 10)
  const effectiveStep = isGAWorkflow ? 10 : currentStep;
  
  const allTools: Tool[] = [
    {
      id: 'file-reader',
      name: 'File Reader',
      icon: FileSearch,
      description: 'Reads and parses various file formats',
      addedAt: 0,
      category: 'built-in',
    },
    {
      id: 'calculator',
      name: 'Basic Calculator',
      icon: Calculator,
      description: 'Performs basic arithmetic operations',
      addedAt: 0,
      usedAt: 4,
      category: 'built-in',
    },
    {
      id: 'database-query',
      name: 'Database Query',
      icon: Database,
      description: 'Queries structured data sources',
      addedAt: 0,
      category: 'built-in',
    },
    {
      id: 'sci-calc-generating',
      name: 'Scientific Calculator',
      icon: Calculator,
      description: 'Advanced calculator for complex math, matrices, calculus, and statistics',
      addedAt: 7,
      isGenerating: true,
      category: 'generated',
    },
    {
      id: 'web-scraper-generating',
      name: 'Advanced Web Scraper',
      icon: Globe,
      description: 'Extracts structured data from complex web pages with JS rendering',
      addedAt: 7,
      isGenerating: true,
      category: 'generated',
    },
    {
      id: 'sci-calc',
      name: 'Scientific Calculator',
      icon: Calculator,
      description: 'Advanced calculator for complex math, matrices, calculus, and statistics',
      addedAt: 8,
      usedAt: 9,
      category: 'generated',
    },
    {
      id: 'web-scraper',
      name: 'Advanced Web Scraper',
      icon: Globe,
      description: 'Extracts structured data from complex web pages with JS rendering',
      addedAt: 8,
      usedAt: 9,
      category: 'generated',
    },
  ];

  const visibleTools = allTools.filter(tool => {
    if (tool.isGenerating) {
      return effectiveStep === 7 || effectiveStep === 8;
    }
    return effectiveStep >= tool.addedAt && !tool.isGenerating;
  });

  const activeToolId = visibleTools.find(t => t.usedAt === effectiveStep)?.id;
  const toolsUsedCount = visibleTools.filter(t => t.usedAt && effectiveStep >= t.usedAt).length;

  return (
    <Card className="p-6 bg-white shadow-lg h-[800px] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="mb-1">Agent Toolkit</h3>
          <p className="text-slate-500">
            {visibleTools.length} tool{visibleTools.length !== 1 ? 's' : ''} available
          </p>
        </div>
        <div className="flex gap-6">
          <div className="text-right">
            <div className="text-slate-500">Tools Generated</div>
            <div className="text-orange-600">
              {effectiveStep >= 8 ? '2' : '0'}
            </div>
          </div>
          <div className="text-right">
            <div className="text-slate-500">Tools Used</div>
            <div className="text-blue-600">{toolsUsedCount}</div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto scrollbar-thin">
        <AnimatePresence mode="popLayout">
          {visibleTools.map((tool) => {
            const Icon = tool.icon;
            const isActive = activeToolId === tool.id;
            const isUsed = tool.usedAt && effectiveStep >= tool.usedAt;
            const isNew = effectiveStep === tool.addedAt && tool.addedAt > 0;

            return (
              <motion.div
                key={tool.id}
                layout
                initial={{ opacity: 0, x: tool.category === 'generated' ? 100 : 0, scale: 0.8 }}
                animate={{ 
                  opacity: 1, 
                  x: 0, 
                  scale: isActive ? 1.02 : 1,
                  boxShadow: isActive 
                    ? '0 8px 24px rgba(59, 130, 246, 0.3)' 
                    : '0 2px 8px rgba(0, 0, 0, 0.1)'
                }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4, type: 'spring' }}
                className={`relative p-4 rounded-lg border-2 transition-all ${
                  isActive 
                    ? 'border-blue-500 bg-blue-50' 
                    : isUsed
                    ? 'border-green-300 bg-green-50'
                    : tool.category === 'generated'
                    ? 'border-orange-300 bg-orange-50'
                    : 'border-slate-200 bg-white'
                }`}
              >
                {isNew && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute -top-2 -right-2"
                  >
                    <Badge className="bg-orange-500 text-white">
                      <Sparkles size={12} className="mr-1" />
                      New!
                    </Badge>
                  </motion.div>
                )}

                {tool.isGenerating && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute -top-2 -right-2"
                  >
                    <Badge className="bg-blue-500 text-white">
                      <Loader2 size={12} className="mr-1 animate-spin" />
                      Generating...
                    </Badge>
                  </motion.div>
                )}

                <div className="flex items-start gap-3">
                  <motion.div
                    animate={{ 
                      rotate: isActive ? [0, -10, 10, -10, 0] : 0,
                      scale: isActive ? 1.1 : 1
                    }}
                    transition={{ duration: 0.5 }}
                    className={`p-2 rounded-lg ${
                      isActive 
                        ? 'bg-blue-100' 
                        : isUsed
                        ? 'bg-green-100'
                        : tool.category === 'generated'
                        ? 'bg-orange-100'
                        : 'bg-slate-100'
                    }`}
                  >
                    <Icon 
                      size={20} 
                      className={
                        isActive 
                          ? 'text-blue-600' 
                          : isUsed
                          ? 'text-green-600'
                          : tool.category === 'generated'
                          ? 'text-orange-600'
                          : 'text-slate-600'
                      } 
                    />
                  </motion.div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={
                        isActive 
                          ? 'text-blue-900' 
                          : isUsed
                          ? 'text-green-900'
                          : 'text-slate-900'
                      }>
                        {tool.name}
                      </h4>
                      {isUsed && !isActive && (
                        <CheckCircle size={14} className="text-green-600 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-slate-600">
                      {tool.description}
                    </p>
                    
                    {tool.category === 'generated' && !tool.isGenerating && (
                      <div className="mt-2">
                        <Badge variant="outline" className="text-orange-600 border-orange-300">
                          AI Generated
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>

                {isActive && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 rounded-b-lg origin-left"
                  />
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {currentStep === 0 && (
        <div className="flex items-center justify-center h-64 text-slate-400">
          <div className="text-center">
            <Wrench size={48} className="mx-auto mb-3 opacity-20" />
            <p>Start the workflow to see the toolkit</p>
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
              onClick={onStartWorkflow}
            >
              Start Workflow
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {effectiveStep >= 8 && !isGAWorkflow && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-2 border-blue-200"
          >
            <div className="flex items-start gap-3">
              <Sparkles className="text-blue-600 flex-shrink-0" size={20} />
              <div>
                <p className="text-blue-900 mb-1">Toolkit Enhanced!</p>
                <p className="text-blue-700">
                  The agent now has Scientific Calculator and Advanced Web Scraper capabilities.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {currentStep === 6 && !isGAWorkflow && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-amber-50 rounded-lg border-2 border-amber-200"
          >
            <div className="flex items-start gap-3">
              <Loader2 className="text-amber-600 flex-shrink-0 animate-spin" size={20} />
              <div>
                <p className="text-amber-900 mb-1">Tool Gap Detected</p>
                <p className="text-amber-700">
                  Agent needs advanced scientific calculation and web scraping tools...
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <div className="mt-6">
        <ChatBot 
          isExpanded={isChatExpanded} 
          onToggle={onChatToggle}
          onStartWorkflow={onStartWorkflow}
          currentStep={currentStep}
        />
      </div>
    </Card>
  );
}
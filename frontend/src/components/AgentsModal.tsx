import { X, Bot, Cog } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { AgentDescriptor } from '../lib/api';

interface AgentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  agents: AgentDescriptor[];
}

export function AgentsModal({ isOpen, onClose, agents }: AgentsModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-green-500 to-green-600">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <Bot className="text-white" size={24} />
                  </div>
                  <h2 className="mb-0 text-white">Agents</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="text-white" size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="space-y-3">
                  {agents.map((agent, index) => (
                    <motion.div
                      key={agent.name + agent.role}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-green-300 hover:bg-green-50 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                          <Cog className="text-green-600" size={20} />
                        </div>
                        <div>
                          <p className="mb-0">{agent.name}</p>
                          <p className="text-sm text-slate-500 mb-0">({agent.role})</p>
                          <p className="text-xs text-slate-400 mb-0">{agent.source}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

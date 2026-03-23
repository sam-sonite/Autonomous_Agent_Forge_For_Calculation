import { X, Cpu, Brain } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { ModelDescriptor } from '../lib/api';

interface LLMModalProps {
  isOpen: boolean;
  onClose: () => void;
  llms: ModelDescriptor[];
}

export function LLMModal({ isOpen, onClose, llms }: LLMModalProps) {
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
              <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-blue-500 to-blue-600">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <Cpu className="text-white" size={24} />
                  </div>
                  <h2 className="mb-0 text-white">LLMs</h2>
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
                  {llms.map((llm, index) => (
                    <motion.div
                      key={llm.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <Brain className="text-blue-600" size={20} />
                        </div>
                        <div>
                          <p className="mb-0">{llm.name}</p>
                          <p className="text-sm text-slate-500 mb-0">({llm.role})</p>
                          <p className="text-xs text-slate-400 mb-0">{llm.source}</p>
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

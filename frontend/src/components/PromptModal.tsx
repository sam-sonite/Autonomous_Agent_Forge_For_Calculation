import { X, Dna, FileText, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { PromptEvolutionData } from '../lib/api';

interface PromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'evolved' | 'initial';
  promptData?: PromptEvolutionData;
}

export function PromptModal({ isOpen, onClose, type, promptData }: PromptModalProps) {
  const isEvolved = type === 'evolved';
  const initialPrompt = promptData?.initialPrompt ?? 'Prompt data is loading...';
  const evolvedPrompt = promptData?.evolvedPrompt ?? 'Prompt data is loading...';
  const improvements = promptData?.improvementNotes ?? [];

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
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
            >
              {/* Header */}
              <div className={`p-6 border-b flex items-center justify-between ${
                isEvolved ? 'bg-green-50' : 'bg-red-50'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isEvolved ? 'bg-green-500' : 'bg-red-500'
                  }`}>
                    {isEvolved ? (
                      <Dna className="text-white" size={20} />
                    ) : (
                      <FileText className="text-white" size={20} />
                    )}
                  </div>
                  <h2 className="mb-0">
                    {isEvolved ? 'Evolved Prompt' : 'Initial Prompt'}
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <div className="mb-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                    isEvolved 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {isEvolved ? `Generation ${promptData?.generationCount ?? 10}` : 'Generation 0'}
                  </span>
                </div>

                <div className={`p-4 rounded-lg border-2 ${
                  isEvolved 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-red-50 border-red-200'
                }`}>
                  <p className="mb-0 whitespace-pre-wrap">
                    {isEvolved ? evolvedPrompt : initialPrompt}
                  </p>
                </div>

                {isEvolved && (
                  <div className="mt-6 space-y-3">
                    <h4 className="mb-2">Improvements Over Initial Prompt:</h4>
                    <ul className="space-y-2">
                      {improvements.map((note) => (
                        <li key={note} className="flex items-start gap-2">
                          <CheckCircle2 className="text-green-600 flex-shrink-0" size={18} />
                          <span>{note}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {!isEvolved && (
                  <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="mb-0 text-sm text-amber-800">
                      <strong>Note:</strong> This initial prompt lacks specificity and clear structure, 
                      making it harder for the agent to understand requirements and select appropriate tools.
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t bg-slate-50">
                <button
                  onClick={onClose}
                  className="w-full px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

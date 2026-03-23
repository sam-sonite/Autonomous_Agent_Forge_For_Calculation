import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import type { GAEvolutionData } from '../lib/api';
import { SimpleLineChart } from './SimpleLineChart';

interface GALogsModalProps {
  isOpen: boolean;
  onClose: () => void;
  gaData?: GAEvolutionData;
}

export function GALogsModal({ isOpen, onClose, gaData }: GALogsModalProps) {
  const chartData = gaData?.fitnessCurve ?? [];

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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden pointer-events-auto">
              {/* Header */}
              <div className="px-6 py-4 bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-between">
                <h3 className="mb-0 text-white">GA Fitness Evolution Logs</h3>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                <div className="space-y-4">
                  <div>
                    <p className="text-slate-700 mb-4">
                      The Genetic Algorithm has successfully evolved the agent's capabilities through multiple generations. 
                      Below is the fitness evolution chart showing the improvement across 10 generations.
                    </p>
                  </div>

                  {/* Chart Image */}
                  <div className="bg-white rounded-lg border-2 border-slate-200 p-4">
                    <SimpleLineChart points={chartData} />
                  </div>

                  {/* Additional Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                      <div className="text-blue-600 mb-1">Initial Fitness</div>
                      <div className="text-blue-900">{gaData?.initialFitness?.toFixed(2) ?? '0.00'}</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                      <div className="text-green-600 mb-1">Final Fitness</div>
                      <div className="text-green-900">{gaData?.finalFitness?.toFixed(2) ?? '0.00'}</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                      <div className="text-purple-600 mb-1">Improvement</div>
                      <div className="text-purple-900">+{gaData?.improvementPercent ?? 0}%</div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <h4 className="text-slate-900 mb-2">Evolution Summary</h4>
                    <ul className="space-y-2 text-slate-700">
                      {(gaData?.summary ?? []).map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <span className="text-green-500 mt-1">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

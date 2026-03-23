import { motion, AnimatePresence } from 'motion/react';
import { X, MessageSquare, Brain, Target } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import type { QueryDetailsData } from '../lib/api';

interface QueryDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  details?: QueryDetailsData;
}

export function QueryDetailModal({ isOpen, onClose, details }: QueryDetailModalProps) {
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl max-h-[80vh] overflow-auto"
          >
            <Card className="p-6 bg-white shadow-2xl">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="mb-2">User Query Details</h2>
                  <p className="text-slate-600">The task that initiated this workflow</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="rounded-full"
                >
                  <X size={20} />
                </Button>
              </div>

              <div className="space-y-6">
                {/* Query */}
                <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                  <div className="flex items-start gap-3 mb-3">
                    <MessageSquare className="text-blue-600 flex-shrink-0" size={20} />
                    <div>
                      <h4 className="text-blue-900 mb-2">User Query</h4>
                      <p className="text-blue-800">
                        "{details?.query ?? 'Query details are loading.'}"
                      </p>
                    </div>
                  </div>
                </div>

                {/* Analysis */}
                <div className="p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
                  <div className="flex items-start gap-3">
                    <Brain className="text-purple-600 flex-shrink-0" size={20} />
                    <div>
                      <h4 className="text-purple-900 mb-2">Agent Analysis</h4>
                      <ol className="list-decimal list-inside mt-2 space-y-1 text-purple-800 ml-4">
                        {(details?.analysis ?? []).map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ol>
                      <p className="text-purple-800 mt-2">
                        ⚠️ Current toolkit lacks tools for scraping JavaScript-rendered web pages.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Solution */}
                <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                  <div className="flex items-start gap-3">
                    <Target className="text-green-600 flex-shrink-0" size={20} />
                    <div>
                      <h4 className="text-green-900 mb-2">Solution Strategy</h4>
                      <ol className="list-decimal list-inside mt-2 space-y-1 text-green-800 ml-4">
                        {(details?.strategy ?? []).map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-slate-500">Complexity</div>
                      <div className="text-orange-600">{details?.complexity ?? 'Unknown'}</div>
                    </div>
                    <div>
                      <div className="text-slate-500">Tools Required</div>
                      <div className="text-blue-600">{details?.toolsRequired ?? 0}</div>
                    </div>
                    <div>
                      <div className="text-slate-500">New Tools Needed</div>
                      <div className="text-purple-600">{details?.newToolsNeeded ?? 0}</div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

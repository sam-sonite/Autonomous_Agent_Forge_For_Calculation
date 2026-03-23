import { motion, AnimatePresence } from 'motion/react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { AlertTriangle } from 'lucide-react';

interface EvolutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInitiateEvolution: (proceed: boolean) => void;
}

export function EvolutionModal({ isOpen, onClose, onInitiateEvolution }: EvolutionModalProps) {
  const handleYes = () => {
    onInitiateEvolution(true);
    onClose();
  };

  const handleNo = () => {
    onInitiateEvolution(false);
    onClose();
  };

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
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            <Card className="bg-white shadow-2xl max-w-md w-full mx-4 pointer-events-auto">
              <div className="p-8">
                {/* Icon */}
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center">
                    <AlertTriangle className="w-8 h-8 text-yellow-600" />
                  </div>
                </div>

                {/* Content */}
                <div className="text-center mb-8">
                  <h3 className="mb-4">Initiate Evolution?</h3>
                  <p className="text-slate-600 mb-0">
                    The current tool execution was partial. Would you like to initiate a Genetic Algorithm (GA) evolution cycle to optimize the tool?
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex gap-4">
                  <Button
                    onClick={handleNo}
                    variant="outline"
                    className="flex-1"
                  >
                    No
                  </Button>
                  <Button
                    onClick={handleYes}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    Yes
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

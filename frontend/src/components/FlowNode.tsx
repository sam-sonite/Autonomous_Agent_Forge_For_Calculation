import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface FlowNodeProps {
  icon: LucideIcon;
  label: string;
  x: number;
  y: number;
  category: 'input' | 'orch' | 'agent' | 'codegen' | 'finish';
  isActive: boolean;
  isHighlighted: boolean;
}

export function FlowNode({ icon: Icon, label, x, y, category, isActive, isHighlighted }: FlowNodeProps) {
  const categoryStyles = {
    input: 'border-blue-600 bg-white',
    orch: 'border-blue-600 bg-white',
    agent: 'border-blue-600 bg-white',
    codegen: 'border-orange-500 bg-orange-50',
    finish: 'border-blue-600 bg-white',
  };

  const categoryStylesActive = {
    input: 'border-blue-600 bg-blue-50',
    orch: 'border-blue-600 bg-blue-50',
    agent: 'border-blue-600 bg-blue-50',
    codegen: 'border-orange-500 bg-orange-100',
    finish: 'border-green-600 bg-green-50',
  };

  const toolCategories = ['agent'];
  const baseStyle = isActive 
    ? categoryStylesActive[category]
    : category === 'codegen' 
    ? categoryStyles[category]
    : 'border-slate-300 bg-white';

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: isHighlighted ? 1.05 : 1, 
        opacity: 1,
        boxShadow: isHighlighted ? '0 8px 16px rgba(59, 130, 246, 0.3)' : '0 2px 4px rgba(0, 0, 0, 0.1)'
      }}
      transition={{ duration: 0.3 }}
      className={`absolute rounded-lg border-2 p-3 cursor-pointer transition-all ${baseStyle}`}
      style={{ 
        left: `${x}px`, 
        top: `${y}px`,
        width: '180px',
        zIndex: isHighlighted ? 2 : 1
      }}
    >
      <div className="flex items-start gap-2">
        <motion.div
          animate={{ 
            rotate: isHighlighted ? 360 : 0,
            scale: isHighlighted ? 1.2 : 1
          }}
          transition={{ duration: 0.5 }}
        >
          <Icon className={`flex-shrink-0 ${isHighlighted ? 'text-blue-600' : 'text-slate-600'}`} size={20} />
        </motion.div>
        <div className="flex-1">
          <p className={`${isHighlighted ? 'text-blue-900' : 'text-slate-700'}`}>
            {label}
          </p>
        </div>
      </div>
      
      {isHighlighted && (
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 0.5 }}
          className="absolute bottom-0 left-0 h-1 bg-blue-600 rounded-b"
        />
      )}
    </motion.div>
  );
}

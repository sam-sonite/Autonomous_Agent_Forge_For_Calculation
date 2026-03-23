import { motion } from 'motion/react';

interface FlowEdgeProps {
  from: { x: number; y: number };
  to: { x: number; y: number };
  label: string;
  isActive: boolean;
  isHighlighted: boolean;
}

export function FlowEdge({ from, to, label, isActive, isHighlighted }: FlowEdgeProps) {
  // Adjust for node size
  const nodeWidth = 180;
  const nodeHeight = 70;
  
  const fromX = from.x + nodeWidth / 2;
  const fromY = from.y + nodeHeight / 2;
  const toX = to.x + nodeWidth / 2;
  const toY = to.y + nodeHeight / 2;

  // Calculate angle to determine connection points
  const angle = Math.atan2(toY - fromY, toX - fromX);
  
  // Adjust start and end points to edge of nodes
  const startX = fromX + Math.cos(angle) * (nodeWidth / 2);
  const startY = fromY + Math.sin(angle) * (nodeHeight / 2);
  const endX = toX - Math.cos(angle) * (nodeWidth / 2);
  const endY = toY - Math.sin(angle) * (nodeHeight / 2);

  // Create curved path for vertical connections
  const isVertical = Math.abs(toX - fromX) < 50;
  const path = isVertical
    ? `M ${startX} ${startY} C ${startX} ${(startY + endY) / 2}, ${endX} ${(startY + endY) / 2}, ${endX} ${endY}`
    : `M ${startX} ${startY} L ${endX} ${endY}`;

  const midX = (startX + endX) / 2;
  const midY = (startY + endY) / 2;

  return (
    <g>
      {/* Shadow line */}
      <path
        d={path}
        stroke="#e2e8f0"
        strokeWidth="3"
        fill="none"
      />
      
      {/* Active line */}
      <motion.path
        d={path}
        stroke={isHighlighted ? '#2563eb' : isActive ? '#3b82f6' : '#cbd5e1'}
        strokeWidth={isHighlighted ? '3' : '2'}
        fill="none"
        strokeDasharray={isHighlighted ? '5,5' : '0'}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: isActive ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      />
      
      {/* Arrow head */}
      {isActive && (
        <motion.polygon
          points={`${endX},${endY} ${endX - 8 * Math.cos(angle - Math.PI / 6)},${endY - 8 * Math.sin(angle - Math.PI / 6)} ${endX - 8 * Math.cos(angle + Math.PI / 6)},${endY - 8 * Math.sin(angle + Math.PI / 6)}`}
          fill={isHighlighted ? '#2563eb' : '#3b82f6'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        />
      )}
      
      {/* Label */}
      {label && isActive && (
        <motion.text
          x={midX}
          y={midY - 10}
          textAnchor="middle"
          className="text-xs fill-slate-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          {label}
        </motion.text>
      )}
      
      {/* Animated dot along path */}
      {isHighlighted && (
        <motion.circle
          r="4"
          fill="#2563eb"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0, 1, 1, 0],
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <animateMotion
            dur="2s"
            repeatCount="indefinite"
            path={path}
          />
        </motion.circle>
      )}
    </g>
  );
}
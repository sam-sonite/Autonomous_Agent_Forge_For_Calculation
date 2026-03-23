import type { FitnessPoint } from '../lib/api';

interface SimpleLineChartProps {
  points: FitnessPoint[];
}

export function SimpleLineChart({ points }: SimpleLineChartProps) {
  const width = 760;
  const height = 260;
  const padding = 28;

  if (!points.length) {
    return (
      <div className="h-[260px] rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500">
        No GA fitness data available
      </div>
    );
  }

  const minX = Math.min(...points.map((point) => point.generation));
  const maxX = Math.max(...points.map((point) => point.generation));
  const minY = Math.min(...points.map((point) => point.fitness));
  const maxY = Math.max(...points.map((point) => point.fitness));

  const xScale = (value: number) =>
    padding + ((value - minX) / Math.max(maxX - minX, 1)) * (width - padding * 2);
  const yScale = (value: number) =>
    height - padding - ((value - minY) / Math.max(maxY - minY, 0.0001)) * (height - padding * 2);

  const polyline = points
    .map((point) => `${xScale(point.generation)},${yScale(point.fitness)}`)
    .join(' ');

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
      <rect width={width} height={height} rx="16" fill="#ffffff" />
      {[0, 1, 2, 3].map((tick) => {
        const y = padding + ((height - padding * 2) / 3) * tick;
        return <line key={tick} x1={padding} x2={width - padding} y1={y} y2={y} stroke="#e2e8f0" strokeWidth="1" />;
      })}
      <polyline fill="none" stroke="#ec4899" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" points={polyline} />
      {points.map((point) => (
        <g key={point.generation}>
          <circle cx={xScale(point.generation)} cy={yScale(point.fitness)} r="5" fill="#7c3aed" />
          <text
            x={xScale(point.generation)}
            y={height - 8}
            textAnchor="middle"
            fontSize="12"
            fill="#475569"
          >
            G{point.generation}
          </text>
        </g>
      ))}
    </svg>
  );
}

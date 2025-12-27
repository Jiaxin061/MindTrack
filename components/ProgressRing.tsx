
import React from 'react';

interface ProgressRingProps {
  score: number;
  size?: number;
  stroke?: number;
  color?: string;
}

const ProgressRing: React.FC<ProgressRingProps> = ({ 
  score, 
  size = 180, 
  stroke = 14, 
  color = '#2DD4BF' 
}) => {
  const radius = (size / 2) - (stroke * 2);
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg
        height={size}
        width={size}
        className="transform -rotate-90"
      >
        <circle
          stroke="#E2E8F0"
          fill="transparent"
          strokeWidth={stroke}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset: offset }}
          strokeLinecap="round"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-4xl font-bold text-slate-800">{score}</span>
        <span className="text-xs font-medium text-slate-400 tracking-wider uppercase">CHI Score</span>
      </div>
    </div>
  );
};

export default ProgressRing;

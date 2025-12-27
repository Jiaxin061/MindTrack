
import React from 'react';

interface DashboardCardProps {
  title: string;
  value: string;
  trend: 'up' | 'down' | 'stable';
  icon: React.ReactNode;
  colorClass: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, trend, icon, colorClass }) => {
  const TrendIcon = () => {
    if (trend === 'up') return <span className="text-emerald-500 ml-1 font-bold">↑</span>;
    if (trend === 'down') return <span className="text-rose-500 ml-1 font-bold">↓</span>;
    return <span className="text-slate-400 ml-1 font-bold">→</span>;
  };

  return (
    <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex items-center space-x-4">
      <div className={`p-3 rounded-2xl ${colorClass}`}>
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-slate-400 text-xs font-medium uppercase tracking-wide">{title}</p>
        <div className="flex items-center">
          <span className="text-lg font-bold text-slate-800">{value}</span>
          <TrendIcon />
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;


import React from 'react';
import { Home, Mic, BarChart2, Watch, Settings } from 'lucide-react';
import { TabType } from '../types';

interface BottomNavProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'dashboard', icon: Home, label: 'Home' },
    { id: 'record', icon: Mic, label: 'Record' },
    { id: 'insights', icon: BarChart2, label: 'Insights' },
    { id: 'devices', icon: Watch, label: 'Devices' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <nav className="w-full bg-white border-t border-slate-100 pb-safe shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] z-50">
      <div className="flex justify-around items-center h-16 px-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className="flex flex-col items-center justify-center space-y-1 relative group w-14 outline-none tap-highlight-transparent"
              aria-label={tab.label}
            >
              <div className={`
                p-2 rounded-xl transition-all duration-300
                ${isActive ? 'bg-teal-50 text-teal-600' : 'text-slate-400 active:scale-90'}
              `}>
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`text-[10px] font-semibold tracking-tight transition-colors ${isActive ? 'text-teal-600' : 'text-slate-400'}`}>
                {tab.label}
              </span>
              {isActive && (
                <div className="absolute -top-1 w-1 h-1 bg-teal-600 rounded-full"></div>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;

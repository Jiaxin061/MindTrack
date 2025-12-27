
import React from 'react';
import { Moon, MessageSquare, Camera, Activity, Bell } from 'lucide-react';
import ProgressRing from '../components/ProgressRing';
import DashboardCard from '../components/DashboardCard';
import { MOCK_SLEEP, MOCK_VOICE, MOCK_FACIAL, MOCK_BIOMETRICS } from '../constants';
import { RiskLevel } from '../types';

const Dashboard: React.FC = () => {
  // Simplified logic to calculate CHI and risk level
  const chiScore = 64; 
  const getRisk = (score: number): RiskLevel => {
    if (score > 80) return 'Low';
    if (score > 50) return 'Moderate';
    return 'High';
  };
  const risk = getRisk(chiScore);
  
  const riskColors = {
    Low: 'text-emerald-500 bg-emerald-50',
    Moderate: 'text-amber-500 bg-amber-50',
    High: 'text-rose-500 bg-rose-50',
  };

  return (
    <div className="flex flex-col space-y-6 pb-24">
      {/* Header */}
      <header className="flex justify-between items-center px-6 pt-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">MindTrack</h1>
          <p className="text-sm text-slate-500">Good morning, Alex</p>
        </div>
        <button className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 relative">
          <Bell size={22} className="text-slate-600" />
          <span className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
        </button>
      </header>

      {/* Main CHI Section */}
      <section className="px-6 flex flex-col items-center">
        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 w-full flex flex-col items-center">
          <ProgressRing 
            score={chiScore} 
            color={risk === 'Low' ? '#10B981' : risk === 'Moderate' ? '#F59E0B' : '#F43F5E'} 
          />
          <div className={`mt-6 px-5 py-2 rounded-full font-bold text-sm tracking-wide flex items-center space-x-2 ${riskColors[risk]}`}>
            <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
            <span>{risk} Burnout Risk</span>
          </div>
          <p className="mt-4 text-center text-sm text-slate-500 leading-relaxed px-4">
            Your metrics suggest a {risk.toLowerCase()} cognitive load. Consider 15 minutes of mindfulness today.
          </p>
        </div>
      </section>

      {/* Summary Cards */}
      <section className="px-6 space-y-4">
        <h2 className="text-lg font-bold text-slate-800 px-1">Daily Summary</h2>
        <div className="grid grid-cols-1 gap-4">
          <DashboardCard 
            title="Sleep Quality" 
            value={`${MOCK_SLEEP[0].hours}h / ${MOCK_SLEEP[0].quality}%`} 
            trend="down" 
            icon={<Moon className="text-teal-600" size={24} />}
            colorClass="bg-teal-50"
          />
          <DashboardCard 
            title="Voice Stress" 
            value="Moderate" 
            trend="up" 
            icon={<MessageSquare className="text-amber-600" size={24} />}
            colorClass="bg-amber-50"
          />
          <DashboardCard 
            title="Facial Fatigue" 
            value="Elevated" 
            trend="up" 
            icon={<Camera className="text-rose-600" size={24} />}
            colorClass="bg-rose-50"
          />
          <DashboardCard 
            title="Heart Rate" 
            value={`${MOCK_BIOMETRICS.heartRate} BPM`} 
            trend="stable" 
            icon={<Activity className="text-indigo-600" size={24} />}
            colorClass="bg-indigo-50"
          />
        </div>
      </section>
    </div>
  );
};

export default Dashboard;

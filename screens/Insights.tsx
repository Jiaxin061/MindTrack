
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Info, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { MOCK_INSIGHTS, MOCK_SLEEP, COLORS } from '../constants';

const Insights: React.FC = () => {
  const chartData = MOCK_SLEEP.map(d => ({
    name: d.date.split('-')[2],
    hours: d.hours,
    quality: d.quality
  }));

  return (
    <div className="flex flex-col space-y-6 pb-24 overflow-y-auto max-h-screen custom-scrollbar">
      <header className="px-6 pt-6 bg-white pb-2 shadow-sm sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-slate-800">Insights</h1>
        <p className="text-sm text-slate-500">Long-term burnout trends</p>
      </header>

      {/* Chart Section */}
      <section className="px-6">
        <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800 flex items-center space-x-2">
              <TrendingUp size={18} className="text-teal-500" />
              <span>Sleep vs Quality</span>
            </h3>
            <span className="text-[10px] font-bold bg-slate-100 px-2 py-1 rounded text-slate-500 uppercase">Last 5 Days</span>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.teal} stopOpacity={0.1}/>
                    <stop offset="95%" stopColor={COLORS.teal} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94A3B8'}} dy={10} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
                />
                <Area type="monotone" dataKey="hours" stroke={COLORS.teal} fillOpacity={1} fill="url(#colorHours)" strokeWidth={3} />
                <Area type="monotone" dataKey="quality" stroke={COLORS.coral} fillOpacity={0} strokeWidth={2} strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex space-x-6 justify-center">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-teal-500"></div>
              <span className="text-[10px] font-medium text-slate-500">Duration (hrs)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-rose-400"></div>
              <span className="text-[10px] font-medium text-slate-500">Quality (%)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Insight Cards */}
      <section className="px-6 space-y-4">
        <h2 className="text-lg font-bold text-slate-800 px-1">Deep Analysis</h2>
        {MOCK_INSIGHTS.map((insight) => (
          <div key={insight.id} className="bg-white p-5 rounded-3xl border border-slate-100 flex items-start space-x-4">
            <div className={`p-3 rounded-2xl ${
              insight.impact === 'negative' ? 'bg-rose-50 text-rose-500' : 'bg-emerald-50 text-emerald-600'
            }`}>
              {insight.impact === 'negative' ? <AlertTriangle size={20} /> : <CheckCircle size={20} />}
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-slate-800 text-sm">{insight.title}</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{insight.description}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Explainable AI Section */}
      <section className="px-6 mb-4">
        <div className="bg-indigo-600 p-6 rounded-[32px] text-white shadow-lg shadow-indigo-100">
          <div className="flex items-center space-x-2 mb-3">
            <Info size={18} />
            <h3 className="font-bold">Why am I at risk?</h3>
          </div>
          <p className="text-xs text-indigo-100 leading-relaxed opacity-90">
            Your CHI score is primarily impacted by <strong>Circadian Disruption</strong> and <strong>Vocal Jitter</strong>. 
            The model detected irregular vocal patterns during your last two sessions, which highly correlate with autonomic nervous system fatigue.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="bg-white/20 px-3 py-1.5 rounded-full text-[10px] font-bold backdrop-blur-sm">Voice Stability -15%</span>
            <span className="bg-white/20 px-3 py-1.5 rounded-full text-[10px] font-bold backdrop-blur-sm">Sleep Debt 6h</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Insights;

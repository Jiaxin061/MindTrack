import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from 'recharts';
import { ArrowLeft, TrendingDown, TrendingUp, Activity, AlertTriangle } from 'lucide-react';
import { WeeklySummaryData } from '../types';
import { generateSystemStateForDate, generateSleepHistory } from '../utils/mockData';

interface WeeklySummaryProps {
  onBack: () => void;
}

const WeeklySummary: React.FC<WeeklySummaryProps> = ({ onBack }) => {
  // Get last 7 days of data
  const data = useMemo(() => {
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    const dailyStates = [];
    const chiValues = [];
    let totalSleep = 0;
    let totalHRV = 0;
    let totalStress = 0;
    let highRiskDays = 0;

    // Collect data for last 7 days
    for (let i = 0; i < 7; i++) {
      const date = new Date(sevenDaysAgo);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      const state = generateSystemStateForDate(dateStr);

      dailyStates.push(state);
      chiValues.push(state.chiScore);
      totalSleep += state.sensorSnapshot.sleep.hours;
      totalHRV += state.sensorSnapshot.biometrics.hrv;
      totalStress += state.sensorSnapshot.biometrics.stressLevel;

      if (state.riskLevel === 'High') {
        highRiskDays++;
      }
    }

    // Calculate averages
    const avgCHI = Math.round(chiValues.reduce((a, b) => a + b, 0) / 7);
    const avgSleep = Math.round((totalSleep / 7) * 10) / 10;
    const avgHRV = Math.round(totalHRV / 7);
    const avgStress = Math.round(totalStress / 7);

    // Prepare chart data
    const chartData = dailyStates.map((state) => ({
      date: state.date.split('-')[2], // Day of month
      chi: state.chiScore,
      risk: state.riskLevel === 'High' ? 1 : state.riskLevel === 'Moderate' ? 0.5 : 0,
    }));

    // Get comparison with previous week
    const prevWeekAgoStart = new Date(sevenDaysAgo);
    prevWeekAgoStart.setDate(prevWeekAgoStart.getDate() - 7);

    let prevWeekTotal = 0;
    for (let i = 0; i < 7; i++) {
      const date = new Date(prevWeekAgoStart);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      const state = generateSystemStateForDate(dateStr);
      prevWeekTotal += state.chiScore;
    }
    const prevWeekAvg = Math.round(prevWeekTotal / 7);
    const improvement = avgCHI - prevWeekAvg;
    const direction: 'up' | 'down' | 'stable' = improvement > 2 ? 'up' : improvement < -2 ? 'down' : 'stable';

    // Find top burnout contributors
    const contributorMap: { [key: string]: number } = {};
    dailyStates.forEach((state) => {
      state.firedRules.forEach((rule) => {
        if (rule.fired) {
          contributorMap[rule.ruleName] = (contributorMap[rule.ruleName] || 0) + 1;
        }
      });
    });

    const topContributors = Object.entries(contributorMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name, count]) => ({
        modality: name,
        impact: count,
      }));

    return {
      startDate: sevenDaysAgo.toISOString().split('T')[0],
      endDate: today.toISOString().split('T')[0],
      dailyAverages: chartData,
      weeklyStats: {
        avgCHI,
        avgSleep,
        avgHRV,
        avgStress,
      },
      topBurnoutContributors: topContributors,
      comparison: { direction, percentage: Math.abs(improvement) },
      riskDays: highRiskDays,
    } as WeeklySummaryData;
  }, []);

  const riskBars = useMemo(
    () =>
      data.dailyAverages.map((d, idx) => ({
        day: d.date,
        high: d.risk === 1 ? 1 : 0,
        moderate: d.risk === 0.5 ? 1 : 0,
        low: d.risk === 0 ? 1 : 0,
        dayIdx: idx,
      })),
    [data.dailyAverages]
  );

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white border-b border-slate-100 shadow-sm">
        <div className="flex items-center px-6 py-4">
          <button
            onClick={onBack}
            className="p-2 -m-2 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft size={24} className="text-slate-600" />
          </button>
          <div className="ml-4">
            <h1 className="text-2xl font-bold text-slate-800">Weekly Summary</h1>
            <p className="text-sm text-slate-500">
              {data.startDate} to {data.endDate}
            </p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto custom-scrollbar pb-24 px-6 py-6 space-y-6">
        {/* Key Metrics */}
        <section className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <h2 className="font-bold text-slate-800 mb-6 flex items-center space-x-2">
            <Activity size={18} className="text-teal-600" />
            <span>Weekly Statistics</span>
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-teal-50 rounded-xl border border-teal-100">
              <p className="text-xs text-slate-500 font-semibold uppercase mb-1">Avg CHI</p>
              <p className="text-2xl font-bold text-teal-700">{data.weeklyStats.avgCHI}</p>
            </div>

            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
              <p className="text-xs text-slate-500 font-semibold uppercase mb-1">Avg Sleep</p>
              <p className="text-2xl font-bold text-blue-700">{data.weeklyStats.avgSleep}h</p>
            </div>

            <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
              <p className="text-xs text-slate-500 font-semibold uppercase mb-1">Avg HRV</p>
              <p className="text-2xl font-bold text-purple-700">{data.weeklyStats.avgHRV}</p>
            </div>

            <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
              <p className="text-xs text-slate-500 font-semibold uppercase mb-1">Avg Stress</p>
              <p className="text-2xl font-bold text-amber-700">{data.weeklyStats.avgStress}%</p>
            </div>
          </div>

          {/* Week-over-week comparison */}
          <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-700">vs. Previous Week</span>
            <div className="flex items-center space-x-2">
              {data.comparison.direction === 'up' ? (
                <TrendingUp size={20} className="text-emerald-600" />
              ) : data.comparison.direction === 'down' ? (
                <TrendingDown size={20} className="text-rose-600" />
              ) : (
                <Activity size={20} className="text-slate-400" />
              )}
              <span
                className={`font-bold ${
                  data.comparison.direction === 'up'
                    ? 'text-emerald-600'
                    : data.comparison.direction === 'down'
                      ? 'text-rose-600'
                      : 'text-slate-500'
                }`}
              >
                {data.comparison.direction === 'up' ? '+' : ''}
                {data.comparison.percentage}%
              </span>
            </div>
          </div>
        </section>

        {/* CHI Trend Chart */}
        <section className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <h2 className="font-bold text-slate-800 mb-6">7-Day CHI Trend</h2>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.dailyAverages}>
                <defs>
                  <linearGradient id="colorCHI" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2DD4BF" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2DD4BF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} />
                <YAxis hide domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="chi"
                  stroke="#2DD4BF"
                  strokeWidth={3}
                  dot={{ fill: '#2DD4BF', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Risk Distribution */}
        <section className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <h2 className="font-bold text-slate-800 mb-6">Daily Risk Levels</h2>

          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskBars}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Bar dataKey="high" stackId="a" fill="#F43F5E" />
                <Bar dataKey="moderate" stackId="a" fill="#FBBF24" />
                <Bar dataKey="low" stackId="a" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 flex justify-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span className="text-xs font-medium text-slate-600">Low Risk</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-amber-400"></div>
              <span className="text-xs font-medium text-slate-600">Moderate Risk</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-rose-500"></div>
              <span className="text-xs font-medium text-slate-600">High Risk</span>
            </div>
          </div>
        </section>

        {/* Top Burnout Contributors */}
        {data.topBurnoutContributors.length > 0 && (
          <section className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <h2 className="font-bold text-slate-800 mb-4 flex items-center space-x-2">
              <AlertTriangle size={18} className="text-rose-600" />
              <span>Top Burnout Drivers</span>
            </h2>

            <div className="space-y-3">
              {data.topBurnoutContributors.map((contrib, idx) => (
                <div key={idx} className="p-4 bg-rose-50 border border-rose-200 rounded-xl">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-slate-800 text-sm">{contrib.modality}</p>
                    <span className="px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-xs font-bold">
                      {contrib.impact}x
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Week Summary */}
        <section className="bg-teal-50 border border-teal-200 rounded-3xl p-6">
          <h2 className="font-bold text-slate-800 mb-3">Week Summary</h2>
          <ul className="space-y-2 text-sm text-slate-700">
            <li className="flex items-start space-x-2">
              <span className="text-teal-600 font-bold mt-1">•</span>
              <span>
                Your CHI averaged <strong>{data.weeklyStats.avgCHI}</strong> this week, showing{' '}
                {data.comparison.direction === 'up'
                  ? 'improvement'
                  : data.comparison.direction === 'down'
                    ? 'decline'
                    : 'stability'}{' '}
                vs. last week.
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-teal-600 font-bold mt-1">•</span>
              <span>
                You had <strong>{data.riskDays}</strong> high-risk day(s). Focus on sleep and stress
                management.
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-teal-600 font-bold mt-1">•</span>
              <span>
                Average sleep: <strong>{data.weeklyStats.avgSleep}h</strong> (target: 7-9h).
              </span>
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
};

export default WeeklySummary;

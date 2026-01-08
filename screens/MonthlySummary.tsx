import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';
import { ArrowLeft, TrendingDown, TrendingUp, Activity, Calendar } from 'lucide-react';
import { MonthlySummaryData, RiskLevel } from '../types';
import { generateSystemStateForDate } from '../utils/mockData';

interface MonthlySummaryProps {
  onBack: () => void;
  monthOffset?: number; // 0 = current month, -1 = last month
}

const MonthlySummary: React.FC<MonthlySummaryProps> = ({ onBack, monthOffset = 0 }) => {
  // Calculate month and year
  const targetDate = new Date();
  targetDate.setMonth(targetDate.getMonth() + monthOffset);

  const month = targetDate.toLocaleString('default', { month: 'long' });
  const year = targetDate.getFullYear();

  const data = useMemo(() => {
    // Get first and last day of the month
    const firstDay = new Date(year, targetDate.getMonth(), 1);
    const lastDay = new Date(year, targetDate.getMonth() + 1, 0);

    const dailyStates = [];
    const chiScores: number[] = [];
    const riskCounts = { low: 0, moderate: 0, high: 0 };

    let longestLowStreak = 0;
    let currentLowStreak = 0;

    // Collect data for the entire month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, targetDate.getMonth(), day);
      const dateStr = date.toISOString().split('T')[0];
      const state = generateSystemStateForDate(dateStr);

      dailyStates.push(state);
      chiScores.push(state.chiScore);

      // Count risk levels
      if (state.riskLevel === 'Low') {
        riskCounts.low++;
        currentLowStreak++;
        longestLowStreak = Math.max(longestLowStreak, currentLowStreak);
      } else {
        currentLowStreak = 0;
        if (state.riskLevel === 'Moderate') {
          riskCounts.moderate++;
        } else {
          riskCounts.high++;
        }
      }
    }

    // Calculate averages
    const monthlyAvgCHI = Math.round(chiScores.reduce((a, b) => a + b, 0) / chiScores.length);

    // Get previous month average
    const prevMonthDate = new Date(year, targetDate.getMonth() - 1, 1);
    const prevMonthLastDay = new Date(year, targetDate.getMonth(), 0);
    let prevMonthTotal = 0;
    let prevMonthCount = 0;

    for (let day = 1; day <= prevMonthLastDay.getDate(); day++) {
      const date = new Date(year, targetDate.getMonth() - 1, day);
      const dateStr = date.toISOString().split('T')[0];
      const state = generateSystemStateForDate(dateStr);
      prevMonthTotal += state.chiScore;
      prevMonthCount++;
    }

    const previousMonthAvgCHI = Math.round(prevMonthTotal / prevMonthCount);
    const improvement = ((monthlyAvgCHI - previousMonthAvgCHI) / previousMonthAvgCHI) * 100;

    // Prepare chart data
    const chiTrend = dailyStates
      .filter((_, idx) => idx % 3 === 0 || idx === dailyStates.length - 1) // Sample every 3rd day
      .map((state) => ({
        date: state.date.split('-')[2], // Day of month
        chi: state.chiScore,
      }));

    // Pie chart data
    const riskDistribution = [
      { name: 'Low', value: riskCounts.low, fill: '#10B981' },
      { name: 'Moderate', value: riskCounts.moderate, fill: '#FBBF24' },
      { name: 'High', value: riskCounts.high, fill: '#F43F5E' },
    ].filter((item) => item.value > 0);

    return {
      month,
      year,
      chiTrend,
      riskDistribution,
      longestLowStreak,
      monthlyAvgCHI,
      previousMonthAvgCHI,
      improvement,
      riskCounts,
      dailyStates,
    } as MonthlySummaryData & {
      riskCounts: { low: number; moderate: number; high: number };
      dailyStates: any[];
    };
  }, [year, targetDate.getMonth(), monthOffset]);

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="font-bold text-xs"
      >
        {value}
      </text>
    );
  };

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
            <h1 className="text-2xl font-bold text-slate-800">Monthly Summary</h1>
            <p className="text-sm text-slate-500">
              {data.month} {data.year}
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
            <span>Monthly Highlights</span>
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {/* Avg CHI */}
            <div className="p-5 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl border border-teal-200">
              <p className="text-xs text-slate-600 font-semibold uppercase mb-2">Monthly Avg CHI</p>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-bold text-teal-700">{data.monthlyAvgCHI}</p>
                  <p className="text-xs text-slate-500 mt-2">
                    Previous month: <strong>{data.previousMonthAvgCHI}</strong>
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {data.improvement > 0 ? (
                    <TrendingUp size={24} className="text-emerald-600" />
                  ) : (
                    <TrendingDown size={24} className="text-rose-600" />
                  )}
                  <span
                    className={`font-bold text-lg ${
                      data.improvement > 0 ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {data.improvement > 0 ? '+' : ''}
                    {Math.round(data.improvement)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Longest Low Streak */}
            <div className="p-5 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-200">
              <p className="text-xs text-slate-600 font-semibold uppercase mb-2">Longest Low-Risk Streak</p>
              <p className="text-3xl font-bold text-emerald-700">{data.longestLowStreak} days</p>
              <p className="text-xs text-slate-600 mt-2">
                {data.longestLowStreak > 7
                  ? 'Excellent! Great job maintaining healthy metrics.'
                  : data.longestLowStreak > 3
                    ? 'Good progress. Keep it up!'
                    : 'Monitor your habits closely.'}
              </p>
            </div>
          </div>
        </section>

        {/* CHI Trend */}
        <section className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <h2 className="font-bold text-slate-800 mb-6">CHI Trend</h2>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.chiTrend}>
                <defs>
                  <linearGradient id="colorMonthly" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2DD4BF" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2DD4BF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#94A3B8' }}
                />
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

        {/* Risk Distribution Pie Chart */}
        <section className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <h2 className="font-bold text-slate-800 mb-6">Risk Distribution</h2>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.riskDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="flex flex-col gap-3 mt-6">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-emerald-500"></div>
                <span className="text-sm font-medium text-slate-700">Low Risk</span>
              </div>
              <span className="text-sm font-bold text-slate-800">{data.riskCounts.low} days</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-amber-400"></div>
                <span className="text-sm font-medium text-slate-700">Moderate Risk</span>
              </div>
              <span className="text-sm font-bold text-slate-800">{data.riskCounts.moderate} days</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-rose-500"></div>
                <span className="text-sm font-medium text-slate-700">High Risk</span>
              </div>
              <span className="text-sm font-bold text-slate-800">{data.riskCounts.high} days</span>
            </div>
          </div>
        </section>

        {/* Month Insights */}
        <section className="bg-indigo-50 border border-indigo-200 rounded-3xl p-6">
          <h2 className="font-bold text-slate-800 mb-4 flex items-center space-x-2">
            <Calendar size={18} className="text-indigo-600" />
            <span>Month Overview</span>
          </h2>

          <ul className="space-y-3 text-sm text-slate-700">
            <li className="flex items-start space-x-2">
              <span className="text-indigo-600 font-bold mt-1">•</span>
              <span>
                You had <strong>{data.riskCounts.low}</strong> low-risk days and{' '}
                <strong>{data.riskCounts.high}</strong> high-risk days this month.
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-indigo-600 font-bold mt-1">•</span>
              <span>
                Your longest healthy streak was <strong>{data.longestLowStreak} days</strong>. Consider how to
                extend it.
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-indigo-600 font-bold mt-1">•</span>
              <span>
                Monthly CHI is {data.improvement > 0 ? 'up' : 'down'} <strong>{Math.abs(Math.round(data.improvement))}%</strong> vs. last month.
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-indigo-600 font-bold mt-1">•</span>
              <span>
                Focus on the days with high-risk patterns to identify and address root causes.
              </span>
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
};

export default MonthlySummary;

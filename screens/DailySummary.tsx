import React, { useState } from 'react';
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
  PieChart,
  Pie,
} from 'recharts';
import {
  ArrowLeft,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Heart,
  Info,
  Moon,
  MessageSquare,
} from 'lucide-react';
import ProgressRing from '../components/ProgressRing';
import {
  DailySummaryData,
  CHIContribution,
  InterventionLog,
  RuleExecution,
  RiskLevel,
} from '../types';
import { calculateCHI, getRiskColor, getRecommendation } from '../utils/chi';
import { executeAllRules } from '../utils/rules';
import {
  generateSystemStateForDate,
  generateSleepForDate,
  generateVoiceForDate,
  generateFacialForDate,
  generateBiometricsForDate,
  generateTextSentimentForDate,
} from '../utils/mockData';

interface DailySummaryProps {
  onBack: () => void;
  date?: string; // ISO format (YYYY-MM-DD), defaults to today
}

const DailySummary: React.FC<DailySummaryProps> = ({ onBack, date: providedDate }) => {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'rules' | 'timeline'>(
    'overview'
  );

  // Use provided date or today
  const date = providedDate || new Date().toISOString().split('T')[0];

  // Generate data for the selected date
  const sleep = generateSleepForDate(date);
  const voice = generateVoiceForDate(date);
  const facial = generateFacialForDate(date);
  const biometrics = generateBiometricsForDate(date);
  const textSentiment = generateTextSentimentForDate(date);

  // Calculate CHI
  const chiResult = calculateCHI(sleep, voice, facial, biometrics);

  // Execute rules
  const ruleExecutions = executeAllRules(
    {
      sleep,
      voice,
      facial,
      biometrics,
      chiResult,
      textSentiment,
    },
    [sleep]
  );

  // Get fired rules
  const firedRules = ruleExecutions.filter((r) => r.fired);

  // Generate interventions
  const interventions: InterventionLog[] =
    Math.random() > 0.5
      ? [
          {
            id: 'int1',
            type: 'breathing',
            title: 'Breathing Exercise (4-7-8)',
            description: 'Slow breathing to calm nervous system',
            timestamp: `${date}T14:30:00Z`,
            completed: true,
          },
        ]
      : [];

  // Contribution chart data
  const contributionData = chiResult.contributions.map((c) => ({
    name: c.modality.charAt(0).toUpperCase() + c.modality.slice(1),
    value: c.score,
    fill: getContributionColor(c.modality),
  }));

  // Timeline of events with more granular data points
  const events = [
    {
      time: '06:00',
      type: 'sleep',
      title: `Sleep: ${sleep.hours}h (${sleep.quality}% quality)`,
      icon: Moon,
    },
    {
      time: '08:30',
      type: 'text',
      title: `Text Activity: ${textSentiment.wordCount} words (${textSentiment.emotionalWords} emotional)`,
      icon: MessageSquare,
    },
    {
      time: '09:00',
      type: 'text-sentiment',
      title: `Mood Analysis: Sentiment ${textSentiment.sentimentScore > 0 ? '+' : ''}${textSentiment.sentimentScore} (Stress: ${textSentiment.stressIndicators}%)`,
      icon: MessageSquare,
    },
    voice && { time: '10:30', type: 'voice', title: 'Voice session recorded', icon: Activity },
    facial && { time: '12:00', type: 'facial', title: 'Facial scan completed', icon: CheckCircle },
    {
      time: '14:30',
      type: 'chi',
      title: `CHI Score: ${chiResult.chiScore} (${chiResult.riskLevel} Risk)`,
      icon: Heart,
    },
    ...interventions.map((i) => ({
      time: i.timestamp.split('T')[1].slice(0, 5),
      type: 'intervention',
      title: i.title,
      icon: CheckCircle,
    })),
  ].filter(Boolean);

  const recommendation = getRecommendation(chiResult);
  const riskColors = getRiskColor(chiResult.riskLevel);

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
            <h1 className="text-2xl font-bold text-slate-800">Daily Summary</h1>
            <p className="text-sm text-slate-500">{date}</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto custom-scrollbar pb-24">
        {/* CHI Score Section */}
        <section className="px-6 py-6">
          <div className={`${riskColors.bg} border border-slate-200 rounded-3xl p-8 flex flex-col items-center`}>
            <ProgressRing
              score={chiResult.chiScore}
              color={
                chiResult.riskLevel === 'Low'
                  ? '#10B981'
                  : chiResult.riskLevel === 'Moderate'
                    ? '#F59E0B'
                    : '#F43F5E'
              }
            />
            <div className={`mt-6 px-5 py-2 rounded-full font-bold text-sm ${riskColors.text} flex items-center space-x-2`}>
              <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
              <span>{chiResult.riskLevel} Risk</span>
            </div>

            {/* Recommendation */}
            <div className="mt-6 p-4 bg-white rounded-xl border border-slate-200 w-full">
              <p className="text-center text-sm text-slate-600 leading-relaxed">
                {recommendation}
              </p>
            </div>
          </div>
        </section>

        {/* Tabs */}
        <div className="sticky top-0 z-10 bg-white border-b border-slate-100 px-6 flex space-x-6">
          {(['overview', 'rules', 'timeline'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`py-4 font-semibold text-sm transition-colors border-b-2 ${
                selectedTab === tab
                  ? 'text-teal-600 border-teal-600'
                  : 'text-slate-500 border-transparent hover:text-slate-700'
              }`}
              aria-label={`View ${tab}`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {selectedTab === 'overview' && (
          <div className="px-6 py-6 space-y-6">
            {/* Contribution Breakdown */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-6 flex items-center space-x-2">
                <Activity size={18} className="text-teal-600" />
                <span>CHI Contribution Breakdown</span>
              </h3>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={contributionData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} />
                    <YAxis hide domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: '12px',
                        border: 'none',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      }}
                    />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                      {contributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Contribution Details */}
              <div className="mt-6 space-y-3">
                {chiResult.contributions.map((contrib) => (
                  <div key={contrib.modality} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-sm text-slate-800 capitalize">
                        {contrib.modality}
                      </span>
                      <span className="text-sm font-bold text-slate-600">{contrib.score}/100</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">{contrib.explanation}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Sensor Readings */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center space-x-2">
                <Activity size={18} className="text-indigo-600" />
                <span>Raw Sensor Data</span>
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-teal-50 rounded-xl border border-teal-100">
                  <p className="text-xs text-slate-500 font-semibold uppercase mb-1">Sleep</p>
                  <p className="text-lg font-bold text-teal-700">{sleep.hours}h</p>
                  <p className="text-xs text-slate-600 mt-1">Quality: {sleep.quality}%</p>
                </div>

                {voice && (
                  <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                    <p className="text-xs text-slate-500 font-semibold uppercase mb-1">Voice Stress</p>
                    <p className="text-lg font-bold text-amber-700">{voice.stressLevel}%</p>
                    <p className="text-xs text-slate-600 mt-1">Pitch: {voice.pitchStability}%</p>
                  </div>
                )}

                {facial && (
                  <div className="p-4 bg-rose-50 rounded-xl border border-rose-100">
                    <p className="text-xs text-slate-500 font-semibold uppercase mb-1">Facial Fatigue</p>
                    <p className="text-lg font-bold text-rose-700">{facial.fatigueScore}%</p>
                    <p className="text-xs text-slate-600 mt-1">Blinks: {facial.eyeBlinkRate}/min</p>
                  </div>
                )}

                <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                  <p className="text-xs text-slate-500 font-semibold uppercase mb-1">Heart Rate</p>
                  <p className="text-lg font-bold text-indigo-700">{biometrics.heartRate}bpm</p>
                  <p className="text-xs text-slate-600 mt-1">HRV: {biometrics.hrv}</p>
                </div>
              </div>
            </div>

            {/* Text Sentiment & Psychological State */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center space-x-2">
                <MessageSquare size={18} className="text-purple-600" />
                <span>Psychological State (Text Analysis)</span>
              </h3>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className={`p-4 rounded-xl border ${textSentiment.sentimentScore > 0 ? 'bg-green-50 border-green-100' : 'bg-rose-50 border-rose-100'}`}>
                  <p className="text-xs text-slate-500 font-semibold uppercase mb-1">Sentiment</p>
                  <p className={`text-lg font-bold ${textSentiment.sentimentScore > 0 ? 'text-green-700' : 'text-rose-700'}`}>
                    {textSentiment.sentimentScore > 0 ? '+' : ''}{textSentiment.sentimentScore}
                  </p>
                  <p className="text-xs text-slate-600 mt-1">Range: -100 to +100</p>
                </div>

                <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                  <p className="text-xs text-slate-500 font-semibold uppercase mb-1">Text Stress</p>
                  <p className="text-lg font-bold text-amber-700">{textSentiment.stressIndicators}%</p>
                  <p className="text-xs text-slate-600 mt-1">From word choice & patterns</p>
                </div>

                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <p className="text-xs text-slate-500 font-semibold uppercase mb-1">Activity</p>
                  <p className="text-lg font-bold text-blue-700">{textSentiment.wordCount}</p>
                  <p className="text-xs text-slate-600 mt-1">Words written today</p>
                </div>

                <div className="p-4 bg-violet-50 rounded-xl border border-violet-100">
                  <p className="text-xs text-slate-500 font-semibold uppercase mb-1">Emotional Words</p>
                  <p className="text-lg font-bold text-violet-700">{textSentiment.emotionalWords}</p>
                  <p className="text-xs text-slate-600 mt-1">Detected emotional terms</p>
                </div>
              </div>

              <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200">
                {textSentiment.sentimentScore < -30
                  ? '⚠️ Negative sentiment detected. Consider reaching out for support.'
                  : textSentiment.sentimentScore > 30
                    ? '✓ Overall positive sentiment. Good emotional state.'
                    : '→ Neutral sentiment. Balanced emotional state.'}
              </p>
            </div>
          </div>
        )}

        {/* Rules Tab */}
        {selectedTab === 'rules' && (
          <div className="px-6 py-6 space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex space-x-3">
              <Info size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-blue-900">How Rules Work</p>
                <p className="text-xs text-blue-800 mt-1">
                  Knowledge-based rules analyze your sensor data to identify patterns and burnout
                  risk factors. If a rule condition is met, it's marked as "fired" below.
                </p>
              </div>
            </div>

            {/* Fired Rules */}
            {firedRules.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-bold text-slate-800 text-lg flex items-center space-x-2">
                  <AlertTriangle size={20} className="text-rose-600" />
                  <span>Triggered Rules ({firedRules.length})</span>
                </h3>
                {firedRules.map((rule) => (
                  <div key={rule.ruleId} className="p-4 bg-rose-50 border border-rose-200 rounded-2xl">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-rose-100 rounded-lg mt-0.5">
                        <AlertTriangle size={16} className="text-rose-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900 text-sm">{rule.ruleName}</p>
                        <p className="text-xs text-slate-700 mt-2 leading-relaxed">{rule.explanation}</p>
                        <p className="text-[10px] text-slate-500 mt-2 font-mono">{rule.ruleId}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* All Rules */}
            <div className="space-y-3">
              <h3 className="font-bold text-slate-800 text-lg">All Rules</h3>
              {ruleExecutions.map((rule) => (
                <div
                  key={rule.ruleId}
                  className={`p-4 rounded-2xl border ${
                    rule.fired
                      ? 'bg-rose-50 border-rose-200'
                      : 'bg-emerald-50 border-emerald-200'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div
                      className={`p-2 rounded-lg mt-0.5 ${
                        rule.fired ? 'bg-rose-100' : 'bg-emerald-100'
                      }`}
                    >
                      {rule.fired ? (
                        <AlertTriangle
                          size={16}
                          className={rule.fired ? 'text-rose-600' : 'text-emerald-600'}
                        />
                      ) : (
                        <CheckCircle size={16} className="text-emerald-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900 text-sm">{rule.ruleName}</p>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{rule.explanation}</p>
                      <p className="text-[10px] text-slate-500 mt-2 font-mono">{rule.ruleId}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Timeline Tab */}
        {selectedTab === 'timeline' && (
          <div className="px-6 py-6 space-y-6">
            <div className="space-y-4">
              {events.map((event, idx) => {
                const Icon = event.icon;
                return (
                  <div key={idx} className="flex space-x-4">
                    {/* Timeline dot */}
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-teal-100 border-2 border-teal-500 flex items-center justify-center flex-shrink-0">
                        <Icon size={16} className="text-teal-600" />
                      </div>
                      {idx < events.length - 1 && (
                        <div className="w-0.5 h-16 bg-slate-200 mt-2"></div>
                      )}
                    </div>

                    {/* Event content */}
                    <div className="pt-2 pb-4">
                      <p className="text-sm font-bold text-slate-800">{event.title}</p>
                      <p className="text-xs text-slate-500 mt-1 flex items-center space-x-1">
                        <Clock size={12} />
                        <span>{event.time}</span>
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

function getContributionColor(modality: string): string {
  const colors: { [key: string]: string } = {
    sleep: '#2DD4BF',
    biometric: '#6366F1',
    facial: '#FB7185',
    voice: '#FBBF24',
    behavioral: '#A78BFA',
  };
  return colors[modality] || '#94A3B8';
}

export default DailySummary;

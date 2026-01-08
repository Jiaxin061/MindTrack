
export type RiskLevel = 'Low' | 'Moderate' | 'High';

export interface SleepRecord {
  id: string;
  date: string;
  hours: number;
  quality: number; // 0-100
}

export interface VoiceSession {
  id: string;
  date: string;
  stressLevel: number; // 0-100
  pitchStability: number;
  volumeEnergy: number;
}

export interface FacialScan {
  id: string;
  date: string;
  fatigueScore: number; // 0-100
  eyeBlinkRate: number;
  asymmetryScore: number;
}

export interface BiometricData {
  heartRate: number;
  hrv: number; // Heart Rate Variability
  stressLevel: number;
  steps: number;
  lastSync: string;
}

export interface TextSentiment {
  id: string;
  date: string;
  sentimentScore: number; // -100 (very negative) to +100 (very positive)
  stressIndicators: number; // 0-100, typo rate, typing speed changes
  wordCount: number;
  emotionalWords: number; // count of detected emotional words
}

export interface BurnoutInsight {
  id: string;
  title: string;
  description: string;
  impact: 'positive' | 'negative' | 'neutral';
  category: 'sleep' | 'voice' | 'facial' | 'biometric';
}

export interface Device {
  id: string;
  name: string;
  type: 'watch' | 'phone' | 'ring';
  status: 'Connected' | 'Disconnected' | 'Syncing';
  lastSync: string;
  battery: number;
}

// CHI Algorithm Types
export interface CHIContribution {
  modality: 'sleep' | 'voice' | 'facial' | 'biometric' | 'behavioral';
  score: number; // 0-100
  weight: number; // 0-1
  explanation: string;
}

export interface CHIResult {
  chiScore: number; // 0-100
  contributions: CHIContribution[];
  riskLevel: RiskLevel;
  timestamp: string;
}

// Rules & Knowledge Representation Types
export interface RuleExecution {
  ruleId: string;
  ruleName: string;
  fired: boolean;
  explanation: string;
  timestamp: string;
}

// State History for Explainability
export interface SystemState {
  id: string;
  timestamp: string;
  date: string;
  chiScore: number;
  riskLevel: RiskLevel;
  sensorSnapshot: {
    sleep: SleepRecord | null;
    voice: VoiceSession | null;
    facial: FacialScan | null;
    biometrics: BiometricData;
    textSentiment: TextSentiment | null;
  };
  firedRules: RuleExecution[];
  interventions: InterventionLog[];
}

export interface InterventionLog {
  id: string;
  type: 'breathing' | 'rest' | 'hydration' | 'movement' | 'mindfulness';
  title: string;
  description: string;
  timestamp: string;
  completed: boolean;
}

export interface DailySummaryData {
  date: string;
  chiAverage: number;
  chiMin: number;
  chiMax: number;
  chiHistory: CHIResult[];
  stateHistory: SystemState[];
  topContributors: CHIContribution[];
  interventionsApplied: InterventionLog[];
  explanation: string;
}

export interface WeeklySummaryData {
  startDate: string;
  endDate: string;
  dailyAverages: { date: string; chi: number }[];
  weeklyStats: {
    avgCHI: number;
    avgSleep: number;
    avgHRV: number;
    avgStress: number;
  };
  topBurnoutContributors: { modality: string; impact: number }[];
  comparison: { direction: 'up' | 'down' | 'stable'; percentage: number };
  riskDays: number; // days with High risk
}

export interface MonthlySummaryData {
  month: string;
  year: number;
  chiTrend: { date: string; chi: number }[];
  riskDistribution: { low: number; moderate: number; high: number };
  longestLowStreak: number; // days
  monthlyAvgCHI: number;
  previousMonthAvgCHI: number;
  improvement: number; // percentage
}

export type TabType = 'dashboard' | 'record' | 'insights' | 'devices' | 'settings' | 'daily' | 'weekly' | 'monthly';

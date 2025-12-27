
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

export type TabType = 'dashboard' | 'record' | 'insights' | 'devices' | 'settings';

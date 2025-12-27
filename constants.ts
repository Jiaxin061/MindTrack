
import { SleepRecord, VoiceSession, FacialScan, BiometricData, BurnoutInsight, Device } from './types';

export const COLORS = {
  teal: '#2DD4BF',
  mint: '#99F6E4',
  coral: '#FB7185',
  amber: '#FBBF24',
  slate: '#F8FAFC',
};

export const MOCK_SLEEP: SleepRecord[] = [
  { id: '1', date: '2023-10-01', hours: 7.5, quality: 85 },
  { id: '2', date: '2023-10-02', hours: 6.2, quality: 70 },
  { id: '3', date: '2023-10-03', hours: 5.8, quality: 65 },
  { id: '4', date: '2023-10-04', hours: 4.5, quality: 40 },
  { id: '5', date: '2023-10-05', hours: 5.2, quality: 50 },
];

export const MOCK_VOICE: VoiceSession[] = [
  { id: 'v1', date: '2023-10-01', stressLevel: 20, pitchStability: 90, volumeEnergy: 80 },
  { id: 'v2', date: '2023-10-03', stressLevel: 45, pitchStability: 75, volumeEnergy: 65 },
  { id: 'v3', date: '2023-10-05', stressLevel: 72, pitchStability: 60, volumeEnergy: 50 },
];

export const MOCK_FACIAL: FacialScan[] = [
  { id: 'f1', date: '2023-10-01', fatigueScore: 15, eyeBlinkRate: 12, asymmetryScore: 5 },
  { id: 'f2', date: '2023-10-05', fatigueScore: 68, eyeBlinkRate: 25, asymmetryScore: 12 },
];

export const MOCK_BIOMETRICS: BiometricData = {
  heartRate: 72,
  hrv: 45,
  stressLevel: 64,
  steps: 8421,
  lastSync: '2 mins ago',
};

export const MOCK_INSIGHTS: BurnoutInsight[] = [
  {
    id: 'i1',
    title: 'Low sleep detected',
    description: 'You’ve averaged 5.2 hours over the last 3 days. This significantly impacts your cognitive load.',
    impact: 'negative',
    category: 'sleep'
  },
  {
    id: 'i2',
    title: 'Voice stress increasing',
    description: 'Minor tremors detected in your voice sessions this week, suggesting elevated cortisol levels.',
    impact: 'negative',
    category: 'voice'
  },
  {
    id: 'i3',
    title: 'Good physical activity',
    description: 'Your step count is 15% higher than last week, which helps with mental resilience.',
    impact: 'positive',
    category: 'biometric'
  }
];

export const MOCK_DEVICES: Device[] = [
  {
    id: 'd1',
    name: 'MindWatch Series 5',
    type: 'watch',
    status: 'Connected',
    lastSync: 'Just now',
    battery: 84
  },
  {
    id: 'd2',
    name: 'iPhone 15 Pro Sensors',
    type: 'phone',
    status: 'Syncing',
    lastSync: '10 mins ago',
    battery: 92
  }
];

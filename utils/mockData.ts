/**
 * Mock Data Generators
 * 
 * Generates realistic simulated sensor data for demonstration.
 * Data is generated deterministically based on date to ensure consistency.
 */

import {
  SleepRecord,
  VoiceSession,
  FacialScan,
  BiometricData,
  TextSentiment,
  SystemState,
  InterventionLog,
} from '../types';
import { calculateCHI } from './chi';
import { executeAllRules } from './rules';

/**
 * Pseudo-random number generator seeded by date
 * Ensures same date always produces same "random" values
 */
function seededRandom(date: string, seed: number): number {
  const dateNum = parseInt(date.replace(/-/g, ''), 10);
  const hash = Math.sin(dateNum * seed) * 10000;
  return hash - Math.floor(hash);
}

/**
 * Generate sleep record for a specific date
 */
export function generateSleepForDate(date: string): SleepRecord {
  const rand1 = seededRandom(date, 1);
  const rand2 = seededRandom(date, 2);

  // Hours: typically 5-9 hours (slightly declining trend in demo)
  let hours = 7 + (rand1 - 0.5) * 3;

  // Quality: correlated with hours (more sleep = better quality generally)
  let quality = 70 + Math.abs(rand2) * 25 - (9 - hours) * 10;

  hours = Math.max(4, Math.min(10, hours));
  quality = Math.max(30, Math.min(100, quality));

  return {
    id: `sleep_${date}`,
    date,
    hours: Math.round(hours * 10) / 10,
    quality: Math.round(quality),
  };
}

/**
 * Generate voice session for a specific date
 */
export function generateVoiceForDate(date: string): VoiceSession | null {
  // Not every day has a voice session (maybe 60% of days)
  if (seededRandom(date, 7) > 0.6) {
    return null;
  }

  const rand1 = seededRandom(date, 3);
  const rand2 = seededRandom(date, 4);
  const rand3 = seededRandom(date, 5);

  // Stress level: 10-80 range
  const stressLevel = Math.round(10 + rand1 * 70);

  // Pitch stability: inversely correlated with stress
  const pitchStability = Math.round(50 + (1 - rand2) * 40);

  // Volume/energy: moderate range
  const volumeEnergy = Math.round(30 + rand3 * 50);

  return {
    id: `voice_${date}`,
    date,
    stressLevel,
    pitchStability,
    volumeEnergy,
  };
}

/**
 * Generate facial scan for a specific date
 */
export function generateFacialForDate(date: string): FacialScan | null {
  // Not every day has a facial scan (maybe 40% of days)
  if (seededRandom(date, 8) > 0.4) {
    return null;
  }

  const rand1 = seededRandom(date, 6);
  const rand2 = seededRandom(date, 7);
  const rand3 = seededRandom(date, 8);

  // Fatigue score: 10-80 range
  const fatigueScore = Math.round(10 + rand1 * 70);

  // Eye blink rate: 8-30 per minute
  const eyeBlinkRate = Math.round(8 + rand2 * 22);

  // Asymmetry: 0-25 scale
  const asymmetryScore = Math.round(rand3 * 25);

  return {
    id: `facial_${date}`,
    date,
    fatigueScore,
    eyeBlinkRate,
    asymmetryScore,
  };
}

/**
 * Generate biometric data for a specific date
 */
export function generateBiometricsForDate(date: string): BiometricData {
  const rand1 = seededRandom(date, 9);
  const rand2 = seededRandom(date, 10);
  const rand3 = seededRandom(date, 11);
  const rand4 = seededRandom(date, 12);

  // Heart rate: 60-100 bpm (resting)
  const heartRate = Math.round(60 + rand1 * 40);

  // HRV: 20-100 (higher is better)
  const hrv = Math.round(25 + rand2 * 75);

  // Stress level: 30-80 (simulated, usually inversely related to HRV)
  const stressLevel = Math.round(80 - hrv / 2 + (rand3 - 0.5) * 20);

  // Steps: 2000-15000 per day
  const steps = Math.round(2000 + rand4 * 13000);

  return {
    heartRate,
    hrv: Math.round(hrv),
    stressLevel: Math.max(0, Math.min(100, stressLevel)),
    steps,
    lastSync: 'Just now',
  };
}

/**
 * Generate text sentiment for a specific date
 * Simulates psychological state extracted from user's typed messages/journal
 */
export function generateTextSentimentForDate(date: string): TextSentiment {
  const rand1 = seededRandom(date, 13);
  const rand2 = seededRandom(date, 14);
  const rand3 = seededRandom(date, 15);
  const rand4 = seededRandom(date, 16);

  // Sentiment score: -100 (very negative) to +100 (very positive)
  // Baseline ~30-40 (slightly positive), but varies by day
  let sentimentScore = 35 + (rand1 - 0.5) * 80;
  sentimentScore = Math.max(-100, Math.min(100, sentimentScore));

  // Stress indicators: 0-100 (extracted from word choice, punctuation, tone)
  // Correlated with negative sentiment
  let stressIndicators = 50 + Math.abs(rand2) * 40 - (sentimentScore / 100) * 30;
  stressIndicators = Math.max(0, Math.min(100, stressIndicators));

  // Word count: 50-500 words in typed messages for the day
  const wordCount = Math.round(100 + rand3 * 400);

  // Emotional words: count of words indicating strong emotion (sad, angry, tired, etc.)
  // Correlated with sentiment and stress
  const emotionalWords = Math.round(Math.abs(rand4) * Math.max(0, (100 - sentimentScore) / 2));

  return {
    id: `text_${date}`,
    date,
    sentimentScore: Math.round(sentimentScore),
    stressIndicators: Math.round(stressIndicators),
    wordCount,
    emotionalWords,
  };
}

/**
 * Generate a complete system state for a date
 */
export function generateSystemStateForDate(date: string): SystemState {
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
    [sleep] // Pass current day only
  );

  return {
    id: `state_${date}`,
    timestamp: `${date}T12:00:00Z`,
    date,
    chiScore: chiResult.chiScore,
    riskLevel: chiResult.riskLevel,
    sensorSnapshot: {
      sleep,
      voice,
      facial,
      biometrics,
      textSentiment,
    },
    firedRules: ruleExecutions,
    interventions: generateInterventionsForDate(date),
  };
}

/**
 * Generate intervention logs for a date
 */
function generateInterventionsForDate(date: string): InterventionLog[] {
  // Simulate interventions that might have been triggered
  const interventions: InterventionLog[] = [];

  const rand = seededRandom(date, 15);

  // 30% chance of breathing exercise
  if (rand < 0.3) {
    interventions.push({
      id: `int_breathing_${date}`,
      type: 'breathing',
      title: 'Breathing Exercise (4-7-8)',
      description: 'Slow breathing technique to calm the nervous system',
      timestamp: `${date}T14:30:00Z`,
      completed: true,
    });
  }

  // 20% chance of rest reminder
  if (rand < 0.5 && rand >= 0.3) {
    interventions.push({
      id: `int_rest_${date}`,
      type: 'rest',
      title: 'Rest Reminder',
      description: 'Take a 15-minute break away from screens',
      timestamp: `${date}T16:00:00Z`,
      completed: true,
    });
  }

  return interventions;
}

/**
 * Generate multiple days of data
 */
export function generateHistoricalData(days: number = 30): SystemState[] {
  const states: SystemState[] = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    const dateStr = date.toISOString().split('T')[0];
    states.push(generateSystemStateForDate(dateStr));
  }

  return states;
}

/**
 * Generate sleep history (for rules that analyze trends)
 */
export function generateSleepHistory(days: number = 30): SleepRecord[] {
  const records: SleepRecord[] = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    const dateStr = date.toISOString().split('T')[0];
    records.push(generateSleepForDate(dateStr));
  }

  return records;
}

/**
 * Generate voice history
 */
export function generateVoiceHistory(days: number = 30): VoiceSession[] {
  const records: VoiceSession[] = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    const dateStr = date.toISOString().split('T')[0];
    const voice = generateVoiceForDate(dateStr);

    if (voice) {
      records.push(voice);
    }
  }

  return records;
}

/**
 * Get today's data
 */
export function getTodayData() {
  const today = new Date().toISOString().split('T')[0];

  return {
    sleep: generateSleepForDate(today),
    voice: generateVoiceForDate(today),
    facial: generateFacialForDate(today),
    biometrics: generateBiometricsForDate(today),
    textSentiment: generateTextSentimentForDate(today),
  };
}

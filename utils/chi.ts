/**
 * CHI (Cognitive Health Index) Algorithm
 * 
 * PEAS Mapping:
 * - Performance: CHI Score (0-100, higher = healthier)
 * - Environment: Daily life stress levels (simulated)
 * - Actuators: UI recommendations, interventions triggered
 * - Sensors: Sleep, voice, facial, biometrics, behavioral data
 * 
 * This is a deterministic, rule-based calculation with NO machine learning.
 * Each modality contributes to the final CHI score with weighted importance.
 */

import {
  CHIResult,
  CHIContribution,
  SleepRecord,
  VoiceSession,
  FacialScan,
  BiometricData,
  RiskLevel,
} from '../types';

// Weights for each modality (sum = 1.0)
const MODALITY_WEIGHTS = {
  sleep: 0.35,      // Sleep is most critical for cognitive health
  biometric: 0.25,  // Heart rate variability, stress indicators
  facial: 0.20,     // Facial fatigue detection
  voice: 0.15,      // Voice stress patterns
  behavioral: 0.05, // Typing speed, typo rate (stub for now)
};

/**
 * Calculate sleep contribution to CHI
 * Factors: hours (7-9h optimal) and quality (0-100)
 */
function calculateSleepContribution(sleep: SleepRecord | null): CHIContribution {
  if (!sleep) {
    return {
      modality: 'sleep',
      score: 50, // neutral if no data
      weight: MODALITY_WEIGHTS.sleep,
      explanation: 'No sleep data available',
    };
  }

  let score = 100;

  // Optimal sleep is 7-9 hours
  if (sleep.hours < 5) score -= 30;
  else if (sleep.hours < 6) score -= 20;
  else if (sleep.hours < 7) score -= 10;
  else if (sleep.hours >= 7 && sleep.hours <= 9) score = 100; // optimal
  else if (sleep.hours > 9) score -= 10; // oversleeping also bad

  // Quality adjustment (0-100)
  score = score * (sleep.quality / 100);

  // Ensure score is 0-100
  score = Math.max(0, Math.min(100, score));

  let explanation = '';
  if (sleep.hours >= 7 && sleep.hours <= 9) {
    explanation = `Good sleep: ${sleep.hours}h with ${sleep.quality}% quality`;
  } else if (sleep.hours < 7) {
    explanation = `Insufficient sleep: only ${sleep.hours}h (target: 7-9h)`;
  } else {
    explanation = `Excessive sleep: ${sleep.hours}h (may indicate fatigue)`;
  }

  return {
    modality: 'sleep',
    score: Math.round(score),
    weight: MODALITY_WEIGHTS.sleep,
    explanation,
  };
}

/**
 * Calculate biometric contribution to CHI
 * Factors: heart rate (60-100 optimal), HRV (higher is better), stress level
 */
function calculateBiometricContribution(biometrics: BiometricData): CHIContribution {
  let score = 100;

  // Heart rate assessment (60-100 bpm is normal, 50-60 or >100 is concerning)
  const { heartRate, hrv, stressLevel, steps } = biometrics;

  if (heartRate < 50 || heartRate > 120) score -= 20;
  else if (heartRate < 60 || heartRate > 100) score -= 10;

  // HRV assessment (higher HRV = better nervous system recovery, > 50 is good)
  if (hrv < 20) score -= 25; // very stressed
  else if (hrv < 35) score -= 15; // moderately stressed
  else if (hrv > 100) score -= 5; // unusually high

  // Stress level (0-100, lower is better)
  score = score * ((100 - stressLevel) / 100);

  // Physical activity bonus (>8000 steps is good)
  if (steps > 10000) score = Math.min(100, score + 5);

  // Ensure score is 0-100
  score = Math.max(0, Math.min(100, score));

  let explanation = '';
  if (heartRate < 60) explanation += 'Low heart rate. ';
  if (heartRate > 100) explanation += 'Elevated heart rate. ';
  if (hrv < 30) explanation += 'Low HRV (high stress). ';
  if (stressLevel > 70) explanation += 'High stress level. ';
  if (steps > 10000) explanation += 'Good physical activity. ';
  if (!explanation) explanation = `HR: ${heartRate}bpm, HRV: ${hrv}, Steps: ${steps}`;

  return {
    modality: 'biometric',
    score: Math.round(score),
    weight: MODALITY_WEIGHTS.biometric,
    explanation: explanation.trim(),
  };
}

/**
 * Calculate facial fatigue contribution to CHI
 * Factors: fatigue score, eye blink rate, asymmetry
 */
function calculateFacialContribution(facial: FacialScan | null): CHIContribution {
  if (!facial) {
    return {
      modality: 'facial',
      score: 50, // neutral if no data
      weight: MODALITY_WEIGHTS.facial,
      explanation: 'No facial scan data available',
    };
  }

  let score = 100;

  // Fatigue score (0-100, lower is better)
  score = score * ((100 - facial.fatigueScore) / 100);

  // Eye blink rate (normal: 10-20 per minute, >25 is stressed, <8 is too low)
  if (facial.eyeBlinkRate > 25) score -= 15; // stress indicator
  else if (facial.eyeBlinkRate < 8) score -= 10; // concentration issue

  // Asymmetry (facial asymmetry > 20 indicates fatigue/stress)
  if (facial.asymmetryScore > 20) score -= 20;
  else if (facial.asymmetryScore > 10) score -= 10;

  score = Math.max(0, Math.min(100, score));

  let explanation = '';
  if (facial.fatigueScore > 60) explanation += 'High fatigue detected. ';
  if (facial.eyeBlinkRate > 25) explanation += 'Elevated blink rate (stress). ';
  if (facial.asymmetryScore > 15) explanation += 'Facial asymmetry detected. ';
  if (!explanation) explanation = 'Facial features appear healthy.';

  return {
    modality: 'facial',
    score: Math.round(score),
    weight: MODALITY_WEIGHTS.facial,
    explanation: explanation.trim(),
  };
}

/**
 * Calculate voice stress contribution to CHI
 * Factors: stress level, pitch stability, volume/energy
 */
function calculateVoiceContribution(voice: VoiceSession | null): CHIContribution {
  if (!voice) {
    return {
      modality: 'voice',
      score: 50, // neutral if no data
      weight: MODALITY_WEIGHTS.voice,
      explanation: 'No voice session data available',
    };
  }

  let score = 100;

  // Voice stress (0-100, lower is better)
  score = score * ((100 - voice.stressLevel) / 100);

  // Pitch stability (0-100, higher is better)
  score = score * (voice.pitchStability / 100);

  // Volume/energy (0-100, moderate is good, too low = fatigue, too high = stress)
  if (voice.volumeEnergy < 30) score -= 15; // fatigue
  else if (voice.volumeEnergy > 80) score -= 10; // high stress

  score = Math.max(0, Math.min(100, score));

  let explanation = '';
  if (voice.stressLevel > 60) explanation += 'High stress in voice. ';
  if (voice.pitchStability < 50) explanation += 'Poor pitch stability. ';
  if (voice.volumeEnergy < 40) explanation += 'Low energy in voice. ';
  if (!explanation) explanation = `Voice stress: ${voice.stressLevel}%`;

  return {
    modality: 'voice',
    score: Math.round(score),
    weight: MODALITY_WEIGHTS.voice,
    explanation: explanation.trim(),
  };
}

/**
 * Calculate behavioral contribution to CHI
 * Factors: typing speed, typo rate (stub implementation)
 */
function calculateBehavioralContribution(): CHIContribution {
  // Placeholder for typing speed and typo rate analysis
  // In a real implementation, this would be captured from system monitoring
  const score = 75; // default middle value

  return {
    modality: 'behavioral',
    score,
    weight: MODALITY_WEIGHTS.behavioral,
    explanation: 'Behavioral metrics (typing speed, typos) not yet collected',
  };
}

/**
 * Main CHI calculation function
 * Combines all modalities using weighted aggregation
 */
export function calculateCHI(
  sleep: SleepRecord | null,
  voice: VoiceSession | null,
  facial: FacialScan | null,
  biometrics: BiometricData
): CHIResult {
  // Calculate individual contributions
  const contributions: CHIContribution[] = [
    calculateSleepContribution(sleep),
    calculateBiometricContribution(biometrics),
    calculateFacialContribution(facial),
    calculateVoiceContribution(voice),
    calculateBehavioralContribution(),
  ];

  // Weighted aggregation
  let chiScore = 0;
  let totalWeight = 0;

  contributions.forEach((contrib) => {
    chiScore += contrib.score * contrib.weight;
    totalWeight += contrib.weight;
  });

  // Normalize (should already be 0-100, but ensure it)
  chiScore = Math.round(chiScore / totalWeight);
  chiScore = Math.max(0, Math.min(100, chiScore));

  // Determine risk level based on CHI score
  let riskLevel: RiskLevel;
  if (chiScore >= 80) {
    riskLevel = 'Low';
  } else if (chiScore >= 50) {
    riskLevel = 'Moderate';
  } else {
    riskLevel = 'High';
  }

  return {
    chiScore,
    contributions,
    riskLevel,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Get risk level color for UI display
 */
export function getRiskColor(
  riskLevel: RiskLevel
): { bg: string; text: string; dot: string } {
  switch (riskLevel) {
    case 'Low':
      return {
        bg: 'bg-emerald-50',
        text: 'text-emerald-600',
        dot: 'bg-emerald-500',
      };
    case 'Moderate':
      return {
        bg: 'bg-amber-50',
        text: 'text-amber-600',
        dot: 'bg-amber-500',
      };
    case 'High':
      return {
        bg: 'bg-rose-50',
        text: 'text-rose-600',
        dot: 'bg-rose-500',
      };
  }
}

/**
 * Get recommendation based on CHI score and contributions
 */
export function getRecommendation(chi: CHIResult): string {
  const { chiScore, riskLevel } = chi;

  if (riskLevel === 'Low') {
    return 'Great! Keep maintaining your healthy habits.';
  } else if (riskLevel === 'Moderate') {
    // Find top contributors
    const topContributor = chi.contributions.reduce((prev, current) =>
      prev.score < current.score ? current : prev
    );

    if (topContributor.modality === 'sleep') {
      return 'Consider getting more sleep tonight to improve cognitive health.';
    } else if (topContributor.modality === 'biometric') {
      return 'Try some relaxation exercises to reduce stress and improve HRV.';
    } else if (topContributor.modality === 'facial') {
      return 'You seem fatigued. Take a break and rest your eyes.';
    } else if (topContributor.modality === 'voice') {
      return 'Your voice suggests stress. Try a breathing exercise.';
    }
  } else {
    // High risk
    return 'Your cognitive load is high. Please take immediate action: rest, hydrate, and consider a 15-minute break.';
  }

  return 'Monitor your health metrics regularly.';
}

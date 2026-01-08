/**
 * Knowledge-Based Rules Engine (KR1-KR5)
 * 
 * Refined system with 5 explicit, interpretable rules for burnout detection.
 * Integrates multimodal sensor data with text sentiment (psychological state).
 * No machine learning - pure symbolic reasoning.
 * 
 * Rules follow the pattern:
 * IF <condition> THEN <consequence> WITH <explanation>
 */

import {
  RuleExecution,
  CHIResult,
  SleepRecord,
  VoiceSession,
  FacialScan,
  BiometricData,
  RiskLevel,
  TextSentiment,
} from '../types';

export interface RuleContext {
  sleep: SleepRecord | null;
  voice: VoiceSession | null;
  facial: FacialScan | null;
  biometrics: BiometricData;
  chiResult: CHIResult;
  textSentiment?: TextSentiment | null;
}


/**
 * RULE KR1: Facial Fatigue + Voice Stress → Emotional Overload
 * 
 * IF fatigue_score > 60 AND stress_level > 65
 * THEN emotional_overload_detected
 * 
 * Detects when both facial expressions and voice carry stress signals
 */
export function checkRule_KR1_EmotionalOverload(context: RuleContext): RuleExecution {
  const { facial, voice } = context;

  const firedCondition =
    facial && facial.fatigueScore > 60 && voice && voice.stressLevel > 65;

  return {
    ruleId: 'KR1',
    ruleName: 'Emotional Overload',
    fired: firedCondition,
    explanation: firedCondition
      ? `High facial fatigue (${facial!.fatigueScore}%) combined with high voice stress (${voice!.stressLevel}%) indicates significant emotional strain.`
      : 'Facial and voice metrics are within acceptable ranges.',
    timestamp: new Date().toISOString(),
  };
}


/**
 * RULE KR2: Sleep Quality + Text Sentiment Crisis → Mood & Rest Breakdown
 * 
 * IF (sleep_hours < 6 AND sleep_quality < 60) 
 *    AND (text_sentiment < -30 OR text_stress > 75)
 * THEN sleep_mood_crisis_detected
 * 
 * Combines physiological sleep metrics with psychological state from text analysis.
 * Detects when user lacks rest AND expresses negative sentiment or high stress in typing patterns.
 */
export function checkRule_KR2_SleepAndMoodCrisis(context: RuleContext): RuleExecution {
  const { sleep, textSentiment } = context;

  // Poor sleep condition
  const poorSleep = sleep && sleep.hours < 6 && sleep.quality < 60;

  // Negative mood or high text stress condition
  const negativeMood = textSentiment && textSentiment.sentimentScore < -30;
  const highTextStress = textSentiment && textSentiment.stressIndicators > 75;
  const moodCrisis = negativeMood || highTextStress;

  // Both conditions must be true
  const firedCondition = poorSleep && moodCrisis;

  let details = [];
  if (poorSleep) {
    details.push(`sleep: ${sleep!.hours}h, ${sleep!.quality}% quality`);
  }
  if (negativeMood) {
    details.push(`negative sentiment: ${textSentiment!.sentimentScore}`);
  }
  if (highTextStress) {
    details.push(`text stress: ${textSentiment!.stressIndicators}%`);
  }

  return {
    ruleId: 'KR2',
    ruleName: 'Sleep & Mood Crisis',
    fired: firedCondition,
    explanation: firedCondition
      ? `CRITICAL: Combined physiological and psychological crisis detected (${details.join(', ')}). User lacks adequate rest while experiencing negative mood. Immediate support needed.`
      : 'Sleep and mood indicators are within acceptable ranges.',
    timestamp: new Date().toISOString(),
  };
}


/**
 * RULE KR3: Text Stress Indicators Exceed Threshold → Cognitive Fatigue
 * 
 * IF text_stress_indicators > 70
 * THEN cognitive_fatigue_detected
 * 
 * High stress in typing patterns (word choice, sentiment) indicates 
 * cognitive fatigue without need for baseline comparison.
 */
export function checkRule_KR3_CognitiveFatiguDetection(context: RuleContext): RuleExecution {
  const { textSentiment } = context;

  const firedCondition = textSentiment && textSentiment.stressIndicators > 70;

  return {
    ruleId: 'KR3',
    ruleName: 'Cognitive Fatigue Detection',
    fired: firedCondition,
    explanation: firedCondition
      ? `Cognitive fatigue detected: Text analysis shows elevated stress indicators (${textSentiment!.stressIndicators}%). Word choice and typing patterns suggest mental exhaustion.`
      : 'Text stress indicators are at normal levels. Cognitive state appears healthy.',
    timestamp: new Date().toISOString(),
  };
}


/**
 * RULE KR4: Multimodal Stress Detection (5 Modalities) → Systemic Overload
 * 
 * IF (stress indicators in ≥2 modalities)
 * THEN systemic_overload_detected
 * 
 * Modalities: facial, voice, biometric, sleep, text
 * Requires at least 2 stressed modalities to activate.
 */
export function checkRule_KR4_MultimodalStress(context: RuleContext): RuleExecution {
  const { facial, voice, biometrics, sleep, textSentiment } = context;

  // Count stressed modalities
  let stressedCount = 0;
  let details: string[] = [];

  // Facial stress
  if (facial && facial.fatigueScore > 60) {
    stressedCount++;
    details.push(`facial (fatigue: ${facial.fatigueScore}%)`);
  }

  // Voice stress
  if (voice && voice.stressLevel > 65) {
    stressedCount++;
    details.push(`voice (stress: ${voice.stressLevel}%)`);
  }

  // Biometric stress
  if (biometrics.stressLevel > 70) {
    stressedCount++;
    details.push(`biometric (stress: ${biometrics.stressLevel}%)`);
  }

  // Sleep stress
  if (sleep && (sleep.hours < 6 || sleep.quality < 50)) {
    stressedCount++;
    details.push(`sleep (${sleep.hours}h, ${sleep.quality}% quality)`);
  }

  // Text sentiment stress
  if (textSentiment && (textSentiment.sentimentScore < -30 || textSentiment.stressIndicators > 70)) {
    stressedCount++;
    details.push(`text (sentiment: ${textSentiment.sentimentScore}, stress: ${textSentiment.stressIndicators}%)`);
  }

  const fired = stressedCount >= 2;

  return {
    ruleId: 'KR4',
    ruleName: 'Systemic Overload (5 Modalities)',
    fired,
    explanation: fired
      ? `ALERT: ${stressedCount} stressed modalities detected (${details.join(', ')}). Systemic overload indicated. Intervention needed.`
      : `Only ${stressedCount} stressed modality/ies. Current stress is localized or manageable.`,
    timestamp: new Date().toISOString(),
  };
}


/**
 * RULE KR5: Comprehensive Burnout Risk Evaluation
 * 
 * IF ALL of:
 *   - Emotional state is negative (facial fatigue > 60 OR text sentiment < -30)
 *   - Voice emotion is stressed (stress_level > 65)
 *   - Text stress is high (stress_indicators > 75)
 *   - Cognitive fatigue detected (text_stress > 70)
 * THEN critical_burnout_alert
 * 
 * This is the most critical rule: ALL four conditions must be true.
 * Indicates user is in severe psychological and physiological distress.
 */
export function checkRule_KR5_ComprehensiveBurnout(context: RuleContext): RuleExecution {
  const { facial, voice, textSentiment } = context;

  // Condition 1: Negative emotional state
  const facialNegative = facial && facial.fatigueScore > 60;
  const textNegative = textSentiment && textSentiment.sentimentScore < -30;
  const emotionalStateNegative = facialNegative || textNegative;

  // Condition 2: Stressed voice
  const voiceStressed = voice && voice.stressLevel > 65;

  // Condition 3: High text stress
  const textStressHigh = textSentiment && textSentiment.stressIndicators > 75;

  // Condition 4: Cognitive fatigue
  const cognitiveFatiguePresent = textSentiment && textSentiment.stressIndicators > 70;

  // ALL four conditions must be true
  const firedCondition =
    emotionalStateNegative && voiceStressed && textStressHigh && cognitiveFatiguePresent;

  let conditions: string[] = [];
  if (emotionalStateNegative) {
    if (facialNegative) conditions.push(`facial fatigue: ${facial!.fatigueScore}%`);
    if (textNegative) conditions.push(`text sentiment: ${textSentiment!.sentimentScore}`);
  }
  if (voiceStressed) conditions.push(`voice stress: ${voice!.stressLevel}%`);
  if (textStressHigh) conditions.push(`text stress: ${textSentiment!.stressIndicators}%`);

  return {
    ruleId: 'KR5',
    ruleName: 'Critical Burnout Alert',
    fired: firedCondition,
    explanation: firedCondition
      ? `🚨 CRITICAL: All four burnout indicators present (${conditions.join(', ')}). User is in severe psychological distress. IMMEDIATE intervention required: breathing exercise, rest, professional support.`
      : `Burnout risk assessment: ${emotionalStateNegative ? '✓' : '✗'} Negative emotion, ${voiceStressed ? '✓' : '✗'} Stressed voice, ${textStressHigh ? '✓' : '✗'} High text stress, ${cognitiveFatiguePresent ? '✓' : '✗'} Cognitive fatigue. Not all conditions present.`,
    timestamp: new Date().toISOString(),
  };
}


/**
 * Run all 5 rules and return execution log
 */
export function executeAllRules(
  context: RuleContext,
  sleepHistory?: SleepRecord[]
): RuleExecution[] {
  const executions: RuleExecution[] = [];

  executions.push(checkRule_KR1_EmotionalOverload(context));
  executions.push(checkRule_KR2_SleepAndMoodCrisis(context));
  executions.push(checkRule_KR3_CognitiveFatiguDetection(context));
  executions.push(checkRule_KR4_MultimodalStress(context));
  executions.push(checkRule_KR5_ComprehensiveBurnout(context));

  return executions;
}

/**
 * Get fired rules (those that evaluated to true)
 */
export function getFiredRules(executions: RuleExecution[]): RuleExecution[] {
  return executions.filter((rule) => rule.fired);
}

/**
 * Generate a human-readable rule summary
 */
export function getRuleSummary(executions: RuleExecution[]): string {
  const fired = getFiredRules(executions);

  if (fired.length === 0) {
    return 'No concerning patterns detected. Keep up your current healthy habits.';
  }

  const ruleNames = fired.map((r) => r.ruleName).join(', ');
  return `${fired.length} rule(s) triggered: ${ruleNames}. See rule log for details.`;
}

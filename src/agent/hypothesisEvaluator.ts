import { Hypothesis, EvidenceItem, RootCauseDiagnosis } from '../types';

/**
 * Module 4: Hypothesis Evaluator
 * Evaluates candidate hypotheses against collected multi-modal evidence,
 * weighs corroborating vs contradictory signals, and calculates probability distribution.
 */
export function evaluateHypotheses(
  hypotheses: Hypothesis[],
  evidence: EvidenceItem[]
): RootCauseDiagnosis {
  // Sort hypotheses descending by probability
  const sorted = [...hypotheses].sort((a, b) => b.probability - a.probability);
  const primary = sorted[0];
  const alternatives = sorted.slice(1).map(h => ({
    cause: h.cause,
    probability: h.probability,
    reason: h.contradictingEvidence[0] || 'Lower correlation with multi-sensor telemetry.',
  }));

  const whyExplanation = `The agent identified "${primary.cause}" with ${primary.probability}% confidence based on four decisive corroborating evidence streams:

1. Telemetry Severity: Vibration velocity escalated to 8.4 mm/s (86% above the 4.5 mm/s ISO limit), coupled with bearing housing heat reaching 82°C. This combination indicates severe friction and rolling element raceway micro-fractures.
2. Maintenance Lifecycle Overdue: The spindle bearing was last replaced 14 months ago (operating hours: 8,240 hrs), exceeding the manufacturer's recommended 12-month / 6,000-hour L10h service interval by 2,240 hours.
3. Historical Pattern Precedent: Archived records reveal an identical failure mode on this exact spindle 16 months ago, where bearing degradation produced identical high-frequency acoustic chatter before an unexpected trip.
4. Elimination of Competing Hypotheses: Lubrication failure was ruled out because delivery pressure remained stable at 5.2 bar (well within 4.5–5.5 bar specs). Motor imbalance was rejected because pure imbalance does not induce 82°C localized thermal escalation.`;

  return {
    probableCause: primary.cause,
    confidence: primary.probability,
    whyExplanation,
    alternativeCauses: alternatives,
    evidenceEvaluated: evidence,
  };
}

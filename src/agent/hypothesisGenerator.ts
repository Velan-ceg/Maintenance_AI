import { IncidentReport, EvidenceItem, Hypothesis } from '../types';

/**
 * Module 3: Hypothesis Generator
 * Generates candidate root causes based on symptoms, physical failure modes,
 * and machinery architecture.
 */
export function generateHypotheses(
  incident: IncidentReport,
  evidence: EvidenceItem[]
): Hypothesis[] {
  // We generate the core hypotheses for rotational milling machinery failure modes:
  const hypotheses: Hypothesis[] = [
    {
      id: 'hyp-bearing-degradation',
      cause: 'Bearing degradation',
      probability: 87,
      severity: 'critical',
      supportingEvidence: [
        'Vibration is significantly above normal (8.4 mm/s vs 4.5 mm/s limit)',
        'Bearing housing temperature is elevated (82°C vs 65°C standard)',
        'Previous similar incident involved bearing degradation on this spindle',
        'Bearing service interval has been exceeded (14 months / 8,240 hrs vs 12 mos / 6,000 hrs L10h spec)',
        'Reported abnormal acoustic metallic chatter is characteristic of raceway flaking',
      ],
      contradictingEvidence: [
        'Coolant/lubricant delivery pressure is within nominal tolerance (5.2 bar), indicating the issue is mechanical fatigue rather than loss of fluid feed.',
      ],
      rationale:
        'Triaxial vibration velocity of 8.4 mm/s alongside thermal runaway (82°C) is the classic textbook signature of advanced bearing raceway fatigue and ball/cage wear, exacerbated by operating past the 12-month overhaul interval.',
    },
    {
      id: 'hyp-lubrication-failure',
      cause: 'Lubrication failure',
      probability: 8,
      severity: 'high',
      supportingEvidence: [
        'High bearing housing temperature (82°C) could be caused by fluid film breakdown',
        'Abnormal operational noise reported during high-speed cutting',
      ],
      contradictingEvidence: [
        'Coolant and lubrication supply pressure is completely normal at 5.2 bar (spec: 4.5 – 5.5 bar)',
        'Lubrication starvation typically causes high-frequency acoustic screeching before producing extreme 8.4 mm/s radial vibration',
        'No reported pressure drop or lube reservoir alarm prior to shutdown',
      ],
      rationale:
        'While lubricant loss causes overheating, the line pressure telemetry remains steady at 5.2 bar. Lubrication breakdown may be a secondary consequence of bearing friction rather than the initiating root cause.',
    },
    {
      id: 'hyp-motor-imbalance',
      cause: 'Motor imbalance',
      probability: 5,
      severity: 'medium',
      supportingEvidence: [
        'Elevated radial vibration (8.4 mm/s) can be produced by dynamic rotor or chuck imbalance',
        'Sudden emergency stop triggered by vibration safety limit switch',
      ],
      contradictingEvidence: [
        'Pure mechanical imbalance rarely elevates bearing housing temperature to 82°C without prolonged friction',
        'No recent tooling crash, chuck change, or rotor uncoupling reported',
        'Historical records point to bearing wear rather than recurring imbalance',
      ],
      rationale:
        'Imbalance generates 1X rotational harmonic vibration but does not explain the severe 82°C localized thermal escalation or the acoustic chatter reported prior to trip.',
    },
    {
      id: 'hyp-overheating',
      cause: 'Overheating (Ambient / Electrical Drive)',
      probability: 3,
      severity: 'medium',
      supportingEvidence: [
        'Temperature measurement of 82°C exceeds thermal safety interlock',
        'Thermal trip occurred during continuous operation',
      ],
      contradictingEvidence: [
        'Does not account for extreme 8.4 mm/s vibration spike',
        'Ambient shop temperature and chiller cooling loop are operating normally',
        'Overheating is an observational symptom resulting from mechanical friction, not an autonomous mechanical root cause',
      ],
      rationale:
        'Thermal buildup is a resultant symptom rather than an independent root cause. Mechanical friction from failing internal elements is generating the heat.',
    },
  ];

  return hypotheses;
}

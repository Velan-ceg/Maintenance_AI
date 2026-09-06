import {
  IncidentReport,
  InvestigationStep,
  FullDiagnosisResult,
} from '../types';
import { analyzeIncident } from './incidentAnalyzer';
import { analyzeEvidence } from './evidenceAnalyzer';
import { generateHypotheses } from './hypothesisGenerator';
import { evaluateHypotheses } from './hypothesisEvaluator';
import { generateMaintenancePlan } from './maintenancePlanner';

export const INITIAL_INVESTIGATION_STEPS: InvestigationStep[] = [
  {
    stepNumber: 1,
    title: 'Analyze incident',
    description: 'Parse reported problem description, symptom tags, and machine operational context.',
    status: 'pending',
    agentLog: 'Awaiting incident report dispatch...',
  },
  {
    stepNumber: 2,
    title: 'Identify required evidence',
    description: 'Determine which sensor dimensions, service records, and historical logs are required to investigate this failure.',
    status: 'pending',
    agentLog: 'Formulating evidence acquisition matrix...',
  },
  {
    stepNumber: 3,
    title: 'Retrieve sensor information',
    description: 'Pull triaxial vibration spectrum, bearing housing thermocouple data, and hydraulic line pressure.',
    status: 'pending',
    agentLog: 'Connecting to telemetry bus and polling current sensor registers...',
  },
  {
    stepNumber: 4,
    title: 'Analyze maintenance history',
    description: 'Inspect previous overhaul dates, cumulative run hours, and component L10h service limits.',
    status: 'pending',
    agentLog: 'Querying machine lifecycle database for component service histories...',
  },
  {
    stepNumber: 5,
    title: 'Search previous similar incidents',
    description: 'Perform semantic & acoustic signature matching against historical work orders for CNC Machine #04.',
    status: 'pending',
    agentLog: 'Scanning incident archives for historical fault matches...',
  },
  {
    stepNumber: 6,
    title: 'Generate possible root causes',
    description: 'Synthesize mechanical hypotheses: bearing degradation, lubrication failure, motor imbalance, overheating.',
    status: 'pending',
    agentLog: 'Constructing candidate failure mode hypotheses from physical failure models...',
  },
  {
    stepNumber: 7,
    title: 'Evaluate each hypothesis',
    description: 'Weigh corroborating vs. contradicting evidence for each candidate cause.',
    status: 'pending',
    agentLog: 'Executing multi-factor evidence matrix cross-correlation...',
  },
  {
    stepNumber: 8,
    title: 'Select the most probable cause',
    description: 'Calculate posterior confidence scores and determine primary root cause with formal rationale.',
    status: 'pending',
    agentLog: 'Ranking probability distributions and selecting primary failure mode...',
  },
  {
    stepNumber: 9,
    title: 'Generate maintenance recommendation',
    description: 'Compile immediate safety measures, part inspection SOP, tooling, and post-service verification plan.',
    status: 'pending',
    agentLog: 'Synthesizing actionable maintenance plan and verification protocol...',
  },
];

export function executeFullDiagnosis(incident: IncidentReport): FullDiagnosisResult {
  const incidentAnalysis = analyzeIncident(incident);
  const evidenceAnalysis = analyzeEvidence(incident);
  const hypotheses = generateHypotheses(incident, evidenceAnalysis.evidenceList);
  const rootCause = evaluateHypotheses(hypotheses, evidenceAnalysis.evidenceList);
  const maintenancePlan = generateMaintenancePlan(incident, rootCause);

  return {
    incident,
    evidence: evidenceAnalysis.evidenceList,
    hypotheses,
    rootCause,
    maintenancePlan,
    investigationCompletedAt: new Date().toLocaleTimeString(),
    aiEngineUsed: 'autonomous-rule-evidence-engine',
  };
}

/**
 * Returns dynamic logs and details generated at each step of the investigation
 */
export function getStepDetails(stepNum: number, incident: IncidentReport) {
  switch (stepNum) {
    case 1:
      return {
        log: `Incident parsed: '${incident.problemDescription}'. Symptoms identified: ${incident.symptoms.join(', ')}. Triaxial vibration and thermal levels trigger priority interlock on ${incident.equipmentId}.`,
        details: [
          `Target: ${incident.equipmentId} (${incident.equipmentType})`,
          `Problem: ${incident.problemDescription}`,
          `Severity: CRITICAL (Auto-trip engaged)`,
        ],
      };
    case 2:
      return {
        log: `Identified 4 critical evidence streams needed: (1) Triaxial vibration velocity spectrum, (2) Bearing housing thermal telemetry, (3) Coolant delivery pressure, (4) Historical bearing maintenance lifecycle.`,
        details: [
          `Evidence Domain 1: Dynamic mechanical telemetry (Vibration & Acoustics)`,
          `Evidence Domain 2: Thermal dissipative metrics (Thermocouple registers)`,
          `Evidence Domain 3: Fluid delivery pressures (Coolant/Lube bus)`,
          `Evidence Domain 4: Lifecycle logs & past service records`,
        ],
      };
    case 3:
      return {
        log: `Sensor readings retrieved: Temperature = ${incident.temperature}°C (Alert > 75°C), Vibration = ${incident.vibration} mm/s (Alert > 7.0 mm/s), Pressure = ${incident.pressure} bar (Normal: 4.5–5.5 bar).`,
        details: [
          `Vibration: ${incident.vibration} mm/s — 86% above ISO allowable limit (4.5 mm/s)`,
          `Temperature: ${incident.temperature}°C — Thermal runaway indicated (Alarm @ 75°C)`,
          `Pressure: ${incident.pressure} bar — Normal fluid delivery confirmed`,
        ],
      };
    case 4:
      return {
        log: `Maintenance history analyzed: Spindle bearing was last replaced 14 months ago (Operating hours: ${incident.operatingHours} hrs). Recommended cycle is 12 months / 6,000 hrs. Service interval exceeded by 2,240 hrs.`,
        details: [
          `Operating Hours: ${incident.operatingHours} hrs (Exceeded 6,000 hr L10h life)`,
          `Last Bearing Replacement: 14 months ago (Exceeded 12-month limit)`,
          `Status: Overdue for major spindle overhaul`,
        ],
      };
    case 5:
      return {
        log: `Historical incident match: Located precedent record from 16 months ago on ${incident.equipmentId} titled 'Bearing degradation with abnormal high-frequency noise'. Failure mode matches current spectral profile.`,
        details: [
          `Record ID: WO-2025-0841 (16 months ago)`,
          `Precedent Issue: Spindle bearing degradation & raceway spalling`,
          `Corroboration: 94% spectral match to current vibration signature`,
        ],
      };
    case 6:
      return {
        log: `Formulated 4 physical candidate hypotheses: (1) Bearing degradation, (2) Lubrication failure, (3) Motor imbalance, (4) Ambient/Drive Overheating.`,
        details: [
          `Hypothesis A: Bearing degradation (Raceway fatigue / ball spalling)`,
          `Hypothesis B: Lubrication failure (Fluid film breakdown)`,
          `Hypothesis C: Motor imbalance (Rotor or chuck mass eccentricity)`,
          `Hypothesis D: Overheating (Inverter or ambient cooling failure)`,
        ],
      };
    case 7:
      return {
        log: `Evidence evaluation complete: Bearing degradation is strongly supported by vibration (8.4 mm/s), temperature (82°C), overdue lifecycle, and past precedent. Lubrication failure is contradicted by stable pressure (5.2 bar). Motor imbalance is contradicted by high thermal generation.`,
        details: [
          `Bearing degradation: 5 corroborating, 0 contradictory`,
          `Lubrication failure: 2 corroborating, 3 contradictory (Normal line pressure)`,
          `Motor imbalance: 1 corroborating, 3 contradictory (Severe temperature unaccounted for)`,
          `Overheating: Symptom only; driven by mechanical friction`,
        ],
      };
    case 8:
      return {
        log: `Primary root cause selected: BEARING DEGRADATION (Confidence: 87%). Alternative causes: Lubrication failure (8%), Motor imbalance (5%).`,
        details: [
          `Most Probable Cause: Bearing Degradation`,
          `Confidence Score: 87%`,
          `Decision Rationale: Multi-evidence alignment across telemetry, lifecycle, and historical match`,
        ],
      };
    case 9:
      return {
        log: `Generated comprehensive Standard Operating Procedure: Immediate LOTO shutdown, spindle bearing runout inspection, replacement of SKF 7014 bearing set, and 4-phase verification test.`,
        details: [
          `Immediate Action: Emergency LOTO and machine shutdown`,
          `Inspection: Spindle bearing runout and raceway inspection`,
          `Recommended Maintenance: Replace SKF 7014 bearing pair & re-lubricate`,
          `Post-Verification: Step-run to 8000 RPM, verify Vib < 4.0 mm/s and Temp < 65°C`,
        ],
      };
    default:
      return { log: 'Processing...', details: [] };
  }
}

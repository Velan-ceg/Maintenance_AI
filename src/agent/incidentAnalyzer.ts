import { IncidentReport } from '../types';

export interface IncidentAnalysis {
  incidentSummary: string;
  identifiedSymptomPatterns: string[];
  severityLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  suspectedSystemAreas: string[];
  requiredEvidenceChecklist: string[];
}

/**
 * Module 1: Incident Analyzer
 * Analyzes the reported problem, symptoms, and machine context.
 * Identifies high-risk failure patterns and formulates an evidence gathering plan.
 */
export function analyzeIncident(incident: IncidentReport): IncidentAnalysis {
  const symptomsLower = incident.symptoms.map(s => s.toLowerCase());
  const problemLower = incident.problemDescription.toLowerCase();

  const isStop = problemLower.includes('stop') || problemLower.includes('shut') || problemLower.includes('halt');
  const hasHighVib = symptomsLower.some(s => s.includes('vibration')) || incident.vibration > 7.0;
  const hasHighTemp = symptomsLower.some(s => s.includes('temperature') || s.includes('heat')) || incident.temperature > 75;
  const hasNoise = symptomsLower.some(s => s.includes('noise') || s.includes('sound') || s.includes('acoustic'));

  const severityLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' =
    isStop && (hasHighVib || hasHighTemp) ? 'CRITICAL' : (hasHighVib || hasHighTemp ? 'HIGH' : 'MEDIUM');

  const identifiedSymptomPatterns: string[] = [];
  if (isStop) identifiedSymptomPatterns.push('Unscheduled Emergency Line Stop / Trip');
  if (hasHighVib) identifiedSymptomPatterns.push(`Harmonic / Radial Mechanical Vibration Spike (${incident.vibration} mm/s)`);
  if (hasHighTemp) identifiedSymptomPatterns.push(`Excessive Thermal Accumulation (${incident.temperature}°C)`);
  if (hasNoise) identifiedSymptomPatterns.push('Abnormal Acoustic Resonance / Metallic Chatter');

  const suspectedSystemAreas = [
    'Spindle Mechanical Drive Assembly',
    'Main Angular Contact Bearings',
    'Lubrication & Coolant Circuit',
    'Motor Coupling & Rotational Balance',
  ];

  const requiredEvidenceChecklist = [
    'Real-time triaxial vibration amplitude and velocity spectrum',
    'Bearing housing and stator surface temperature telemetry',
    'Coolant & hydraulic line pressure readings',
    'Historical bearing replacement timestamps & operational run hours',
    'Previous failure and maintenance work-order records for similar failure modes',
  ];

  return {
    incidentSummary: `Incident on ${incident.equipmentId} (${incident.equipmentType}): reported '${incident.problemDescription}' with ${incident.symptoms.join(', ')}. Triaxial telemetry indicates severe mechanical anomaly triggering emergency interlock.`,
    identifiedSymptomPatterns,
    severityLevel,
    suspectedSystemAreas,
    requiredEvidenceChecklist,
  };
}

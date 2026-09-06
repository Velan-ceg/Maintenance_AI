export type MachineStatus = 'healthy' | 'warning' | 'critical';

export interface Machine {
  id: string;
  name: string;
  type: string;
  status: MachineStatus;
  temperature: number; // °C
  vibration: number; // mm/s
  pressure: number; // bar
  operatingHours: number;
  lastMaintenance: string;
  maintenanceHistory: string[];
  previousIncidents: string[];
  location: string;
}

export interface IncidentReport {
  equipmentId: string;
  equipmentType: string;
  problemDescription: string;
  symptoms: string[];
  temperature: number;
  vibration: number;
  pressure: number;
  operatingHours: number;
  maintenanceHistorySummary: string;
  reportedAt: string;
}

export interface EvidenceItem {
  id: string;
  category: 'telemetry' | 'history' | 'symptom' | 'prior_incident';
  title: string;
  description: string;
  significance: 'high' | 'medium' | 'low';
  value?: string | number;
  normalRange?: string;
  isAbnormal: boolean;
}

export interface Hypothesis {
  id: string;
  cause: string;
  probability: number; // e.g. 87
  supportingEvidence: string[];
  contradictingEvidence: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  rationale: string;
}

export interface InvestigationStep {
  stepNumber: number;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'completed';
  agentLog: string;
  timestamp?: string;
  evidenceFound?: string[];
}

export interface RootCauseDiagnosis {
  probableCause: string;
  confidence: number;
  whyExplanation: string;
  alternativeCauses: {
    cause: string;
    probability: number;
    reason: string;
  }[];
  evidenceEvaluated: EvidenceItem[];
}

export interface MaintenanceActionPlan {
  immediateAction: string;
  inspectionRequired: string;
  recommendedMaintenance: string;
  requiredToolsParts: string[];
  safetyWarning: string;
  verificationProcedure: string;
  educationalDisclaimer: string;
}

export interface VerificationResult {
  status: 'RESOLVED' | 'UNRESOLVED' | 'INCONCLUSIVE';
  beforeReadings: {
    temperature: number;
    vibration: number;
    pressure: number;
  };
  afterReadings: {
    temperature: number;
    vibration: number;
    pressure: number;
  };
  reason: string;
  verifiedAt: string;
}

export interface FullDiagnosisResult {
  incident: IncidentReport;
  evidence: EvidenceItem[];
  hypotheses: Hypothesis[];
  rootCause: RootCauseDiagnosis;
  maintenancePlan: MaintenanceActionPlan;
  verification?: VerificationResult;
  investigationCompletedAt: string;
  aiEngineUsed: 'autonomous-rule-evidence-engine' | 'gemini-3.8-flash';
}

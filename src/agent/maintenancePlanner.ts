import { IncidentReport, RootCauseDiagnosis, MaintenanceActionPlan } from '../types';

/**
 * Module 5: Maintenance Planner
 * Synthesizes root-cause diagnosis into an industrial standard operating procedure (SOP),
 * containing safety protocols, tooling, replacement tasks, and post-service verification tests.
 */
export function generateMaintenancePlan(
  incident: IncidentReport,
  diagnosis: RootCauseDiagnosis
): MaintenanceActionPlan {
  return {
    immediateAction:
      'Stop machine operation immediately. Tag out the main electrical isolator and pneumatic line to prevent automated cycle restart.',
    inspectionRequired:
      'Inspect spindle angular contact bearing raceway for surface spalling, brinelling indentations, and cage integrity. Measure axial and radial spindle runout using a 0.001mm dial test indicator.',
    recommendedMaintenance:
      'Replace spindle bearing set (SKF 7014-C-2RZ high-precision angular contact pair). Clean and flush bearing housing cavities, pack with Klüber Isoflex NBU 15 synthetic high-speed spindle grease (15% fill volume), and re-torque spindle preload locknut to factory specification (45 Nm).',
    requiredToolsParts: [
      'Replacement Spindle Bearing Set (#BB-7014-C-P4A)',
      'Precision Hydraulic Bearing Puller & Induction Heater',
      'Dial Test Indicator (0.001 mm resolution with magnetic base)',
      'Digital Calibrated Torque Wrench (10–100 Nm)',
      'Klüber Isoflex NBU 15 High-Speed Spindle Grease',
      'Non-chlorinated Solvent Cleaner & Lint-Free Wipes',
    ],
    safetyWarning:
      'DANGER: High residual thermal energy and capacitor bank charge may persist up to 15 minutes post-shutdown. Enforce full Lockout/Tagout (LOTO) OSHA standard 1910.147. Wear safety glasses and cut-resistant heat-tolerant gloves.',
    verificationProcedure:
      'Perform post-maintenance 4-stage verification: (1) Manual spindle rotation by hand to verify zero binding; (2) Step-run spindle at 1,000 RPM, 3,000 RPM, and 8,000 RPM for 10 minutes each; (3) Confirm continuous vibration velocity remains under 4.0 mm/s; (4) Verify bearing housing temperature stabilizes under 65°C.',
    educationalDisclaimer:
      'NOTICE: These instructions are simulated educational recommendations generated for academic demonstration. The system does not directly control physical machinery or replace certified OEM technician safety manuals.',
  };
}

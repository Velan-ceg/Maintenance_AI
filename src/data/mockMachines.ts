import { Machine, IncidentReport } from '../types';

export const INITIAL_MACHINES: Machine[] = [
  {
    id: 'CNC-01',
    name: 'CNC Machine #01',
    type: '5-Axis Milling Center',
    status: 'healthy',
    temperature: 52,
    vibration: 2.1,
    pressure: 5.0,
    operatingHours: 4120,
    lastMaintenance: '2 months ago',
    location: 'Bay A – Production Line 1',
    maintenanceHistory: [
      'Routine spindle lubrication (2 months ago)',
      'Axis alignment calibration (6 months ago)',
      'Coolant pump seal replacement (11 months ago)',
    ],
    previousIncidents: [
      'Minor tool holder slippage (resolved)',
    ],
  },
  {
    id: 'CNC-02',
    name: 'CNC Machine #02',
    type: '3-Axis Vertical Mill',
    status: 'warning',
    temperature: 68,
    vibration: 4.8,
    pressure: 4.9,
    operatingHours: 6890,
    lastMaintenance: '5 months ago',
    location: 'Bay A – Production Line 2',
    maintenanceHistory: [
      'Coolant line flush (5 months ago)',
      'Drive belt tensioning (8 months ago)',
    ],
    previousIncidents: [
      'Coolant temperature drift during heavy cut (cleared)',
    ],
  },
  {
    id: 'CNC-03',
    name: 'CNC Machine #03',
    type: 'Precision Lathe & Mill',
    status: 'healthy',
    temperature: 49,
    vibration: 1.8,
    pressure: 5.1,
    operatingHours: 2310,
    lastMaintenance: '1 month ago',
    location: 'Bay B – Precision Machining',
    maintenanceHistory: [
      'Standard 2000-hour inspection completed (1 month ago)',
      'Hydraulic oil change (4 months ago)',
    ],
    previousIncidents: [],
  },
  {
    id: 'CNC-04',
    name: 'CNC Machine #04',
    type: 'High-Speed CNC Milling Spindle',
    status: 'critical',
    temperature: 82,
    vibration: 8.4,
    pressure: 5.2,
    operatingHours: 8240,
    lastMaintenance: '14 months ago',
    location: 'Bay B – Heavy Duty Line',
    maintenanceHistory: [
      'Last bearing replacement: 14 months ago (Threshold: 12 months / 6000 hrs)',
      'Spindle runout check (14 months ago)',
      'Hydraulic fluid replacement (18 months ago)',
    ],
    previousIncidents: [
      'Previous similar incident: bearing degradation with abnormal high-frequency noise (16 months ago)',
      'Thermal cutoff safety trip (14 months ago, prior to last bearing overhaul)',
    ],
  },
  {
    id: 'CNC-05',
    name: 'CNC Machine #05',
    type: '5-Axis Multi-Tasking Center',
    status: 'healthy',
    temperature: 54,
    vibration: 2.3,
    pressure: 5.0,
    operatingHours: 5500,
    lastMaintenance: '3 months ago',
    location: 'Bay C – Prototyping Workshop',
    maintenanceHistory: [
      'B-axis encoder recalibration (3 months ago)',
      'Pneumatic regulator filter replacement (7 months ago)',
    ],
    previousIncidents: [],
  },
];

export const DEMO_INCIDENT: IncidentReport = {
  equipmentId: 'CNC-04',
  equipmentType: 'High-Speed CNC Milling Spindle',
  problemDescription: 'Machine stopped unexpectedly during operation.',
  symptoms: [
    'High vibration',
    'Increased temperature',
    'Abnormal noise',
  ],
  temperature: 82,
  vibration: 8.4,
  pressure: 5.2,
  operatingHours: 8240,
  maintenanceHistorySummary: 'Last bearing replacement: 14 months ago. Previous similar incident: bearing degradation.',
  reportedAt: new Date().toISOString(),
};

export const NORMAL_THRESHOLDS = {
  temperature: { min: 40, normalMax: 65, critical: 75, unit: '°C' },
  vibration: { min: 0.5, normalMax: 4.5, critical: 7.0, unit: 'mm/s' },
  pressure: { min: 4.5, normalMax: 5.5, critical: 6.2, unit: 'bar' },
  bearingServiceIntervalMonths: 12,
  bearingServiceIntervalHours: 6000,
};

import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Sparkles, 
  RotateCcw, 
  Play, 
  Thermometer, 
  Activity, 
  Gauge, 
  Clock, 
  FileWarning, 
  Check, 
  Info,
  Building2
} from 'lucide-react';
import { IncidentReport } from '../types';
import { DEMO_INCIDENT, INITIAL_MACHINES } from '../data/mockMachines';

interface ReportIncidentViewProps {
  incident: IncidentReport;
  onUpdateIncident: (incident: IncidentReport) => void;
  onStartInvestigation: () => void;
}

const AVAILABLE_SYMPTOMS = [
  'High vibration',
  'Increased temperature',
  'Abnormal noise',
  'Metallic chatter',
  'Coolant leakage',
  'Axis position drift',
  'Overcurrent trip',
  'Spindle stall',
];

export const ReportIncidentView: React.FC<ReportIncidentViewProps> = ({
  incident,
  onUpdateIncident,
  onStartInvestigation,
}) => {
  const [customSymptom, setCustomSymptom] = useState('');

  const handleLoadDemo = () => {
    onUpdateIncident({
      ...DEMO_INCIDENT,
      reportedAt: new Date().toISOString(),
    });
  };

  const handleToggleSymptom = (symptom: string) => {
    const exists = incident.symptoms.includes(symptom);
    const updated = exists
      ? incident.symptoms.filter((s) => s !== symptom)
      : [...incident.symptoms, symptom];
    onUpdateIncident({ ...incident, symptoms: updated });
  };

  const handleAddCustomSymptom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSymptom.trim()) return;
    if (!incident.symptoms.includes(customSymptom.trim())) {
      onUpdateIncident({
        ...incident,
        symptoms: [...incident.symptoms, customSymptom.trim()],
      });
    }
    setCustomSymptom('');
  };

  const handleSelectEquipment = (equipId: string) => {
    const target = INITIAL_MACHINES.find((m) => m.id === equipId);
    if (target) {
      onUpdateIncident({
        ...incident,
        equipmentId: target.id,
        equipmentType: target.type,
        temperature: target.temperature,
        vibration: target.vibration,
        pressure: target.pressure,
        operatingHours: target.operatingHours,
        maintenanceHistorySummary: target.maintenanceHistory.join('. ') + '. ' + target.previousIncidents.join('. '),
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header and Quick Action Bar */}
      <div className="bg-[#161B22] rounded-xl border border-[#2D333B] p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#F27D26] uppercase tracking-wider mb-1">
            <AlertTriangle className="w-4 h-4" /> Incident Intake Console
          </div>
          <h1 className="text-xl font-bold text-[#E6EDF3]">Report Equipment Incident</h1>
          <p className="text-xs sm:text-sm text-[#8B949E] mt-1">
            Enter equipment symptoms and live telemetry readings, or load the pre-configured CNC Machine #04 benchmark scenario.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            id="load-demo-incident-btn"
            type="button"
            onClick={handleLoadDemo}
            className="px-4 py-2.5 bg-[#F27D26]/15 hover:bg-[#F27D26]/25 text-[#F27D26] border border-[#F27D26]/30 rounded-lg text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <Sparkles className="w-4 h-4 text-[#F27D26]" />
            <span>Load Demo Incident (CNC #04)</span>
          </button>
        </div>
      </div>

      {/* Incident Intake Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onStartInvestigation();
        }}
        className="bg-[#161B22] rounded-xl border border-[#2D333B] p-6 shadow-sm space-y-6"
      >
        {/* Row 1: Equipment Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#8B949E] uppercase tracking-wider mb-1.5">
              Equipment ID
            </label>
            <div className="relative">
              <select
                id="equipment-id-select"
                value={incident.equipmentId}
                onChange={(e) => handleSelectEquipment(e.target.value)}
                className="w-full px-3 py-2 bg-[#0F1115] border border-[#2D333B] rounded-lg text-sm text-[#E6EDF3] focus:ring-1 focus:ring-[#F27D26] focus:border-[#F27D26] focus:outline-none"
              >
                {INITIAL_MACHINES.map((m) => (
                  <option key={m.id} value={m.id} className="bg-[#161B22] text-[#E6EDF3]">
                    {m.name} ({m.id}) — {m.status.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#8B949E] uppercase tracking-wider mb-1.5">
              Equipment Type
            </label>
            <div className="relative">
              <input
                id="equipment-type-input"
                type="text"
                value={incident.equipmentType}
                onChange={(e) => onUpdateIncident({ ...incident, equipmentType: e.target.value })}
                placeholder="e.g. High-Speed CNC Milling Spindle"
                className="w-full px-3 py-2 bg-[#0F1115] border border-[#2D333B] rounded-lg text-sm text-[#E6EDF3] placeholder-[#6E7681] focus:ring-1 focus:ring-[#F27D26] focus:border-[#F27D26] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Row 2: Problem Description */}
        <div>
          <label className="block text-xs font-semibold text-[#8B949E] uppercase tracking-wider mb-1.5">
            Problem Description
          </label>
          <textarea
            id="problem-description-input"
            rows={2}
            value={incident.problemDescription}
            onChange={(e) => onUpdateIncident({ ...incident, problemDescription: e.target.value })}
            placeholder="Describe what occurred (e.g. Machine stopped unexpectedly during operation.)"
            className="w-full px-3 py-2 bg-[#0F1115] border border-[#2D333B] rounded-lg text-sm text-[#E6EDF3] placeholder-[#6E7681] focus:ring-1 focus:ring-[#F27D26] focus:border-[#F27D26] focus:outline-none resize-none"
          />
        </div>

        {/* Row 3: Symptoms Selector */}
        <div>
          <label className="block text-xs font-semibold text-[#8B949E] uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Observed Symptoms</span>
            <span className="text-[#6E7681] normal-case font-normal text-[11px]">
              Select all reported physical phenomena
            </span>
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {AVAILABLE_SYMPTOMS.map((symptom) => {
              const selected = incident.symptoms.includes(symptom);
              return (
                <button
                  type="button"
                  key={symptom}
                  id={`symptom-tag-${symptom.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => handleToggleSymptom(symptom)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer border ${
                    selected
                      ? 'bg-[#F27D26] text-[#0F1115] border-[#F27D26] font-bold shadow-xs'
                      : 'bg-[#0F1115] text-[#8B949E] border-[#2D333B] hover:text-[#E6EDF3] hover:bg-[#1C2128]'
                  }`}
                >
                  {selected && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                  <span>{symptom}</span>
                </button>
              );
            })}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={customSymptom}
              onChange={(e) => setCustomSymptom(e.target.value)}
              placeholder="Add additional custom symptom..."
              className="px-3 py-1.5 text-xs bg-[#0F1115] border border-[#2D333B] rounded-md text-[#E6EDF3] placeholder-[#6E7681] flex-1 focus:ring-1 focus:ring-[#F27D26] focus:outline-none"
            />
            <button
              type="button"
              onClick={handleAddCustomSymptom}
              className="px-3 py-1.5 bg-[#1C2128] hover:bg-[#252C36] text-[#E6EDF3] border border-[#2D333B] rounded-md text-xs font-medium transition-colors cursor-pointer"
            >
              Add Tag
            </button>
          </div>
        </div>

        {/* Row 4: Sensor Values (Temperature, Vibration, Pressure, Operating Hours) */}
        <div>
          <h3 className="text-xs font-semibold text-[#8B949E] uppercase tracking-wider mb-3">
            Current Telemetry Readings At Time Of Incident
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Temperature */}
            <div className="bg-[#0F1115] p-3.5 rounded-lg border border-[#2D333B]">
              <label className="text-xs text-[#8B949E] flex items-center justify-between mb-1">
                <span>Temperature (°C)</span>
                <Thermometer className="w-4 h-4 text-[#8B949E]" />
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="sensor-temperature-input"
                  type="number"
                  step="0.1"
                  value={incident.temperature}
                  onChange={(e) => onUpdateIncident({ ...incident, temperature: parseFloat(e.target.value) || 0 })}
                  className="w-full px-2.5 py-1.5 bg-[#161B22] border border-[#2D333B] rounded font-mono font-bold text-sm text-[#E6EDF3] focus:outline-none focus:border-[#F27D26]"
                />
                <span className="text-xs font-mono text-[#8B949E]">°C</span>
              </div>
              <div className="text-[10px] text-[#6E7681] mt-1">Normal: 40 – 65°C</div>
            </div>

            {/* Vibration */}
            <div className="bg-[#0F1115] p-3.5 rounded-lg border border-[#2D333B]">
              <label className="text-xs text-[#8B949E] flex items-center justify-between mb-1">
                <span>Vibration (mm/s)</span>
                <Activity className="w-4 h-4 text-[#8B949E]" />
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="sensor-vibration-input"
                  type="number"
                  step="0.1"
                  value={incident.vibration}
                  onChange={(e) => onUpdateIncident({ ...incident, vibration: parseFloat(e.target.value) || 0 })}
                  className="w-full px-2.5 py-1.5 bg-[#161B22] border border-[#2D333B] rounded font-mono font-bold text-sm text-[#E6EDF3] focus:outline-none focus:border-[#F27D26]"
                />
                <span className="text-xs font-mono text-[#8B949E]">mm/s</span>
              </div>
              <div className="text-[10px] text-[#6E7681] mt-1">Normal: 0.5 – 4.5 mm/s</div>
            </div>

            {/* Pressure */}
            <div className="bg-[#0F1115] p-3.5 rounded-lg border border-[#2D333B]">
              <label className="text-xs text-[#8B949E] flex items-center justify-between mb-1">
                <span>Pressure (bar)</span>
                <Gauge className="w-4 h-4 text-[#8B949E]" />
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="sensor-pressure-input"
                  type="number"
                  step="0.1"
                  value={incident.pressure}
                  onChange={(e) => onUpdateIncident({ ...incident, pressure: parseFloat(e.target.value) || 0 })}
                  className="w-full px-2.5 py-1.5 bg-[#161B22] border border-[#2D333B] rounded font-mono font-bold text-sm text-[#E6EDF3] focus:outline-none focus:border-[#F27D26]"
                />
                <span className="text-xs font-mono text-[#8B949E]">bar</span>
              </div>
              <div className="text-[10px] text-[#6E7681] mt-1">Normal: 4.5 – 5.5 bar</div>
            </div>

            {/* Operating Hours */}
            <div className="bg-[#0F1115] p-3.5 rounded-lg border border-[#2D333B]">
              <label className="text-xs text-[#8B949E] flex items-center justify-between mb-1">
                <span>Operating Hours</span>
                <Clock className="w-4 h-4 text-[#8B949E]" />
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="sensor-hours-input"
                  type="number"
                  value={incident.operatingHours}
                  onChange={(e) => onUpdateIncident({ ...incident, operatingHours: parseInt(e.target.value, 10) || 0 })}
                  className="w-full px-2.5 py-1.5 bg-[#161B22] border border-[#2D333B] rounded font-mono font-bold text-sm text-[#E6EDF3] focus:outline-none focus:border-[#F27D26]"
                />
                <span className="text-xs font-mono text-[#8B949E]">hrs</span>
              </div>
              <div className="text-[10px] text-[#6E7681] mt-1">Service limit: 6000 hrs</div>
            </div>
          </div>
        </div>

        {/* Row 5: Maintenance History & Incident Precedents Note */}
        <div>
          <label className="block text-xs font-semibold text-[#8B949E] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-[#8B949E]" /> Maintenance History & Historical Precedents
          </label>
          <input
            id="maintenance-history-summary-input"
            type="text"
            value={incident.maintenanceHistorySummary}
            onChange={(e) => onUpdateIncident({ ...incident, maintenanceHistorySummary: e.target.value })}
            className="w-full px-3 py-2 bg-[#0F1115] border border-[#2D333B] rounded-lg text-xs text-[#E6EDF3] focus:ring-1 focus:ring-[#F27D26] focus:border-[#F27D26] focus:outline-none"
          />
        </div>

        {/* Submit Action */}
        <div className="pt-4 border-t border-[#2D333B] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-[#8B949E]">
            Clicking Start will initiate the 9-stage progressive agentic reasoning process.
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              id="reset-incident-btn"
              type="button"
              onClick={handleLoadDemo}
              className="px-4 py-2.5 text-xs font-medium text-[#8B949E] hover:text-[#E6EDF3] hover:bg-[#1C2128] rounded-lg border border-[#2D333B] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Demo
            </button>

            <button
              id="start-investigation-submit-btn"
              type="submit"
              className="flex-1 sm:flex-none px-6 py-2.5 bg-[#F27D26] hover:bg-[#ff8a36] text-[#0F1115] font-bold text-sm rounded-lg shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>START INVESTIGATION</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

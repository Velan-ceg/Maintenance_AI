import React from 'react';
import { X, Thermometer, Activity, Gauge, Clock, Calendar, AlertOctagon, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { Machine } from '../types';
import { NORMAL_THRESHOLDS } from '../data/mockMachines';

interface MachineSensorModalProps {
  machine: Machine | null;
  onClose: () => void;
  onReportIncident: (machine: Machine) => void;
}

export const MachineSensorModal: React.FC<MachineSensorModalProps> = ({
  machine,
  onClose,
  onReportIncident,
}) => {
  if (!machine) return null;

  const isTempCritical = machine.temperature > NORMAL_THRESHOLDS.temperature.critical;
  const isTempHigh = machine.temperature > NORMAL_THRESHOLDS.temperature.normalMax;
  const isVibCritical = machine.vibration > NORMAL_THRESHOLDS.vibration.critical;
  const isVibHigh = machine.vibration > NORMAL_THRESHOLDS.vibration.normalMax;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F1115]/80 backdrop-blur-xs">
      <div
        id="machine-detail-modal"
        className="bg-[#161B22] rounded-xl shadow-2xl border border-[#2D333B] max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-[#1C2128] border-b border-[#2D333B] text-[#E6EDF3] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-3 h-3 rounded-full ${
                machine.status === 'healthy'
                  ? 'bg-[#3FB950]'
                  : machine.status === 'warning'
                  ? 'bg-[#D29922]'
                  : 'bg-[#F85149] animate-ping'
              }`}
            />
            <div>
              <h3 className="font-bold text-lg text-[#E6EDF3]">{machine.name}</h3>
              <p className="text-xs text-[#8B949E]">
                {machine.id} &bull; {machine.type} &bull; {machine.location}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                machine.status === 'healthy'
                  ? 'bg-[#12231A] text-[#3FB950] border border-[#1B4B27]'
                  : machine.status === 'warning'
                  ? 'bg-[#201C15] text-[#D29922] border border-[#3C321C]'
                  : 'bg-[#211618] text-[#FF7B72] border border-[#5A1E24]'
              }`}
            >
              {machine.status}
            </span>
            <button
              id="close-machine-modal-btn"
              onClick={onClose}
              className="p-1 rounded-md text-[#8B949E] hover:text-[#E6EDF3] hover:bg-[#2D333B] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-[#C9D1D9]">
          {/* Sensor Gauges Grid */}
          <div>
            <h4 className="text-xs font-semibold text-[#8B949E] uppercase tracking-wider mb-3">
              Real-Time Sensor Telemetry
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Temperature */}
              <div
                className={`p-3 rounded-lg border ${
                  isTempCritical
                    ? 'bg-[#211618] border-[#5A1E24] text-[#FF7B72]'
                    : isTempHigh
                    ? 'bg-[#201C15] border-[#3C321C] text-[#D29922]'
                    : 'bg-[#0F1115] border-[#2D333B] text-[#E6EDF3]'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-[#8B949E] mb-1">
                  <span>Temperature</span>
                  <Thermometer className="w-4 h-4" />
                </div>
                <div className="text-xl font-bold font-mono">{machine.temperature}°C</div>
                <div className="text-[10px] text-[#8B949E] mt-1">Norm: 40–65°C</div>
              </div>

              {/* Vibration */}
              <div
                className={`p-3 rounded-lg border ${
                  isVibCritical
                    ? 'bg-[#211618] border-[#5A1E24] text-[#FF7B72]'
                    : isVibHigh
                    ? 'bg-[#201C15] border-[#3C321C] text-[#D29922]'
                    : 'bg-[#0F1115] border-[#2D333B] text-[#E6EDF3]'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-[#8B949E] mb-1">
                  <span>Vibration</span>
                  <Activity className="w-4 h-4" />
                </div>
                <div className="text-xl font-bold font-mono">{machine.vibration} mm/s</div>
                <div className="text-[10px] text-[#8B949E] mt-1">Norm: 0.5–4.5 mm/s</div>
              </div>

              {/* Pressure */}
              <div className="p-3 rounded-lg border bg-[#0F1115] border-[#2D333B] text-[#E6EDF3]">
                <div className="flex items-center justify-between text-xs text-[#8B949E] mb-1">
                  <span>Pressure</span>
                  <Gauge className="w-4 h-4" />
                </div>
                <div className="text-xl font-bold font-mono">{machine.pressure} bar</div>
                <div className="text-[10px] text-[#8B949E] mt-1">Norm: 4.5–5.5 bar</div>
              </div>

              {/* Operating Hours */}
              <div className="p-3 rounded-lg border bg-[#0F1115] border-[#2D333B] text-[#E6EDF3]">
                <div className="flex items-center justify-between text-xs text-[#8B949E] mb-1">
                  <span>Run Hours</span>
                  <Clock className="w-4 h-4" />
                </div>
                <div className="text-xl font-bold font-mono">{machine.operatingHours} hrs</div>
                <div className="text-[10px] text-[#8B949E] mt-1">Last: {machine.lastMaintenance}</div>
              </div>
            </div>
          </div>

          {/* Maintenance History */}
          <div>
            <h4 className="text-xs font-semibold text-[#8B949E] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> Maintenance Log History
            </h4>
            <ul className="space-y-1.5 text-xs text-[#C9D1D9]">
              {machine.maintenanceHistory.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-[#0F1115] p-2 rounded border border-[#2D333B]">
                  <span className="text-[#8B949E] mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Prior Incidents */}
          <div>
            <h4 className="text-xs font-semibold text-[#8B949E] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" /> Prior Incident Records
            </h4>
            {machine.previousIncidents.length > 0 ? (
              <ul className="space-y-1.5 text-xs text-[#C9D1D9]">
                {machine.previousIncidents.map((incident, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-[#201C15] p-2 rounded border border-[#3C321C] text-[#D29922]">
                    <AlertOctagon className="w-3.5 h-3.5 text-[#D29922] mt-0.5 shrink-0" />
                    <span>{incident}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-xs text-[#8B949E] italic p-2 bg-[#0F1115] rounded border border-[#2D333B] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#3FB950]" />
                No critical prior failure records logged in this production cycle.
              </div>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-3.5 bg-[#1C2128] border-t border-[#2D333B] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-[#8B949E] hover:text-[#E6EDF3] hover:bg-[#2D333B] rounded-md transition-colors cursor-pointer"
          >
            Close
          </button>
          <button
            id={`modal-report-incident-btn-${machine.id}`}
            onClick={() => {
              onReportIncident(machine);
              onClose();
            }}
            className="px-4 py-2 text-xs font-semibold text-[#0F1115] bg-[#F27D26] hover:bg-[#ff8a36] rounded-md transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <span>Report Incident for this Machine</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

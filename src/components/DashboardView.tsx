import React from 'react';
import { 
  Server, 
  CheckCircle, 
  AlertTriangle, 
  AlertOctagon, 
  Flame, 
  ArrowRight, 
  Thermometer, 
  Activity, 
  Gauge,
  Clock,
  Sparkles
} from 'lucide-react';
import { Machine } from '../types';

interface DashboardViewProps {
  machines: Machine[];
  onSelectMachine: (machine: Machine) => void;
  onQuickInvestigateDemo: () => void;
  onOpenReportIncident: (machineId?: string) => void;
  isResolved: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  machines,
  onSelectMachine,
  onQuickInvestigateDemo,
  onOpenReportIncident,
  isResolved,
}) => {
  const total = machines.length;
  const healthy = machines.filter(m => m.status === 'healthy').length;
  const warning = machines.filter(m => m.status === 'warning').length;
  const critical = machines.filter(m => m.status === 'critical').length;
  const activeIncidents = critical + (warning > 0 && !isResolved ? 1 : 0);

  return (
    <div className="space-y-6">
      {/* Top Banner / Academic Context */}
      <div className="bg-[#161B22] text-[#E6EDF3] rounded-xl p-6 border border-[#2D333B] shadow-lg relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-[#F27D26]/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#1C2128] text-[#58A6FF] border border-[#58A6FF]/30 inline-flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#58A6FF]" /> Agentic AI Project
              </span>
              <span className="text-xs text-[#8B949E] font-mono">Facility Unit: Milling Bay B</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#E6EDF3]">
              Autonomous Industrial Maintenance Fleet
            </h1>
            <p className="text-xs sm:text-sm text-[#8B949E] leading-relaxed">
              MaintAI monitors real-time telemetry, autonomously investigates equipment malfunctions across 9 reasoning stages, diagnoses mechanical root causes, and recommends verified corrective maintenance.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              id="dashboard-launch-demo-btn"
              onClick={onQuickInvestigateDemo}
              className="px-4 py-2.5 bg-[#F27D26] hover:bg-[#ff8a36] text-[#0F1115] font-bold text-xs sm:text-sm rounded-lg shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Investigate Demo Incident (CNC #04)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Total Machines */}
        <div className="bg-[#161B22] p-4 rounded-xl border border-[#2D333B] shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-[#8B949E]">Total Machines</div>
            <div className="text-2xl font-bold text-[#E6EDF3] font-mono mt-1">{total}</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#1C2128] border border-[#2D333B] flex items-center justify-center text-[#8B949E]">
            <Server className="w-5 h-5" />
          </div>
        </div>

        {/* Healthy */}
        <div className="bg-[#161B22] p-4 rounded-xl border border-[#2D333B] shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-[#8B949E]">Healthy</div>
            <div className="text-2xl font-bold text-[#3FB950] font-mono mt-1">{healthy}</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#12231A] border border-[#1B4B27] flex items-center justify-center text-[#3FB950]">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>

        {/* Warning */}
        <div className="bg-[#161B22] p-4 rounded-xl border border-[#2D333B] shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-[#8B949E]">Warning</div>
            <div className="text-2xl font-bold text-[#D29922] font-mono mt-1">{warning}</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#201C15] border border-[#3C321C] flex items-center justify-center text-[#D29922]">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        {/* Critical */}
        <div className="bg-[#161B22] p-4 rounded-xl border border-[#2D333B] shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-[#8B949E]">Critical</div>
            <div className={`text-2xl font-bold font-mono mt-1 ${critical > 0 ? 'text-[#F85149] animate-pulse' : 'text-[#6E7681]'}`}>
              {critical}
            </div>
          </div>
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${critical > 0 ? 'bg-[#2A1215] border-[#5A1E24] text-[#F85149]' : 'bg-[#1C2128] border-[#2D333B] text-[#6E7681]'}`}>
            <AlertOctagon className="w-5 h-5" />
          </div>
        </div>

        {/* Active Incidents */}
        <div className="bg-[#161B22] p-4 rounded-xl border border-[#2D333B] shadow-sm flex items-center justify-between col-span-2 sm:col-span-1">
          <div>
            <div className="text-xs font-medium text-[#8B949E]">Active Incidents</div>
            <div className={`text-2xl font-bold font-mono mt-1 ${activeIncidents > 0 ? 'text-[#F27D26]' : 'text-[#6E7681]'}`}>
              {activeIncidents}
            </div>
          </div>
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${activeIncidents > 0 ? 'bg-[#241A14] border-[#542F1C] text-[#F27D26]' : 'bg-[#1C2128] border-[#2D333B] text-[#6E7681]'}`}>
            <Flame className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Critical Alert Spotlight Banner if CNC #04 is Critical */}
      {!isResolved && (
        <div className="bg-[#211618] border border-[#F85149]/40 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#2D1619] border border-[#F85149]/50 text-[#F85149] flex items-center justify-center shrink-0">
              <AlertOctagon className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#FF7B72]">Incident Alert: CNC Machine #04 Emergency Stop</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#3D1418] text-[#FF7B72] border border-[#F85149]/40 uppercase">
                  Telemetry Anomaly
                </span>
              </div>
              <p className="text-xs text-[#E6EDF3]/80 mt-0.5">
                Spindle vibration reached 8.4 mm/s (critical &gt; 7.0) with thermal escalation to 82°C. Auto-shutdown tripped.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              id="critical-alert-report-btn"
              onClick={() => onOpenReportIncident('CNC-04')}
              className="px-3 py-1.5 bg-[#F85149] hover:bg-[#ff6860] text-black text-xs font-bold rounded-md transition-colors cursor-pointer"
            >
              Report Incident
            </button>
            <button
              id="critical-alert-inspect-btn"
              onClick={() => {
                const cnc4 = machines.find(m => m.id === 'CNC-04');
                if (cnc4) onSelectMachine(cnc4);
              }}
              className="px-3 py-1.5 bg-[#1C2128] hover:bg-[#252C36] text-[#E6EDF3] border border-[#2D333B] text-xs font-medium rounded-md transition-colors cursor-pointer"
            >
              Inspect Sensors
            </button>
          </div>
        </div>
      )}

      {/* Fleet Overview Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-[#E6EDF3]">Equipment Fleet Status</h2>
            <p className="text-xs text-[#8B949E]">Click any equipment card to view live sensor telemetry, history, and status.</p>
          </div>
          <button
            id="manual-report-incident-top-btn"
            onClick={() => onOpenReportIncident()}
            className="text-xs font-medium text-[#58A6FF] hover:text-[#79B8FF] flex items-center gap-1 hover:underline cursor-pointer"
          >
            + File Custom Incident Report
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {machines.map((machine) => {
            const isCritical = machine.status === 'critical';
            const isWarning = machine.status === 'warning';

            return (
              <div
                key={machine.id}
                id={`machine-card-${machine.id}`}
                onClick={() => onSelectMachine(machine)}
                className={`rounded-xl border p-5 transition-all duration-200 hover:shadow-lg cursor-pointer relative group flex flex-col justify-between ${
                  isCritical
                    ? 'bg-[#211618] border-[#F85149]/50 ring-1 ring-[#F85149]/30 hover:border-[#F85149]'
                    : isWarning
                    ? 'bg-[#201C15] border-[#D29922]/50 ring-1 ring-[#D29922]/30 hover:border-[#D29922]'
                    : 'bg-[#161B22] border-[#2D333B] hover:border-[#444C56] hover:bg-[#181E27]'
                }`}
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="text-xs font-mono font-medium text-[#8B949E]">{machine.id}</div>
                      <h3 className="font-bold text-[#E6EDF3] text-base group-hover:text-[#58A6FF] transition-colors">
                        {machine.name}
                      </h3>
                      <p className="text-xs text-[#8B949E]">{machine.type}</p>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1 ${
                        machine.status === 'healthy'
                          ? 'bg-[#12231A] text-[#3FB950] border border-[#1B4B27]'
                          : machine.status === 'warning'
                          ? 'bg-[#201C15] text-[#D29922] border border-[#3C321C]'
                          : 'bg-[#2A1215] text-[#F85149] border border-[#5A1E24] font-bold'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          machine.status === 'healthy'
                            ? 'bg-[#3FB950]'
                            : machine.status === 'warning'
                            ? 'bg-[#D29922]'
                            : 'bg-[#F85149] animate-ping'
                        }`}
                      />
                      {machine.status}
                    </span>
                  </div>

                  {/* Sensor Mini-Gauges */}
                  <div className="grid grid-cols-3 gap-2 py-3 border-y border-[#2D333B] my-3">
                    <div className="text-center p-1.5 bg-[#0F1115] border border-[#2D333B] rounded">
                      <div className="flex items-center justify-center text-[10px] text-[#8B949E] gap-0.5">
                        <Thermometer className="w-3 h-3" />
                        <span>Temp</span>
                      </div>
                      <div className={`font-mono text-xs font-bold mt-0.5 ${machine.temperature > 75 ? 'text-[#F85149]' : machine.temperature > 65 ? 'text-[#D29922]' : 'text-[#E6EDF3]'}`}>
                        {machine.temperature}°C
                      </div>
                    </div>

                    <div className="text-center p-1.5 bg-[#0F1115] border border-[#2D333B] rounded">
                      <div className="flex items-center justify-center text-[10px] text-[#8B949E] gap-0.5">
                        <Activity className="w-3 h-3" />
                        <span>Vibration</span>
                      </div>
                      <div className={`font-mono text-xs font-bold mt-0.5 ${machine.vibration > 7.0 ? 'text-[#F85149]' : machine.vibration > 4.5 ? 'text-[#D29922]' : 'text-[#E6EDF3]'}`}>
                        {machine.vibration} mm/s
                      </div>
                    </div>

                    <div className="text-center p-1.5 bg-[#0F1115] border border-[#2D333B] rounded">
                      <div className="flex items-center justify-center text-[10px] text-[#8B949E] gap-0.5">
                        <Gauge className="w-3 h-3" />
                        <span>Pressure</span>
                      </div>
                      <div className="font-mono text-xs font-bold text-[#E6EDF3] mt-0.5">
                        {machine.pressure} bar
                      </div>
                    </div>
                  </div>

                  {/* Machine Meta */}
                  <div className="text-[11px] text-[#8B949E] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#8B949E]" />
                        <span>Operating Hours:</span>
                      </span>
                      <span className="font-mono font-medium text-[#C9D1D9]">{machine.operatingHours} hrs</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Last Overhaul:</span>
                      <span className="text-[#C9D1D9] font-medium">{machine.lastMaintenance}</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer Action */}
                <div className="mt-4 pt-3 border-t border-[#2D333B] flex items-center justify-between text-xs">
                  <span className="text-[#8B949E] group-hover:text-[#58A6FF] font-medium transition-colors">
                    Click to inspect sensors
                  </span>
                  <div className="flex items-center gap-1.5">
                    {machine.id === 'CNC-04' && (
                      <button
                        id={`card-quick-report-btn-${machine.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenReportIncident(machine.id);
                        }}
                        className="px-2 py-1 bg-[#F27D26]/15 hover:bg-[#F27D26]/25 text-[#F27D26] border border-[#F27D26]/30 rounded font-semibold text-[11px] transition-colors cursor-pointer"
                      >
                        Report Incident
                      </button>
                    )}
                    <span className="w-6 h-6 rounded-full bg-[#1C2128] border border-[#2D333B] group-hover:border-[#58A6FF]/40 flex items-center justify-center text-[#8B949E] group-hover:text-[#58A6FF] transition-colors">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

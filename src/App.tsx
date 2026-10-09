
import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { ReportIncidentView } from './components/ReportIncidentView';
import { InvestigationTimelineView } from './components/InvestigationTimelineView';
import { DiagnosisReportView } from './components/DiagnosisReportView';
import { MachineSensorModal } from './components/MachineSensorModal';
import { IncidentReportModal } from './components/IncidentReportModal';
import { INITIAL_MACHINES, DEMO_INCIDENT } from './data/mockMachines';
import { Machine, IncidentReport, FullDiagnosisResult, VerificationResult } from './types';
import { executeFullDiagnosis } from './agent/coordinator';
import { verifyResolution } from './agent/resolutionVerifier';

export default function App() {
  const [machines, setMachines] = useState<Machine[]>(INITIAL_MACHINES);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'report' | 'investigation' | 'diagnosis'>('dashboard');
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);
  const [incident, setIncident] = useState<IncidentReport>(DEMO_INCIDENT);

  // Investigation & Diagnosis State
  const [investigationRunning, setInvestigationRunning] = useState<boolean>(false);
  const [diagnosisResult, setDiagnosisResult] = useState<FullDiagnosisResult | null>(null);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [isSimulatingMaintenance, setIsSimulatingMaintenance] = useState<boolean>(false);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);

  // Backend status
  const [hasGeminiKey, setHasGeminiKey] = useState<boolean>(false);

  // Check health on start
  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        if (data.hasGeminiApiKey) {
          setHasGeminiKey(true);
        }
      })
      .catch(() => {
        // Local mode fallback
      });
  }, []);

  // Handler: Quick Launch from Dashboard
  const handleQuickInvestigateDemo = () => {
    setIncident(DEMO_INCIDENT);
    setActiveTab('report');
  };

  // Handler: Open Report Incident for specific machine
  const handleOpenReportIncident = (machineId?: string) => {
    if (machineId) {
      const target = machines.find((m) => m.id === machineId);
      if (target) {
        setIncident({
          ...DEMO_INCIDENT,
          equipmentId: target.id,
          equipmentType: target.type,
          temperature: target.temperature,
          vibration: target.vibration,
          pressure: target.pressure,
          operatingHours: target.operatingHours,
          maintenanceHistorySummary: target.maintenanceHistory.join('. ') + '. ' + target.previousIncidents.join('. '),
        });
      }
    }
    setActiveTab('report');
  };

  // Handler: Start Autonomous Investigation
  const handleStartInvestigation = async () => {
    setActiveTab('investigation');
    setInvestigationRunning(true);
    setVerificationResult(null);

    // Call backend API or local coordinator
    try {
      const res = await fetch('/api/investigate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          incident,
          useGemini: hasGeminiKey,
        }),
      });

      if (res.ok) {
        const data: FullDiagnosisResult = await res.json();
        setDiagnosisResult(data);
      } else {
        // Fallback to local deterministic agent
        const localData = executeFullDiagnosis(incident);
        setDiagnosisResult(localData);
      }
    } catch {
      // Offline fallback
      const localData = executeFullDiagnosis(incident);
      setDiagnosisResult(localData);
    }
  };

  // Handler: Completed 9-step animated timeline
  const handleInvestigationTimelineComplete = () => {
    setInvestigationRunning(false);
  };

  // Handler: Re-run investigation
  const handleRestartInvestigation = () => {
    handleStartInvestigation();
  };

  // Handler: Simulate Maintenance
  const handleSimulateMaintenance = async () => {
    setIsSimulatingMaintenance(true);

    const before = {
      temperature: incident.temperature, // 82
      vibration: incident.vibration,     // 8.4
      pressure: incident.pressure,       // 5.2
    };

    const after = {
      temperature: 61,
      vibration: 3.1,
      pressure: 5.1,
    };

    setTimeout(async () => {
      try {
        const res = await fetch('/api/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ before, after }),
        });

        let verification: VerificationResult;
        if (res.ok) {
          verification = await res.json();
        } else {
          verification = verifyResolution(before, after);
        }

        setVerificationResult(verification);
        setIsSimulatingMaintenance(false);

        // Update fleet state: CNC Machine #04 is now Healthy
        setMachines((prev) =>
          prev.map((m) =>
            m.id === 'CNC-04'
              ? {
                  ...m,
                  status: 'healthy',
                  temperature: 61,
                  vibration: 3.1,
                  lastMaintenance: 'Just now (Bearing replaced & verified)',
                  maintenanceHistory: [
                    'Bearing replaced: SKF 7014-C set installed & re-lubricated (Just now)',
                    ...m.maintenanceHistory,
                  ],
                }
              : m
          )
        );
      } catch {
        const verification = verifyResolution(before, after);
        setVerificationResult(verification);
        setIsSimulatingMaintenance(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#0F1115] text-[#E6EDF3] flex flex-col font-sans selection:bg-[#F27D26] selection:text-black">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        investigationRunning={investigationRunning}
        hasDiagnosis={!!diagnosisResult}
        isResolved={!!verificationResult && verificationResult.status === 'RESOLVED'}
        hasGeminiKey={hasGeminiKey}
      />

      {/* Main Workspace Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tab 1: Dashboard */}
        {activeTab === 'dashboard' && (
          <DashboardView
            machines={machines}
            onSelectMachine={(m) => setSelectedMachine(m)}
            onQuickInvestigateDemo={handleQuickInvestigateDemo}
            onOpenReportIncident={handleOpenReportIncident}
            isResolved={!!verificationResult && verificationResult.status === 'RESOLVED'}
          />
        )}

        {/* Tab 2: Report Incident */}
        {activeTab === 'report' && (
          <ReportIncidentView
            incident={incident}
            onUpdateIncident={(newInc) => setIncident(newInc)}
            onStartInvestigation={handleStartInvestigation}
          />
        )}

        {/* Tab 3: Investigation Timeline */}
        {activeTab === 'investigation' && (
          <InvestigationTimelineView
            incident={incident}
            isRunning={investigationRunning}
            onCompleteInvestigation={handleInvestigationTimelineComplete}
            onViewDiagnosis={() => setActiveTab('diagnosis')}
            diagnosisResult={diagnosisResult}
            onRestart={handleRestartInvestigation}
          />
        )}

        {/* Tab 4: Diagnosis Report */}
        {activeTab === 'diagnosis' && diagnosisResult && (
          <DiagnosisReportView
            diagnosis={diagnosisResult}
            onSimulateMaintenance={handleSimulateMaintenance}
            verificationResult={verificationResult}
            isSimulating={isSimulatingMaintenance}
            onOpenReportModal={() => setShowReportModal(true)}
          />
        )}

        {activeTab === 'diagnosis' && !diagnosisResult && (
          <div className="bg-[#161B22] rounded-xl border border-[#2D333B] p-12 text-center max-w-lg mx-auto shadow-lg space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#F27D26]/10 text-[#F27D26] border border-[#F27D26]/30 flex items-center justify-center mx-auto font-bold text-lg">
              !
            </div>
            <h3 className="font-bold text-[#E6EDF3] text-lg">No Active Diagnosis Yet</h3>
            <p className="text-xs text-[#8B949E]">
              Please report an incident and run the autonomous investigation first to generate diagnostic hypotheses and maintenance SOP.
            </p>
            <button
              onClick={() => setActiveTab('report')}
              className="px-4 py-2 bg-[#F27D26] hover:bg-[#ff8a36] text-[#0F1115] rounded-lg text-xs font-bold transition-colors cursor-pointer"
            >
              Go to Report Incident
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#161B22] border-t border-[#2D333B] text-[#8B949E] text-xs py-4 px-4 sm:px-6 lg:px-8 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#E6EDF3]">MaintAI</span>
            <span>&bull;</span>
            <span>Autonomous Maintenance Diagnosis Agent (College Agentic AI Project MVP)</span>
          </div>
          <div className="text-[11px] text-[#8B949E]">
            Simulated Equipment Telemetry &bull; No Real Machine Control Actuation
          </div>
        </div>
      </footer>

      {/* Modals */}
      {selectedMachine && (
        <MachineSensorModal
          machine={selectedMachine}
          onClose={() => setSelectedMachine(null)}
          onReportIncident={(m) => handleOpenReportIncident(m.id)}
        />
      )}

      {showReportModal && diagnosisResult && (
        <IncidentReportModal
          diagnosis={diagnosisResult}
          verificationResult={verificationResult}
          onClose={() => setShowReportModal(false)}
        />
      )}
    </div>
  );
}

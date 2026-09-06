import React, { useEffect, useState, useRef } from 'react';
import { 
  CheckCircle2, 
  Loader2, 
  Clock, 
  Terminal, 
  ArrowRight, 
  Sparkles, 
  Zap, 
  Play, 
  FastForward, 
  RefreshCw,
  Cpu,
  Layers,
  Database,
  Search,
  Sliders,
  Check,
  Wrench,
  AlertCircle
} from 'lucide-react';
import { InvestigationStep, IncidentReport, FullDiagnosisResult } from '../types';
import { INITIAL_INVESTIGATION_STEPS, getStepDetails } from '../agent/coordinator';

interface InvestigationTimelineViewProps {
  incident: IncidentReport;
  isRunning: boolean;
  onCompleteInvestigation: () => void;
  onViewDiagnosis: () => void;
  diagnosisResult: FullDiagnosisResult | null;
  onRestart: () => void;
}

const STEP_ICONS = [
  AlertCircle,   // 1. Analyze incident
  Layers,        // 2. Identify required evidence
  Database,      // 3. Retrieve sensor info
  Clock,         // 4. Analyze maintenance history
  Search,        // 5. Search previous similar incidents
  Cpu,           // 6. Generate possible root causes
  Sliders,       // 7. Evaluate each hypothesis
  Check,         // 8. Select most probable cause
  Wrench,        // 9. Generate maintenance recommendation
];

export const InvestigationTimelineView: React.FC<InvestigationTimelineViewProps> = ({
  incident,
  isRunning,
  onCompleteInvestigation,
  onViewDiagnosis,
  diagnosisResult,
  onRestart,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(diagnosisResult ? 9 : 0);
  const [speedMs, setSpeedMs] = useState<number>(1100);
  const [activeLogs, setActiveLogs] = useState<string[]>([]);
  const [stepDetailsMap, setStepDetailsMap] = useState<Record<number, { log: string; details: string[] }>>({});
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize and run steps
  useEffect(() => {
    if (!isRunning) {
      if (diagnosisResult) {
        setCurrentStep(9);
      }
      return;
    }

    setCurrentStep(1);
    setActiveLogs([`[INIT] MaintAI Autonomous Agent spawned for ${incident.equipmentId}.`]);

    let step = 1;

    const runNextStep = () => {
      if (step > 9) {
        onCompleteInvestigation();
        return;
      }

      setCurrentStep(step);
      const { log, details } = getStepDetails(step, incident);
      
      setStepDetailsMap(prev => ({
        ...prev,
        [step]: { log, details }
      }));

      setActiveLogs(prev => [
        `[STEP ${step}/9] ${log}`,
        ...prev.slice(0, 15),
      ]);

      step++;
      timerRef.current = setTimeout(runNextStep, speedMs);
    };

    timerRef.current = setTimeout(runNextStep, 500);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isRunning, incident]);

  const handleSkipToFinish = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    for (let s = 1; s <= 9; s++) {
      const { log, details } = getStepDetails(s, incident);
      setStepDetailsMap(prev => ({
        ...prev,
        [s]: { log, details }
      }));
    }
    setCurrentStep(9);
    onCompleteInvestigation();
  };

  const progressPercent = Math.min(100, Math.round((currentStep / 9) * 100));
  const isFinished = currentStep >= 9 && !isRunning;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header & Speed Controls */}
      <div className="bg-[#161B22] text-[#E6EDF3] rounded-xl p-6 border border-[#2D333B] shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F27D26] animate-pulse" />
            <span className="text-xs uppercase tracking-widest font-mono text-[#F27D26] font-bold">
              Autonomous Agent Lifecycle
            </span>
            <span className="text-xs text-[#8B949E]">| Target: {incident.equipmentId}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#E6EDF3]">
            Multi-Stage Autonomous Investigation
          </h2>
          <p className="text-xs text-[#8B949E]">
            Visible 9-step evidence correlation and root cause selection workflow.
          </p>
        </div>

        {/* Speed Controller & Fast-forward */}
        <div className="flex items-center gap-2 shrink-0 bg-[#0F1115] p-1.5 rounded-lg border border-[#2D333B]">
          <span className="text-[11px] text-[#8B949E] font-mono px-2">Speed:</span>
          <button
            onClick={() => setSpeedMs(1200)}
            className={`px-2.5 py-1 text-xs rounded font-medium transition-colors cursor-pointer ${
              speedMs === 1200 ? 'bg-[#F27D26] text-[#0F1115] font-bold' : 'text-[#8B949E] hover:text-[#E6EDF3]'
            }`}
          >
            Normal (1.2s)
          </button>
          <button
            onClick={() => setSpeedMs(400)}
            className={`px-2.5 py-1 text-xs rounded font-medium transition-colors cursor-pointer ${
              speedMs === 400 ? 'bg-[#F27D26] text-[#0F1115] font-bold' : 'text-[#8B949E] hover:text-[#E6EDF3]'
            }`}
          >
            Fast (0.4s)
          </button>
          {!isFinished && (
            <button
              id="skip-investigation-btn"
              onClick={handleSkipToFinish}
              className="px-2.5 py-1 text-xs rounded bg-[#F27D26]/15 text-[#F27D26] hover:bg-[#F27D26]/25 border border-[#F27D26]/30 font-medium transition-colors flex items-center gap-1 cursor-pointer"
            >
              <FastForward className="w-3 h-3" /> Skip to End
            </button>
          )}
          {isFinished && (
            <button
              onClick={onRestart}
              className="px-2.5 py-1 text-xs rounded bg-[#1C2128] text-[#E6EDF3] hover:bg-[#252C36] border border-[#2D333B] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" /> Re-run
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar & Status Pill */}
      <div className="bg-[#161B22] rounded-xl border border-[#2D333B] p-4 shadow-sm">
        <div className="flex items-center justify-between text-xs font-semibold text-[#8B949E] mb-2">
          <div className="flex items-center gap-2">
            <span>Investigation Progress:</span>
            <span className="font-mono text-[#F27D26] font-bold">
              {currentStep > 9 ? 9 : currentStep} / 9 Stages Completed
            </span>
          </div>
          <span className="font-mono text-[#8B949E]">{progressPercent}%</span>
        </div>
        <div className="w-full h-2.5 bg-[#0F1115] rounded-full overflow-hidden border border-[#2D333B]">
          <div
            className="h-full bg-gradient-to-r from-[#F27D26] via-[#D29922] to-[#3FB950] transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Real-time Agent Reasoning Terminal */}
      <div className="bg-[#0F1115] rounded-xl border border-[#2D333B] p-4 text-[#E6EDF3] font-mono text-xs shadow-inner">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#2D333B] text-[#8B949E]">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#F27D26]" />
            <span className="font-bold text-[#E6EDF3] text-[11px]">AGENT REASONING COGNITIVE STREAM</span>
          </div>
          <span className="text-[10px] text-[#3FB950] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3FB950] animate-ping" />
            Active Reasoning Engine
          </span>
        </div>
        <div className="h-28 overflow-y-auto space-y-1 pr-2 scrollbar-thin">
          {activeLogs.length === 0 ? (
            <div className="text-[#6E7681] italic">Starting agent thread...</div>
          ) : (
            activeLogs.map((log, idx) => (
              <div key={idx} className={`leading-relaxed ${idx === 0 ? 'text-[#F27D26] font-semibold' : 'text-[#8B949E]'}`}>
                <span className="text-[#6E7681] mr-2">&gt;</span>
                {log}
              </div>
            ))
          )}
        </div>
      </div>

      {/* 9-Step Vertical Timeline */}
      <div className="space-y-3">
        {INITIAL_INVESTIGATION_STEPS.map((step, idx) => {
          const isCompleted = currentStep > step.stepNumber || (currentStep === 9 && isFinished);
          const isActive = currentStep === step.stepNumber && !isFinished;
          const isPending = currentStep < step.stepNumber;
          const Icon = STEP_ICONS[idx] || CheckCircle2;
          const dynamicData = stepDetailsMap[step.stepNumber];

          return (
            <div
              key={step.stepNumber}
              id={`investigation-step-${step.stepNumber}`}
              className={`rounded-xl border p-4 transition-all duration-200 ${
                isActive
                  ? 'bg-[#1C2128] border-[#F27D26] ring-1 ring-[#F27D26]/40 shadow-lg'
                  : isCompleted
                  ? 'bg-[#161B22] border-[#2D333B] shadow-sm'
                  : 'bg-[#161B22]/50 border-[#2D333B]/60 opacity-50'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Step Marker Badge */}
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 font-bold text-xs transition-colors ${
                    isActive
                      ? 'bg-[#F27D26] text-[#0F1115] shadow-md animate-pulse font-bold'
                      : isCompleted
                      ? 'bg-[#12231A] text-[#3FB950] border border-[#1B4B27]'
                      : 'bg-[#0F1115] text-[#6E7681] border border-[#2D333B]'
                  }`}
                >
                  {isActive ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : isCompleted ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>

                {/* Step Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono font-bold text-[#8B949E]">
                        STEP {step.stepNumber}
                      </span>
                      <h3
                        className={`text-sm font-bold ${
                          isActive
                            ? 'text-[#F27D26]'
                            : isCompleted
                            ? 'text-[#E6EDF3]'
                            : 'text-[#8B949E]'
                        }`}
                      >
                        {step.title}
                      </h3>
                    </div>

                    <span
                      className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded self-start sm:self-auto ${
                        isActive
                          ? 'bg-[#F27D26]/20 text-[#F27D26] border border-[#F27D26]/40 animate-pulse'
                          : isCompleted
                          ? 'bg-[#12231A] text-[#3FB950] border border-[#1B4B27]'
                          : 'bg-[#0F1115] text-[#6E7681] border border-[#2D333B]'
                      }`}
                    >
                      {isActive ? 'Investigating...' : isCompleted ? 'Verified' : 'Pending'}
                    </span>
                  </div>

                  <p className="text-xs text-[#8B949E] mb-2">{step.description}</p>

                  {/* Progressive Evidence & Reasoning Cards */}
                  {(isActive || isCompleted) && dynamicData && (
                    <div className="mt-2.5 p-3 rounded-lg bg-[#0F1115] text-[#E6EDF3] text-xs font-mono border border-[#2D333B] space-y-1.5">
                      <div className="text-[#F27D26] font-semibold flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#F27D26]" />
                        <span>Agent Finding:</span>
                      </div>
                      <div className="text-[#C9D1D9] text-xs leading-relaxed">{dynamicData.log}</div>
                      {dynamicData.details && dynamicData.details.length > 0 && (
                        <div className="pt-2 border-t border-[#2D333B] grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                          {dynamicData.details.map((detail, dIdx) => (
                            <div key={dIdx} className="text-[11px] text-[#8B949E] flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#F27D26] shrink-0" />
                              <span>{detail}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA once completed */}
      {isFinished && (
        <div className="bg-[#161B22] border border-[#3FB950]/50 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#3FB950] font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-[#3FB950]" />
              <span>Investigation Complete: Root Cause Determined</span>
            </div>
            <p className="text-xs text-[#8B949E]">
              The agent has evaluated competing failure modes and selected "Bearing degradation" (87% confidence) with full maintenance SOP.
            </p>
          </div>

          <button
            id="proceed-to-diagnosis-btn"
            onClick={onViewDiagnosis}
            className="w-full sm:w-auto px-6 py-3 bg-[#3FB950] hover:bg-[#46c658] text-[#0F1115] font-bold text-sm rounded-lg shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>View Diagnosis Report & Action Plan</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertOctagon, 
  Wrench, 
  ShieldAlert, 
  FileText, 
  ArrowDownRight, 
  Sparkles, 
  Cpu, 
  Check, 
  RefreshCw, 
  Thermometer, 
  Activity, 
  Gauge, 
  HelpCircle,
  Clock,
  Printer,
  FileCheck
} from 'lucide-react';
import { FullDiagnosisResult, VerificationResult } from '../types';
import { HypothesisCards } from './HypothesisCards';

interface DiagnosisReportViewProps {
  diagnosis: FullDiagnosisResult;
  onSimulateMaintenance: () => void;
  verificationResult: VerificationResult | null;
  isSimulating: boolean;
  onOpenReportModal: () => void;
}

export const DiagnosisReportView: React.FC<DiagnosisReportViewProps> = ({
  diagnosis,
  onSimulateMaintenance,
  verificationResult,
  isSimulating,
  onOpenReportModal,
}) => {
  const { rootCause, maintenancePlan, hypotheses, incident } = diagnosis;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* 5. LARGE ROOT CAUSE RESULT CARD */}
      <div
        id="root-cause-result-card"
        className="bg-[#161B22] text-[#E6EDF3] rounded-2xl p-6 sm:p-8 border border-[#2D333B] shadow-xl relative overflow-hidden"
      >
        <div className="absolute right-0 top-0 w-80 h-80 bg-[#F27D26]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          {/* Top meta */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#2D333B] pb-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#1C2128] text-[#58A6FF] border border-[#58A6FF]/30 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5" /> Autonomous Diagnosis Finalized
              </span>
              <span className="text-xs text-[#8B949E] font-mono">
                Target: {incident.equipmentId} ({incident.equipmentType})
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="view-formal-report-btn"
                onClick={onOpenReportModal}
                className="px-3 py-1.5 bg-[#1C2128] hover:bg-[#252C36] text-[#E6EDF3] text-xs font-medium rounded-lg border border-[#2D333B] transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-[#F27D26]" />
                <span>Formal Incident Dossier</span>
              </button>
            </div>
          </div>

          {/* Large Root Cause & Confidence Display */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2 space-y-2">
              <div className="text-xs uppercase tracking-widest text-[#F27D26] font-bold font-mono">
                MOST PROBABLE ROOT CAUSE
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#E6EDF3]">
                {rootCause.probableCause}
              </h1>
              <p className="text-xs sm:text-sm text-[#8B949E] leading-relaxed max-w-xl">
                Multi-sensor spectral triangulation combined with service lifecycle exceedance identifies bearing raceway fatigue spalling as the primary initiating fault.
              </p>
            </div>

            {/* Confidence Gauge */}
            <div className="bg-[#0F1115] border border-[#2D333B] rounded-xl p-5 text-center flex flex-col items-center justify-center">
              <div className="text-xs uppercase font-bold text-[#8B949E] font-mono mb-1">
                Diagnostic Confidence
              </div>
              <div className="text-4xl sm:text-5xl font-black text-[#F27D26] font-mono tracking-tight">
                {rootCause.confidence}%
              </div>
              <div className="w-full bg-[#1C2128] h-2 rounded-full overflow-hidden mt-3">
                <div
                  className="bg-gradient-to-r from-[#F27D26] to-[#3FB950] h-full rounded-full"
                  style={{ width: `${rootCause.confidence}%` }}
                />
              </div>
              <div className="text-[11px] text-[#6E7681] mt-2">
                Evaluated against 4 competing failure models
              </div>
            </div>
          </div>

          {/* WHY? Explanation Section */}
          <div className="bg-[#0F1115] border border-[#2D333B] rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-[#F27D26] font-bold text-sm">
              <HelpCircle className="w-4 h-4 text-[#F27D26]" />
              <span>WHY DID THE AGENT REACH THIS CONCLUSION?</span>
            </div>
            <div className="text-xs sm:text-sm text-[#C9D1D9] whitespace-pre-line leading-relaxed font-sans">
              {rootCause.whyExplanation}
            </div>
          </div>

          {/* Alternative Causes */}
          <div>
            <div className="text-xs font-semibold text-[#8B949E] uppercase tracking-wider mb-2">
              Alternative Causes Evaluated:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {rootCause.alternativeCauses.map((alt, idx) => (
                <div
                  key={idx}
                  className="bg-[#0F1115] border border-[#2D333B] rounded-lg p-3 flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs font-bold text-[#E6EDF3]">{alt.cause}</span>
                    <p className="text-[11px] text-[#8B949E] mt-0.5">{alt.reason}</p>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <span className="font-mono text-sm font-bold text-[#8B949E]">{alt.probability}%</span>
                    <div className="text-[9px] text-[#6E7681] uppercase">Posterior</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. HYPOTHESIS GENERATION COMPARISON CARDS */}
      <HypothesisCards hypotheses={hypotheses} />

      {/* 6. RECOMMENDED MAINTENANCE ACTION PLAN */}
      <div className="bg-[#161B22] rounded-xl border border-[#2D333B] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-[#2D333B] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#0F1115] border border-[#2D333B] text-[#F27D26] flex items-center justify-center">
              <Wrench className="w-5 h-5 text-[#F27D26]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#E6EDF3]">
                Recommended Maintenance Action Plan
              </h2>
              <p className="text-xs text-[#8B949E]">
                Standard Operating Procedure (SOP) generated by MaintAI
              </p>
            </div>
          </div>

          <span className="text-xs font-mono font-medium px-2.5 py-1 bg-[#201C15] text-[#D29922] border border-[#3C321C] rounded-md">
            Priority: High / Mandatory
          </span>
        </div>

        {/* Safety Warning */}
        <div className="bg-[#211618] border-l-4 border-[#F85149] p-4 rounded-r-lg">
          <div className="flex items-start gap-2.5">
            <ShieldAlert className="w-5 h-5 text-[#F85149] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-[#FF7B72] uppercase tracking-wider">
                Safety Protocol & Hazard Warning
              </h4>
              <p className="text-xs text-[#FF7B72]/90 mt-1 leading-relaxed">
                {maintenancePlan.safetyWarning}
              </p>
            </div>
          </div>
        </div>

        {/* SOP Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Immediate Action */}
          <div className="p-4 rounded-lg bg-[#0F1115] border border-[#2D333B] space-y-1">
            <div className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-[#F27D26]">
              <AlertOctagon className="w-4 h-4 text-[#F27D26]" />
              <span>Immediate Action</span>
            </div>
            <p className="text-xs text-[#C9D1D9] leading-relaxed">
              {maintenancePlan.immediateAction}
            </p>
          </div>

          {/* Inspection Required */}
          <div className="p-4 rounded-lg bg-[#0F1115] border border-[#2D333B] space-y-1">
            <div className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-[#F27D26]">
              <FileText className="w-4 h-4 text-[#F27D26]" />
              <span>Inspection Required</span>
            </div>
            <p className="text-xs text-[#C9D1D9] leading-relaxed">
              {maintenancePlan.inspectionRequired}
            </p>
          </div>

          {/* Recommended Maintenance */}
          <div className="p-4 rounded-lg bg-[#0F1115] border border-[#2D333B] space-y-1 md:col-span-2">
            <div className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-[#F27D26]">
              <Wrench className="w-4 h-4 text-[#F27D26]" />
              <span>Recommended Maintenance</span>
            </div>
            <p className="text-xs text-[#C9D1D9] leading-relaxed">
              {maintenancePlan.recommendedMaintenance}
            </p>
          </div>

          {/* Required Tools / Parts */}
          <div className="p-4 rounded-lg bg-[#0F1115] border border-[#2D333B] space-y-2 md:col-span-2">
            <div className="text-xs font-bold uppercase tracking-wider text-[#F27D26]">
              Required Tools & Replacement Parts
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {maintenancePlan.requiredToolsParts.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-[#C9D1D9] bg-[#161B22] p-2 rounded border border-[#2D333B]">
                  <Check className="w-3.5 h-3.5 text-[#3FB950] shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Verification Procedure */}
          <div className="p-4 rounded-lg bg-[#0F1115] border border-[#2D333B] space-y-1 md:col-span-2">
            <div className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-[#F27D26]">
              <CheckCircle2 className="w-4 h-4 text-[#F27D26]" />
              <span>Verification Procedure</span>
            </div>
            <p className="text-xs text-[#C9D1D9] leading-relaxed">
              {maintenancePlan.verificationProcedure}
            </p>
          </div>
        </div>

        {/* Educational Disclaimer */}
        <div className="p-3 bg-[#201C15] rounded-lg border border-[#3C321C] text-[#D29922] text-xs flex items-center gap-2">
          <span className="font-bold shrink-0">ACADEMIC NOTICE:</span>
          <span className="text-[11px] leading-relaxed">
            {maintenancePlan.educationalDisclaimer}
          </span>
        </div>
      </div>

      {/* 7. SIMULATED RESOLUTION & 8. VERIFICATION */}
      <div
        id="simulated-maintenance-section"
        className="bg-[#161B22] rounded-xl border border-[#2D333B] p-6 sm:p-8 shadow-sm space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2D333B] pb-4">
          <div>
            <div className="text-xs font-bold text-[#58A6FF] uppercase tracking-wider mb-1">
              Interactive Hardware Loop Simulation
            </div>
            <h3 className="text-lg font-bold text-[#E6EDF3]">
              Maintenance Execution & Verification
            </h3>
            <p className="text-xs text-[#8B949E]">
              Simulate bearing replacement on CNC Machine #04 to observe sensor telemetry stabilization.
            </p>
          </div>

          {!verificationResult ? (
            <button
              id="simulate-maintenance-btn"
              onClick={onSimulateMaintenance}
              disabled={isSimulating}
              className="px-6 py-3 bg-[#F27D26] hover:bg-[#ff8a36] text-[#0F1115] font-bold text-xs sm:text-sm rounded-lg shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Wrench className={`w-4 h-4 ${isSimulating ? 'animate-spin' : ''}`} />
              <span>{isSimulating ? 'Executing Maintenance...' : 'SIMULATE MAINTENANCE'}</span>
            </button>
          ) : (
            <div className="px-4 py-2 bg-[#12231A] text-[#3FB950] rounded-lg border border-[#1B4B27] font-bold text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#3FB950]" />
              <span>Maintenance simulation completed.</span>
            </div>
          )}
        </div>

        {/* Telemetry Before vs After Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Before Maintenance */}
          <div className="p-5 rounded-xl border border-[#5A1E24] bg-[#211618] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF7B72]">
                Before Maintenance (Faulted)
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#3D1418] text-[#FF7B72] border border-[#F85149]/40 font-bold">
                CRITICAL
              </span>
            </div>

            <div className="space-y-2 font-mono text-sm">
              <div className="flex items-center justify-between p-2.5 bg-[#0F1115] rounded border border-[#5A1E24]">
                <span className="flex items-center gap-1.5 text-[#8B949E] text-xs">
                  <Thermometer className="w-4 h-4 text-[#F85149]" /> Temperature:
                </span>
                <span className="font-bold text-[#F85149]">82°C</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-[#0F1115] rounded border border-[#5A1E24]">
                <span className="flex items-center gap-1.5 text-[#8B949E] text-xs">
                  <Activity className="w-4 h-4 text-[#F85149]" /> Vibration:
                </span>
                <span className="font-bold text-[#F85149]">8.4 mm/s</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-[#0F1115] rounded border border-[#5A1E24]">
                <span className="flex items-center gap-1.5 text-[#8B949E] text-xs">
                  <Gauge className="w-4 h-4 text-[#8B949E]" /> Pressure:
                </span>
                <span className="font-bold text-[#C9D1D9]">5.2 bar</span>
              </div>
            </div>
          </div>

          {/* After Maintenance */}
          <div
            className={`p-5 rounded-xl border transition-all space-y-3 ${
              verificationResult
                ? 'border-[#1B4B27] bg-[#12231A]'
                : 'border-[#2D333B] bg-[#0F1115] opacity-60'
            }`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`text-xs font-bold uppercase tracking-wider ${
                  verificationResult ? 'text-[#3FB950]' : 'text-[#8B949E]'
                }`}
              >
                After Simulated Maintenance
              </span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                  verificationResult
                    ? 'bg-[#12231A] text-[#3FB950] border border-[#1B4B27]'
                    : 'bg-[#1C2128] text-[#8B949E] border border-[#2D333B]'
                }`}
              >
                {verificationResult ? 'STABILIZED' : 'AWAITING SIMULATION'}
              </span>
            </div>

            <div className="space-y-2 font-mono text-sm">
              <div className="flex items-center justify-between p-2.5 bg-[#0F1115] rounded border border-[#2D333B]">
                <span className="flex items-center gap-1.5 text-[#8B949E] text-xs">
                  <Thermometer className="w-4 h-4 text-[#3FB950]" /> Temperature:
                </span>
                <span
                  className={`font-bold ${
                    verificationResult ? 'text-[#3FB950]' : 'text-[#6E7681]'
                  }`}
                >
                  {verificationResult ? '61°C' : '--'}
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-[#0F1115] rounded border border-[#2D333B]">
                <span className="flex items-center gap-1.5 text-[#8B949E] text-xs">
                  <Activity className="w-4 h-4 text-[#3FB950]" /> Vibration:
                </span>
                <span
                  className={`font-bold ${
                    verificationResult ? 'text-[#3FB950]' : 'text-[#6E7681]'
                  }`}
                >
                  {verificationResult ? '3.1 mm/s' : '--'}
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-[#0F1115] rounded border border-[#2D333B]">
                <span className="flex items-center gap-1.5 text-[#8B949E] text-xs">
                  <Gauge className="w-4 h-4 text-[#8B949E]" /> Pressure:
                </span>
                <span
                  className={`font-bold ${
                    verificationResult ? 'text-[#3FB950]' : 'text-[#6E7681]'
                  }`}
                >
                  {verificationResult ? '5.1 bar' : '--'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 8. VERIFICATION EVALUATION CARD */}
        {verificationResult && (
          <div
            id="resolution-verification-card"
            className="bg-[#12231A] text-[#E6EDF3] rounded-xl p-6 border border-[#1B4B27] shadow-lg space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#3FB950]">
                <CheckCircle2 className="w-6 h-6 text-[#3FB950]" />
                <span className="font-bold text-base tracking-wide uppercase">
                  Resolution Status: {verificationResult.status}
                </span>
              </div>
              <span className="text-xs font-mono text-[#8B949E]">
                Verified at: {verificationResult.verifiedAt}
              </span>
            </div>

            <div className="bg-[#0F1115] p-4 rounded-lg border border-[#1B4B27] space-y-1.5">
              <div className="text-xs uppercase font-bold text-[#3FB950] font-mono">
                Verification Reasoning:
              </div>
              <p className="text-xs sm:text-sm text-[#C9D1D9] leading-relaxed font-sans">
                {verificationResult.reason}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#8B949E] pt-2 border-t border-[#1B4B27]">
              <span>Equipment CNC Machine #04 state cleared from Critical to Healthy.</span>
              <button
                onClick={onOpenReportModal}
                className="text-[#3FB950] hover:text-[#56d364] font-semibold underline cursor-pointer flex items-center gap-1"
              >
                <FileCheck className="w-4 h-4" />
                Print Verified Technical Incident Report
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

import React from 'react';
import { X, Printer, CheckCircle2, ShieldAlert, Cpu, Calendar, Wrench } from 'lucide-react';
import { FullDiagnosisResult, VerificationResult } from '../types';

interface IncidentReportModalProps {
  diagnosis: FullDiagnosisResult;
  verificationResult: VerificationResult | null;
  onClose: () => void;
}

export const IncidentReportModal: React.FC<IncidentReportModalProps> = ({
  diagnosis,
  verificationResult,
  onClose,
}) => {
  const { incident, rootCause, maintenancePlan, hypotheses } = diagnosis;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F1115]/80 backdrop-blur-xs print:p-0 print:bg-white">
      <div className="bg-[#161B22] text-[#E6EDF3] rounded-2xl shadow-2xl border border-[#2D333B] max-w-3xl w-full max-h-[92vh] overflow-hidden flex flex-col print:bg-white print:text-black print:shadow-none print:border-none print:max-h-none print:w-full">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#1C2128] border-b border-[#2D333B] text-[#E6EDF3] flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-[#F27D26]" />
            <h3 className="font-bold text-base text-[#E6EDF3]">Industrial Incident Dossier & SOP</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-[#161B22] hover:bg-[#2D333B] text-[#E6EDF3] text-xs font-medium rounded-lg border border-[#2D333B] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-[#F27D26]" />
              <span>Print Dossier</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-[#8B949E] hover:text-[#E6EDF3] hover:bg-[#2D333B] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 overflow-y-auto space-y-6 text-[#E6EDF3] text-xs sm:text-sm font-sans print:text-black">
          {/* Document Header */}
          <div className="border-b-2 border-[#2D333B] print:border-black pb-4 flex items-start justify-between">
            <div>
              <div className="text-xl font-black tracking-tight text-[#E6EDF3] print:text-black">
                MaintAI INDUSTRIAL INCIDENT REPORT
              </div>
              <div className="text-xs text-[#8B949E] print:text-gray-600 font-mono mt-0.5">
                AUTONOMOUS DIAGNOSTIC CERTIFICATE #DOC-2026-CNC04
              </div>
            </div>
            <div className="text-right text-xs text-[#8B949E] print:text-gray-600 font-mono">
              <div>Date: {new Date().toLocaleDateString()}</div>
              <div>Status: {verificationResult ? 'RESOLVED' : 'INVESTIGATED'}</div>
            </div>
          </div>

          {/* Incident Metadata Table */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#0F1115] p-4 rounded-lg border border-[#2D333B] print:bg-gray-50 print:border-gray-300 text-xs">
            <div>
              <span className="text-[#8B949E] print:text-gray-600 block font-medium">Equipment ID:</span>
              <span className="font-bold font-mono text-[#E6EDF3] print:text-black">{incident.equipmentId}</span>
            </div>
            <div>
              <span className="text-[#8B949E] print:text-gray-600 block font-medium">Equipment Type:</span>
              <span className="font-semibold text-[#E6EDF3] print:text-black">{incident.equipmentType}</span>
            </div>
            <div>
              <span className="text-[#8B949E] print:text-gray-600 block font-medium">Operating Hours:</span>
              <span className="font-bold font-mono text-[#E6EDF3] print:text-black">{incident.operatingHours} hrs</span>
            </div>
            <div>
              <span className="text-[#8B949E] print:text-gray-600 block font-medium">Reported At:</span>
              <span className="font-mono text-[#E6EDF3] print:text-black">{diagnosis.investigationCompletedAt}</span>
            </div>
          </div>

          {/* Telemetry At Failure */}
          <div>
            <h4 className="font-bold text-[#E6EDF3] print:text-black uppercase text-xs tracking-wider mb-2">
              1. Telemetry At Incident Event
            </h4>
            <div className="grid grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-2.5 rounded bg-[#211618] border border-[#5A1E24] print:bg-rose-50 print:border-rose-200">
                <span className="text-[#8B949E] print:text-slate-600 block text-[11px]">Temperature:</span>
                <span className="font-bold text-[#FF7B72] print:text-rose-700 text-sm">{incident.temperature}°C</span>
                <span className="text-[10px] text-[#8B949E] print:text-slate-500 block">(Normal: 40-65°C)</span>
              </div>
              <div className="p-2.5 rounded bg-[#211618] border border-[#5A1E24] print:bg-rose-50 print:border-rose-200">
                <span className="text-[#8B949E] print:text-slate-600 block text-[11px]">Vibration Velocity:</span>
                <span className="font-bold text-[#FF7B72] print:text-rose-700 text-sm">{incident.vibration} mm/s</span>
                <span className="text-[10px] text-[#8B949E] print:text-slate-500 block">(Normal: 0.5-4.5 mm/s)</span>
              </div>
              <div className="p-2.5 rounded bg-[#0F1115] border border-[#2D333B] print:bg-slate-50 print:border-slate-200">
                <span className="text-[#8B949E] print:text-slate-600 block text-[11px]">Line Pressure:</span>
                <span className="font-bold text-[#E6EDF3] print:text-slate-800 text-sm">{incident.pressure} bar</span>
                <span className="text-[10px] text-[#8B949E] print:text-slate-500 block">(Normal: 4.5-5.5 bar)</span>
              </div>
            </div>
          </div>

          {/* Autonomous Root Cause Diagnosis */}
          <div className="p-4 rounded-lg bg-[#0F1115] border border-[#2D333B] text-[#E6EDF3] print:bg-gray-100 print:text-black space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-mono text-[#F27D26] print:text-gray-800 font-bold tracking-wider">
                2. Autonomous Root Cause Determination
              </span>
              <span className="text-xs font-mono bg-[#1C2128] text-[#F27D26] px-2 py-0.5 rounded border border-[#F27D26]/40 font-bold print:bg-white print:text-black">
                Confidence: {rootCause.confidence}%
              </span>
            </div>
            <div className="text-lg font-extrabold text-[#E6EDF3] print:text-black">
              {rootCause.probableCause}
            </div>
            <div className="text-xs text-[#C9D1D9] print:text-gray-700 leading-relaxed font-sans whitespace-pre-line pt-1 border-t border-[#2D333B] print:border-gray-300">
              {rootCause.whyExplanation}
            </div>
          </div>

          {/* Maintenance Action Plan */}
          <div className="space-y-3">
            <h4 className="font-bold text-[#E6EDF3] print:text-black uppercase text-xs tracking-wider">
              3. Prescribed Corrective Maintenance Action Plan
            </h4>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-[#0F1115] rounded border border-[#2D333B] print:bg-gray-50 print:border-gray-200">
                <span className="font-bold text-[#F27D26] print:text-black block mb-0.5">Immediate Action:</span>
                <p className="text-[#C9D1D9] print:text-gray-800">{maintenancePlan.immediateAction}</p>
              </div>
              <div className="p-2.5 bg-[#0F1115] rounded border border-[#2D333B] print:bg-gray-50 print:border-gray-200">
                <span className="font-bold text-[#F27D26] print:text-black block mb-0.5">Physical Inspection:</span>
                <p className="text-[#C9D1D9] print:text-gray-800">{maintenancePlan.inspectionRequired}</p>
              </div>
              <div className="p-2.5 bg-[#0F1115] rounded border border-[#2D333B] print:bg-gray-50 print:border-gray-200">
                <span className="font-bold text-[#F27D26] print:text-black block mb-0.5">Recommended Maintenance SOP:</span>
                <p className="text-[#C9D1D9] print:text-gray-800">{maintenancePlan.recommendedMaintenance}</p>
              </div>
              <div className="p-2.5 bg-[#0F1115] rounded border border-[#2D333B] print:bg-gray-50 print:border-gray-200">
                <span className="font-bold text-[#F27D26] print:text-black block mb-0.5">Post-Maintenance Verification:</span>
                <p className="text-[#C9D1D9] print:text-gray-800">{maintenancePlan.verificationProcedure}</p>
              </div>
            </div>
          </div>

          {/* Resolution Sign-Off */}
          {verificationResult && (
            <div className="p-4 rounded-lg bg-[#12231A] border border-[#1B4B27] print:bg-emerald-50 print:border-emerald-300 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#3FB950] print:text-emerald-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#3FB950] print:text-emerald-600" /> 4. Post-Service Verification
                </span>
                <span className="font-mono text-[#3FB950] print:text-emerald-800 text-xs font-bold">STATUS: RESOLVED</span>
              </div>
              <p className="text-xs text-[#C9D1D9] print:text-emerald-800 leading-relaxed">
                {verificationResult.reason}
              </p>
            </div>
          )}

          {/* Academic Footer Disclaimer */}
          <div className="pt-4 border-t border-[#2D333B] print:border-slate-200 text-[11px] text-[#8B949E] print:text-slate-500 flex flex-col sm:flex-row justify-between gap-2">
            <span>Generated by MaintAI Autonomous Agent</span>
            <span>Educational Academic Prototype — No Real Machine Actuation</span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-[#1C2128] border-t border-[#2D333B] flex justify-end print:hidden">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#2D333B] text-[#E6EDF3] rounded-lg text-xs font-medium hover:bg-[#444C56] transition-colors cursor-pointer"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};

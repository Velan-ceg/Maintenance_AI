import React from 'react';
import { ShieldCheck, Cpu, Activity, AlertTriangle, FileText, CheckCircle2, Zap } from 'lucide-react';

interface NavbarProps {
  activeTab: 'dashboard' | 'report' | 'investigation' | 'diagnosis';
  setActiveTab: (tab: 'dashboard' | 'report' | 'investigation' | 'diagnosis') => void;
  investigationRunning: boolean;
  hasDiagnosis: boolean;
  isResolved: boolean;
  hasGeminiKey: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  investigationRunning,
  hasDiagnosis,
  isResolved,
  hasGeminiKey,
}) => {
  return (
    <header className="bg-[#161B22] border-b border-[#2D333B] text-[#E6EDF3] sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-[#F27D26] to-[#D85A18] flex items-center justify-center shadow-inner">
              <Cpu className="w-6 h-6 text-[#0F1115] stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-[#E6EDF3]">MaintAI</span>
                <span className="text-xs px-2 py-0.5 rounded font-mono font-semibold bg-[#1C2128] text-[#F27D26] border border-[#F27D26]/30">
                  Agentic MVP
                </span>
                {isResolved && (
                  <span className="text-xs px-2 py-0.5 rounded font-mono font-medium bg-[#12231A] text-[#3FB950] border border-[#1B4B27] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Resolved
                  </span>
                )}
              </div>
              <p className="text-xs text-[#8B949E] hidden sm:block">Autonomous Maintenance Diagnosis Agent</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center space-x-1 sm:space-x-2">
            <button
              id="nav-tab-dashboard"
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-[#1C2128] text-[#58A6FF] border border-[#383F4A]'
                  : 'text-[#8B949E] hover:text-[#E6EDF3] hover:bg-[#1C2128]'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>1. Dashboard</span>
            </button>

            <button
              id="nav-tab-report"
              onClick={() => setActiveTab('report')}
              className={`px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'report'
                  ? 'bg-[#1C2128] text-[#F27D26] border border-[#F27D26]/50'
                  : 'text-[#8B949E] hover:text-[#E6EDF3] hover:bg-[#1C2128]'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              <span>2. Report Incident</span>
            </button>

            <button
              id="nav-tab-investigation"
              onClick={() => setActiveTab('investigation')}
              className={`px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors flex items-center gap-1.5 relative cursor-pointer ${
                activeTab === 'investigation'
                  ? 'bg-[#1C2128] text-[#58A6FF] border border-[#383F4A]'
                  : 'text-[#8B949E] hover:text-[#E6EDF3] hover:bg-[#1C2128]'
              }`}
            >
              <Cpu className={`w-4 h-4 ${investigationRunning ? 'animate-spin text-[#58A6FF]' : ''}`} />
              <span>3. Investigation</span>
              {investigationRunning && (
                <span className="w-2 h-2 rounded-full bg-[#58A6FF] animate-ping absolute -top-0.5 -right-0.5" />
              )}
            </button>

            <button
              id="nav-tab-diagnosis"
              onClick={() => setActiveTab('diagnosis')}
              className={`px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'diagnosis'
                  ? 'bg-[#1C2128] text-[#3FB950] border border-[#1B4B27]'
                  : hasDiagnosis
                  ? 'text-[#8B949E] hover:text-[#E6EDF3] hover:bg-[#1C2128]'
                  : 'text-[#484F58] opacity-60 hover:text-[#8B949E]'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>4. Diagnosis Report</span>
            </button>
          </nav>

          {/* Engine Status pill */}
          <div className="hidden lg:flex items-center gap-2 text-xs">
            <div className="px-2.5 py-1 rounded-full bg-[#1C2128] border border-[#2D333B] flex items-center gap-1.5 text-[#8B949E]">
              <span className="w-2 h-2 rounded-full bg-[#3FB950] animate-pulse"></span>
              <span>Agent: Ready</span>
            </div>
            {hasGeminiKey && (
              <div className="px-2 py-1 rounded-full bg-[#1C2128] border border-[#58A6FF]/40 text-[#58A6FF] flex items-center gap-1">
                <Zap className="w-3 h-3 text-[#58A6FF]" />
                <span>LLM Active</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

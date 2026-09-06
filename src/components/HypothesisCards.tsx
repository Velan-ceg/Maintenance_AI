import React from 'react';
import { Check, X, AlertTriangle, ShieldAlert, Zap } from 'lucide-react';
import { Hypothesis } from '../types';

interface HypothesisCardsProps {
  hypotheses: Hypothesis[];
}

export const HypothesisCards: React.FC<HypothesisCardsProps> = ({ hypotheses }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-[#E6EDF3] uppercase tracking-wider">
            Hypothesis Generation & Evaluation Matrix
          </h3>
          <p className="text-xs text-[#8B949E]">
            Competing mechanical failure modes evaluated against multi-sensor telemetry and service archives.
          </p>
        </div>
        <span className="text-xs font-mono text-[#8B949E] bg-[#161B22] border border-[#2D333B] px-2.5 py-1 rounded-md">
          {hypotheses.length} Hypotheses Formulated
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {hypotheses.map((hyp) => {
          const isHighest = hyp.probability >= 70;
          const isModerate = hyp.probability >= 8 && hyp.probability < 70;

          return (
            <div
              key={hyp.id}
              id={`hypothesis-card-${hyp.id}`}
              className={`rounded-xl border p-5 flex flex-col justify-between transition-all ${
                isHighest
                  ? 'bg-[#1C2128] border-[#F27D26] ring-1 ring-[#F27D26]/30 shadow-md'
                  : 'bg-[#161B22] border-[#2D333B] shadow-sm hover:border-[#444C56]'
              }`}
            >
              <div>
                {/* Header: Cause & Probability */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-[#E6EDF3]">{hyp.cause}</h4>
                      {isHighest && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F27D26]/20 text-[#F27D26] border border-[#F27D26]/40 uppercase tracking-wider">
                          Leading Candidate
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#8B949E] mt-0.5 leading-snug">{hyp.rationale}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <div
                      className={`text-2xl font-bold font-mono ${
                        isHighest
                          ? 'text-[#F27D26]'
                          : isModerate
                          ? 'text-[#D29922]'
                          : 'text-[#6E7681]'
                      }`}
                    >
                      {hyp.probability}%
                    </div>
                    <div className="text-[10px] uppercase tracking-wider text-[#8B949E] font-semibold">
                      Probability
                    </div>
                  </div>
                </div>

                {/* Probability Bar */}
                <div className="w-full h-1.5 bg-[#0F1115] rounded-full overflow-hidden mb-4 border border-[#2D333B]">
                  <div
                    className={`h-full rounded-full ${
                      isHighest
                        ? 'bg-[#F27D26]'
                        : isModerate
                        ? 'bg-[#D29922]'
                        : 'bg-[#6E7681]'
                    }`}
                    style={{ width: `${hyp.probability}%` }}
                  />
                </div>

                {/* Supporting Evidence */}
                <div className="mb-3">
                  <div className="text-[11px] font-bold text-[#3FB950] uppercase tracking-wider flex items-center gap-1 mb-1.5">
                    <Check className="w-3.5 h-3.5 text-[#3FB950] stroke-[2.5]" />
                    <span>Supporting Evidence ({hyp.supportingEvidence.length})</span>
                  </div>
                  <ul className="space-y-1 text-xs text-[#C9D1D9]">
                    {hyp.supportingEvidence.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 bg-[#12231A] p-1.5 rounded border border-[#1B4B27]">
                        <span className="text-[#3FB950] font-bold shrink-0 mt-0.5">•</span>
                        <span className="text-[11px] leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Contradicting Evidence */}
                {hyp.contradictingEvidence.length > 0 && (
                  <div>
                    <div className="text-[11px] font-bold text-[#F85149] uppercase tracking-wider flex items-center gap-1 mb-1.5">
                      <X className="w-3.5 h-3.5 text-[#F85149] stroke-[2.5]" />
                      <span>Contradicting Evidence ({hyp.contradictingEvidence.length})</span>
                    </div>
                    <ul className="space-y-1 text-xs text-[#C9D1D9]">
                      {hyp.contradictingEvidence.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 bg-[#2A1215] p-1.5 rounded border border-[#5A1E24]">
                          <span className="text-[#F85149] font-bold shrink-0 mt-0.5">•</span>
                          <span className="text-[11px] leading-relaxed text-[#FF7B72]">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

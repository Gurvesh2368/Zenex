import React from 'react';
import { ScoreBreakdown } from '../engine/rank';
import { X, Award, CheckCircle, Sliders } from 'lucide-react';

interface RankBreakdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  schemeName: string;
  totalScore: number;
  breakdown: ScoreBreakdown;
}

export const RankBreakdownModal: React.FC<RankBreakdownModalProps> = ({
  isOpen,
  onClose,
  schemeName,
  totalScore,
  breakdown,
}) => {
  if (!isOpen) return null;

  const items = [
    {
      label: 'Criteria Match Strength',
      score: breakdown.matchStrength,
      max: 40,
      description: 'Proportion of scheme eligibility rules fully satisfied by your answers.',
      color: 'bg-emerald-500',
    },
    {
      label: 'Constitutional Pillar / Need Fit',
      score: breakdown.needFit,
      max: 25,
      description: 'Alignment with your active pillar filters and category preferences.',
      color: 'bg-blue-500',
    },
    {
      label: 'Benefit Impact Tier',
      score: breakdown.benefitValue,
      max: 15,
      description: 'Significance of monetary support, insurance, or livelihood assistance.',
      color: 'bg-orange-500',
    },
    {
      label: 'Application Ease',
      score: breakdown.ease,
      max: 10,
      description: 'Simplicity of application steps, paperless eKYC and processing speed.',
      color: 'bg-purple-500',
    },
    {
      label: 'Portal Openness',
      score: breakdown.openness,
      max: 10,
      description: 'Active enrollment status on the official Government portal.',
      color: 'bg-amber-500',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-orange-600" />
            <h3 className="font-bold text-base text-slate-900">
              Why this Rank?
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4">
          <p className="text-xs font-semibold text-slate-500 mb-1">
            Scheme: <span className="text-slate-900">{schemeName}</span>
          </p>

          <div className="flex items-baseline gap-2 mb-4 bg-orange-50 p-3 rounded-xl border border-orange-200">
            <Award className="w-6 h-6 text-orange-600" />
            <div>
              <span className="text-2xl font-black text-orange-950">
                {totalScore}
              </span>
              <span className="text-xs text-orange-700 font-bold ml-1">/ 100</span>
              <p className="text-[11px] text-orange-800">
                Deterministic algorithmic score (same answers always yield exact same ranking).
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {items.map((it) => {
              const pct = Math.round((it.score / it.max) * 100);
              return (
                <div key={it.label} className="text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-slate-700">{it.label}</span>
                    <span className="font-bold text-slate-900">
                      {it.score} <span className="text-slate-400 font-normal">/ {it.max}</span>
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${it.color} transition-all duration-300`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">{it.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors"
          >
            Close Breakdown
          </button>
        </div>
      </div>
    </div>
  );
};

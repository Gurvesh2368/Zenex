import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Scheme, SchemeEvaluation } from '../engine/types';
import { useAuthStore } from '../store/auth';
import { RankBreakdownModal } from './RankBreakdownModal';
import {
  Bookmark,
  Sparkles,
  HelpCircle,
  AlertCircle,
  CheckCircle2,
  Sliders,
  ChevronRight,
} from 'lucide-react';

interface SchemeCardProps {
  scheme: Scheme;
  evaluation: SchemeEvaluation;
  isSelected?: boolean;
  onSelect: () => void;
}

export const SchemeCard: React.FC<SchemeCardProps> = ({
  scheme,
  evaluation,
  isSelected = false,
  onSelect,
}) => {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language as 'en' | 'hi' | 'mr') || 'en';
  const { shortlist, toggleShortlist } = useAuthStore();
  const [showRankModal, setShowRankModal] = useState(false);

  const isSaved = shortlist.includes(scheme.id) || shortlist.includes(scheme.slug);

  const schemeName = scheme.name_i18n[lang] || scheme.name_i18n.en || scheme.slug;
  const benefitText = scheme.benefit_i18n[lang] || scheme.benefit_i18n.en;
  const summaryText = scheme.summary_i18n[lang] || scheme.summary_i18n.en;

  const getStatusBadge = () => {
    switch (evaluation.verdict) {
      case 'eligible':
        return {
          label: t('status.eligible'),
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          icon: CheckCircle2,
        };
      case 'almost':
        return {
          label: t('status.almost'),
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          icon: Sparkles,
        };
      case 'possible':
        return {
          label: t('status.possible'),
          bg: 'bg-sky-50 text-sky-700 border-sky-200',
          icon: HelpCircle,
        };
      default:
        return {
          label: t('status.not_eligible'),
          bg: 'bg-slate-100 text-slate-600 border-slate-200',
          icon: AlertCircle,
        };
    }
  };

  const statusInfo = getStatusBadge();
  const StatusIcon = statusInfo.icon;

  return (
    <>
      <div
        onClick={onSelect}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelect();
          }
        }}
        className={`group p-4 sm:p-5 rounded-2xl border text-left cursor-pointer transition-all duration-200 ${
          isSelected
            ? 'bg-white border-orange-500 shadow-md ring-2 ring-orange-500/20'
            : 'bg-white hover:bg-slate-50/70 border-slate-200 shadow-xs hover:border-slate-300'
        }`}
      >
        {/* Header line: Badges & Shortlist button */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center flex-wrap gap-1.5">
            {/* Verdict Badge */}
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border ${statusInfo.bg}`}
            >
              <StatusIcon className="w-3.5 h-3.5" />
              <span>{statusInfo.label}</span>
            </span>

            {/* Pillar Badge */}
            {scheme.category?.pillar && (
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                {scheme.category.pillar}
              </span>
            )}
          </div>

          {/* Star / Bookmark button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleShortlist(scheme.id);
            }}
            title={isSaved ? 'Remove from shortlist' : 'Save to shortlist'}
            className={`p-1.5 rounded-lg border transition-colors ${
              isSaved
                ? 'bg-orange-50 text-orange-600 border-orange-200'
                : 'text-slate-400 hover:text-slate-600 border-transparent hover:border-slate-200'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-orange-600' : ''}`} />
          </button>
        </div>

        {/* Title */}
        <h4 className="font-bold text-base text-slate-900 group-hover:text-orange-950 transition-colors mb-1.5 leading-snug">
          {schemeName}
        </h4>

        {/* Summary */}
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
          {summaryText}
        </p>

        {/* Key Benefit Highlight */}
        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 mb-3 text-xs flex items-baseline gap-1.5">
          <span className="font-bold text-slate-900 shrink-0">Benefit:</span>
          <span className="text-slate-700 truncate">{benefitText}</span>
        </div>

        {/* Footer: Relevance Score & Modal Trigger */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Relevance:</span>
            <span className="font-extrabold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
              {evaluation.relevanceScore}/100
            </span>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowRankModal(true);
              }}
              title="View deterministic score breakdown"
              className="text-[11px] text-orange-600 hover:text-orange-700 font-semibold inline-flex items-center gap-1 hover:underline"
            >
              <Sliders className="w-3 h-3" />
              <span>Why?</span>
            </button>
          </div>

          <div className="flex items-center gap-1 text-slate-400 group-hover:text-orange-600 text-xs font-semibold">
            <span>Details</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>

      <RankBreakdownModal
        isOpen={showRankModal}
        onClose={() => setShowRankModal(false)}
        schemeName={schemeName}
        totalScore={evaluation.relevanceScore}
        breakdown={evaluation.scoreBreakdown}
      />
    </>
  );
};

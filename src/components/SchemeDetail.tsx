import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Scheme, SchemeEvaluation } from '../engine/types';
import { useAuthStore } from '../store/auth';
import {
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  ExternalLink,
  Printer,
  Bookmark,
  Calendar,
  BookOpen,
  FileText,
  ListOrdered,
  Scale,
  ArrowRight,
  X,
  Layers,
} from 'lucide-react';

export interface SchemeDetailProps {
  scheme: Scheme;
  evaluation: SchemeEvaluation;
  onClose?: () => void;
  initialTab?: 'documents' | 'steps' | 'eligibility' | 'benefits' | 'all';
}

export const SchemeDetail: React.FC<SchemeDetailProps> = ({
  scheme,
  evaluation,
  onClose,
  initialTab = 'documents',
}) => {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language as 'en' | 'hi' | 'mr') || 'en';
  const { shortlist, toggleShortlist } = useAuthStore();

  const [activeTab, setActiveTab] = useState<'documents' | 'steps' | 'eligibility' | 'benefits' | 'all'>(initialTab);
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({});

  const isSaved = shortlist.includes(scheme.id) || shortlist.includes(scheme.slug);

  const schemeName = scheme.name_i18n[lang] || scheme.name_i18n.en || scheme.slug;
  const benefitText = scheme.benefit_i18n[lang] || scheme.benefit_i18n.en;
  const summaryText = scheme.summary_i18n[lang] || scheme.summary_i18n.en;

  const docs = scheme.scheme_documents || [];
  const steps = scheme.scheme_steps || [];

  const toggleDoc = (id: string) => {
    setCheckedDocs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden text-slate-800">
      {/* Header bar */}
      <div className="p-4 sm:p-6 border-b border-slate-100 bg-slate-50/70">
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-1 rounded-md border border-orange-200">
              {scheme.level.toUpperCase()} SCHEME
            </span>
            {scheme.category?.pillar && (
              <span className="text-xs font-semibold text-slate-600 bg-slate-200/80 px-2.5 py-1 rounded-md">
                {scheme.category.pillar.toUpperCase()}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => toggleShortlist(scheme.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border transition-colors ${
                isSaved
                  ? 'bg-orange-50 text-orange-600 border-orange-200'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-200'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-orange-600' : ''}`} />
              <span>{isSaved ? t('scheme.saved') : t('scheme.save')}</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              title="Print checklist"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-white hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-200 transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">Print</span>
            </button>

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                title="Close Details"
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition-colors ml-1"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
          {schemeName}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
          {summaryText}
        </p>

        {/* Standalone Page Link */}
        <div className="mt-3 flex items-center gap-3">
          <Link
            to={`/scheme/${scheme.slug}`}
            className="text-xs font-semibold text-orange-600 hover:text-orange-700 inline-flex items-center gap-1 hover:underline"
          >
            <span>Open in dedicated full page</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Interactive Tabs Strip */}
      <div className="bg-slate-100 p-2 border-b border-slate-200">
        <div className="flex items-center gap-1 overflow-x-auto text-xs font-bold scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('documents')}
            className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'documents'
                ? 'bg-white text-orange-700 shadow-xs border border-orange-200 ring-1 ring-orange-500/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-orange-600" />
            <span>Required Documents</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              activeTab === 'documents' ? 'bg-orange-100 text-orange-800' : 'bg-slate-200 text-slate-700'
            }`}>
              {docs.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('steps')}
            className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'steps'
                ? 'bg-white text-orange-700 shadow-xs border border-orange-200 ring-1 ring-orange-500/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <ListOrdered className="w-3.5 h-3.5 text-orange-600" />
            <span>How to Apply</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              activeTab === 'steps' ? 'bg-orange-100 text-orange-800' : 'bg-slate-200 text-slate-700'
            }`}>
              {steps.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('eligibility')}
            className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'eligibility'
                ? 'bg-white text-orange-700 shadow-xs border border-orange-200 ring-1 ring-orange-500/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-orange-600" />
            <span>Eligibility</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('benefits')}
            className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'benefits'
                ? 'bg-white text-orange-700 shadow-xs border border-orange-200 ring-1 ring-orange-500/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-orange-600" />
            <span>Benefits</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ml-auto ${
              activeTab === 'all'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All</span>
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-6">
        {/* Status Verdict Banner (Always visible) */}
        <div
          className={`p-4 rounded-xl border flex items-start gap-3 ${
            evaluation.verdict === 'eligible'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
              : evaluation.verdict === 'almost'
              ? 'bg-amber-50 border-amber-200 text-amber-950'
              : evaluation.verdict === 'possible'
              ? 'bg-sky-50 border-sky-200 text-sky-950'
              : 'bg-slate-100 border-slate-200 text-slate-800'
          }`}
        >
          {evaluation.verdict === 'eligible' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : evaluation.verdict === 'almost' ? (
            <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          ) : evaluation.verdict === 'possible' ? (
            <HelpCircle className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-slate-600 shrink-0 mt-0.5" />
          )}

          <div>
            <span className="font-bold text-sm block">
              {t(`status.${evaluation.verdict}`)}
            </span>
            <p className="text-xs mt-0.5 opacity-90 leading-relaxed">
              {t(`statusDesc.${evaluation.verdict}`)}
            </p>
          </div>
        </div>

        {/* 1. REQUIRED DOCUMENTS SECTION (Visible when tab is 'documents' or 'all') */}
        {(activeTab === 'documents' || activeTab === 'all') && (
          <div className="space-y-3 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-orange-600" />
                <span>{t('scheme.documents')}</span>
                <span className="text-xs bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full font-bold">
                  {docs.length} Required
                </span>
              </h4>
              <span className="text-[11px] text-slate-500 font-medium">
                Tap to check off
              </span>
            </div>

            {docs.length === 0 ? (
              <p className="text-xs text-slate-500 bg-slate-50 p-4 rounded-xl border border-slate-200">
                No specific documents listed for this scheme. Standard government photo ID (Aadhaar/Voter ID) applies.
              </p>
            ) : (
              <div className="space-y-2">
                {docs.map((doc) => {
                  const docName = doc.name_i18n[lang] || doc.name_i18n.en;
                  const docHint = doc.hint_i18n ? doc.hint_i18n[lang] || doc.hint_i18n.en : null;
                  const isChecked = Boolean(checkedDocs[doc.id]);

                  return (
                    <div
                      key={doc.id}
                      onClick={() => toggleDoc(doc.id)}
                      className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all flex items-start gap-3 select-none ${
                        isChecked
                          ? 'bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-400/20'
                          : 'bg-slate-50 hover:bg-slate-100/90 border-slate-200'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`font-bold text-sm ${isChecked ? 'text-emerald-950 line-through' : 'text-slate-900'}`}>
                            {docName}
                          </span>
                          {doc.mandatory ? (
                            <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                              Mandatory
                            </span>
                          ) : (
                            <span className="text-[10px] font-medium text-slate-600 bg-slate-200 px-1.5 py-0.2 rounded">
                              Alternative
                            </span>
                          )}
                        </div>
                        {docHint && (
                          <p className="text-[11px] text-slate-600 mt-1">
                            <strong className="text-slate-700">Where to get:</strong> {docHint}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 2. HOW TO APPLY (STEPS) SECTION (Visible when tab is 'steps' or 'all') */}
        {(activeTab === 'steps' || activeTab === 'all') && (
          <div className="space-y-3 animate-in fade-in duration-150">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-1 border-b border-slate-100">
              <ListOrdered className="w-4 h-4 text-orange-600" />
              <span>{t('scheme.steps')}</span>
            </h4>

            {steps.length === 0 ? (
              <p className="text-xs text-slate-500 bg-slate-50 p-4 rounded-xl border border-slate-200">
                Please follow application guidelines on the official portal link below.
              </p>
            ) : (
              <div className="space-y-2.5">
                {steps.map((st) => {
                  const stepText = st.text_i18n[lang] || st.text_i18n.en;
                  return (
                    <div key={st.id} className="flex items-start gap-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                      <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                        {st.sort}
                      </span>
                      <span className="text-slate-700 leading-relaxed font-medium">{stepText}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 3. ELIGIBILITY CRITERIA & WHY NOT (Visible when tab is 'eligibility' or 'all') */}
        {(activeTab === 'eligibility' || activeTab === 'all') && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-1 border-b border-slate-100">
              <CheckCircle2 className="w-4 h-4 text-orange-600" />
              <span>Eligibility Evaluation</span>
            </h4>

            {/* Near-Miss Meter */}
            {evaluation.nearRules.length > 0 && (
              <div className="bg-amber-50/70 border border-amber-200 p-4 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>{t('scheme.nearMissTitle')}</span>
                </div>

                {evaluation.nearRules.map((rule) => {
                  const reasonText = t(rule.reasonKey, {
                    value: rule.actual,
                    limit: rule.expected,
                    gap: rule.gap,
                  });
                  const fixText = rule.fixKey ? t(rule.fixKey) : null;

                  return (
                    <div key={rule.id} className="text-xs bg-white p-3 rounded-lg border border-amber-200/80">
                      <p className="text-slate-800 font-medium">{reasonText}</p>
                      {rule.gap !== undefined && (
                        <p className="text-amber-800 font-bold mt-1">
                          Gap: {rule.gap} {rule.field === 'incomeLakh' ? 'Lakh' : 'years'}
                        </p>
                      )}
                      {fixText && (
                        <div className="mt-2 text-slate-600 bg-amber-50/50 p-2 rounded flex items-center gap-1.5 font-medium">
                          <ArrowRight className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span>Action: {fixText}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Why Not List */}
            {evaluation.failedRules.length > 0 && (
              <div className="bg-rose-50/60 border border-rose-200 p-4 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-rose-900 font-bold text-xs">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  <span>{t('scheme.whyNotTitle')}</span>
                </div>

                <div className="space-y-1.5">
                  {evaluation.failedRules.map((rule) => {
                    const reasonText = t(rule.reasonKey, {
                      value: rule.actual,
                      limit: rule.expected,
                    });
                    return (
                      <div key={rule.id} className="text-xs bg-white p-2.5 rounded-lg border border-rose-100 flex items-start gap-2">
                        <span className="text-rose-500 font-bold shrink-0">✕</span>
                        <span className="text-slate-700">{reasonText}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {evaluation.failedRules.length === 0 && evaluation.nearRules.length === 0 && (
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-xs text-emerald-900 font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>All listed eligibility criteria have been satisfied based on your answers!</span>
              </div>
            )}
          </div>
        )}

        {/* 4. BENEFITS & OVERVIEW (Visible when tab is 'benefits' or 'all') */}
        {(activeTab === 'benefits' || activeTab === 'all') && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-1 border-b border-slate-100">
              <Sparkles className="w-4 h-4 text-orange-600" />
              <span>{t('scheme.benefits')}</span>
            </h4>

            <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-xl border border-orange-200">
              <p className="text-sm font-semibold text-slate-900 leading-relaxed">
                {benefitText}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 block">Benefit Impact:</span>
                <span className="font-bold text-slate-900">
                  {scheme.benefit_tier === 3 ? 'High (₹5 Lakh+ / Enterprise)' : scheme.benefit_tier === 2 ? 'Medium (Direct Cash / Pension)' : 'Standard'}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 block">Application Ease:</span>
                <span className="font-bold text-slate-900">
                  {scheme.ease === 3 ? 'Easy (Paperless / CSC / Online)' : scheme.ease === 2 ? 'Moderate' : 'Standard Document Review'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Official Portal Action CTA (Always visible) */}
        <div className="pt-2">
          <a
            href={scheme.apply_url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm rounded-xl shadow transition-colors"
          >
            <span>{t('scheme.applyNow')}</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Constitutional Articles & Source Footer */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
          {scheme.articles && scheme.articles.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <Scale className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-semibold text-slate-600">{t('scheme.articles')}:</span>
              {scheme.articles.map((art) => (
                <span
                  key={art}
                  className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-mono text-[10px]"
                >
                  Art. {art}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 text-slate-400 text-[11px]">
              <Calendar className="w-3.5 h-3.5" />
              <span>{t('scheme.lastVerified')}: {scheme.last_verified}</span>
            </span>

            <a
              href={scheme.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-600 hover:text-orange-700 font-semibold inline-flex items-center gap-1 text-[11px]"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{t('scheme.source')}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

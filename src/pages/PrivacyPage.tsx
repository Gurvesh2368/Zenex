import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useProfileStore } from '../store/profile';
import { useAuthStore } from '../store/auth';
import { ShieldCheck, Lock, Trash2, CheckCircle2, RotateCcw, AlertTriangle } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  const { t } = useTranslation();
  const { resetProfile } = useProfileStore();
  const { deleteMyData, status } = useAuthStore();

  const [wipeNotice, setWipeNotice] = useState<string | null>(null);

  const handleClearAnswers = () => {
    resetProfile();
    setWipeNotice('All temporary questionnaire responses have been cleared from memory.');
    setTimeout(() => setWipeNotice(null), 4000);
  };

  const handleWipeShortlist = async () => {
    if (window.confirm('Are you sure you want to delete all saved schemes from your account?')) {
      await deleteMyData();
      setWipeNotice('All saved shortlist data has been permanently deleted.');
      setTimeout(() => setWipeNotice(null), 4000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold shadow-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>DPDP Act Compliance</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900">
          {t('privacy.heading')}
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
          {t('privacy.lead')}
        </p>
      </div>

      {wipeNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{wipeNotice}</span>
        </div>
      )}

      {/* 4 Core Privacy Guarantees */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Lock className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">
            {t('privacy.rule1Title')}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {t('privacy.rule1Desc')}
          </p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">
            {t('privacy.rule2Title')}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {t('privacy.rule2Desc')}
          </p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">
            {t('privacy.rule3Title')}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {t('privacy.rule3Desc')}
          </p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
            <Trash2 className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">
            {t('privacy.rule4Title')}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {t('privacy.rule4Desc')}
          </p>
        </div>
      </div>

      {/* Action Buttons: Clear Answers & Wipe Data */}
      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
        <h3 className="font-bold text-sm text-slate-900">
          Exercise Your Data Rights
        </h3>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleClearAnswers}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-100 text-rose-700 text-xs font-bold rounded-xl border border-rose-200 shadow-xs transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t('privacy.wipeAnswers')}</span>
          </button>

          {status === 'authenticated' && (
            <button
              onClick={handleWipeShortlist}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>{t('privacy.wipeShortlist')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Database Schema Transparency */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3 text-xs">
        <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <span>Technical Transparency</span>
        </h3>
        <p className="text-slate-600 leading-relaxed">
          Anyone reviewing our open codebase can verify: the database schema contains tables only for <code>categories</code>, <code>schemes</code>, <code>scheme_documents</code>, <code>scheme_steps</code>, and <code>shortlist (user_id, scheme_id)</code>. No table or column exists in our entire system to store user questionnaire responses.
        </p>
      </div>
    </div>
  );
};

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useProfileStore } from '../store/profile';
import { ShieldCheck, ArrowRight, Lock } from 'lucide-react';

export const ConsentBanner: React.FC = () => {
  const { t } = useTranslation();
  const { consentAccepted, setConsentAccepted } = useProfileStore();

  if (consentAccepted) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-4">
          <ShieldCheck className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-bold text-slate-900 mb-2">
          {t('privacy.heading')}
        </h3>

        <p className="text-xs text-slate-600 leading-relaxed mb-4">
          {t('privacy.lead')}
        </p>

        <div className="space-y-2.5 mb-6 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200">
          <div className="flex items-start gap-2.5">
            <Lock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 block font-semibold">
                {t('privacy.rule1Title')}
              </strong>
              <span className="text-slate-600">{t('privacy.rule1Desc')}</span>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 block font-semibold">
                {t('privacy.rule2Title')}
              </strong>
              <span className="text-slate-600">{t('privacy.rule2Desc')}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <Link
            to="/privacy"
            onClick={() => setConsentAccepted(true)}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 order-2 sm:order-1"
          >
            Read Full Privacy Notice
          </Link>

          <button
            onClick={() => setConsentAccepted(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow transition-colors order-1 sm:order-2"
          >
            <span>Continue as Guest</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

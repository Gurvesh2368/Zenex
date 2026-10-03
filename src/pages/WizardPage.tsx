import React from 'react';
import { useTranslation } from 'react-i18next';
import { Wizard } from '../components/Wizard';
import { ShieldCheck } from 'lucide-react';

export const WizardPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold shadow-xs">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>{t('app.privacyBadge')}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          {t('wizard.title')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          {t('wizard.subtitle')}
        </p>
      </div>

      <Wizard />
    </div>
  );
};

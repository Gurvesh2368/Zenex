import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useProfileStore } from '../store/profile';
import { Occupation, Residence, Gender } from '../engine/types';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  HelpCircle,
  Sparkles,
} from 'lucide-react';

const INDIAN_STATES = [
  'Andaman and Nicobar Islands',
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chandigarh',
  'Chhattisgarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jammu and Kashmir',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Ladakh',
  'Lakshadweep',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Puducherry',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
];

const OCCUPATION_OPTIONS: { id: Occupation; labelKey: string; icon: string }[] = [
  { id: 'farmer', labelKey: 'wizard.farmer', icon: '🌾' },
  { id: 'student', labelKey: 'wizard.student', icon: '🎓' },
  { id: 'artisan', labelKey: 'wizard.artisan', icon: '🛠' },
  { id: 'street_vendor', labelKey: 'wizard.street_vendor', icon: '🛒' },
  { id: 'self_employed', labelKey: 'wizard.self_employed', icon: '💼' },
  { id: 'salaried', labelKey: 'wizard.salaried', icon: '🏢' },
  { id: 'unemployed', labelKey: 'wizard.unemployed', icon: '🔎' },
  { id: 'homemaker', labelKey: 'wizard.homemaker', icon: '🏠' },
  { id: 'retired', labelKey: 'wizard.retired', icon: '👴' },
];

export const Wizard: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { profile, setProfileField, setHasStarted } = useProfileStore();

  const [step, setStep] = useState<number>(1);
  const totalSteps = 6;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      setHasStarted(true);
      navigate('/results');
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSkip = () => {
    handleNext();
  };

  const toggleOccupation = (occ: Occupation) => {
    const current = profile.occupation || [];
    const exists = current.includes(occ);
    const updated = exists ? current.filter((o) => o !== occ) : [...current, occ];
    setProfileField('occupation', updated);
  };

  return (
    <div className="max-w-2xl mx-auto w-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Top Progress bar */}
      <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-orange-600 text-white text-xs font-bold flex items-center justify-center">
            {step}
          </span>
          <span className="text-xs font-semibold text-slate-700">
            {t('wizard.coreProgress', { current: step })}
          </span>
        </div>

        {/* Step dots */}
        <div className="flex items-center gap-1.5">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setStep(i + 1)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i + 1 === step
                  ? 'w-6 bg-orange-600'
                  : i + 1 < step
                  ? 'w-2 bg-emerald-500'
                  : 'w-2 bg-slate-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Question Content */}
      <div className="p-6 sm:p-8 min-h-[320px] flex flex-col justify-between">
        <div>
          {/* STEP 1: AGE */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">
                  {t('wizard.qAge')}
                </h3>
                <p className="text-xs text-slate-500">{t('wizard.qAgeHint')}</p>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row sm:items-center gap-4">
                <input
                  type="number"
                  min={0}
                  max={120}
                  placeholder="e.g. 35"
                  value={profile.age ?? ''}
                  onChange={(e) => {
                    const val = e.target.value === '' ? undefined : parseInt(e.target.value, 10);
                    setProfileField('age', val);
                  }}
                  className="w-full sm:w-40 px-4 py-3 text-2xl font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-orange-500 focus:bg-white"
                />
                <div className="flex flex-wrap gap-2">
                  {[18, 25, 45, 60, 70].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setProfileField('age', preset)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                        profile.age === preset
                          ? 'bg-orange-600 text-white border-orange-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {preset} yrs
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: GENDER */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">
                  {t('wizard.qGender')}
                </h3>
                <p className="text-xs text-slate-500">
                  Many schemes offer dedicated benefits for women or transgender persons.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
                {[
                  { id: 'female' as Gender, labelKey: 'wizard.female', icon: '👩' },
                  { id: 'male' as Gender, labelKey: 'wizard.male', icon: '👨' },
                  { id: 'other' as Gender, labelKey: 'wizard.other', icon: '⚧' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setProfileField('gender', item.id)}
                    className={`flex items-center gap-3 p-4 rounded-xl border text-left font-medium transition-all ${
                      profile.gender === item.id
                        ? 'border-orange-600 bg-orange-50/60 ring-2 ring-orange-500/30 text-orange-950 font-bold'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <span>{t(item.labelKey)}</span>
                    {profile.gender === item.id && (
                      <CheckCircle2 className="w-5 h-5 text-orange-600 ml-auto" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: STATE */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">
                  {t('wizard.qState')}
                </h3>
                <p className="text-xs text-slate-500">
                  Filters both Central all-India schemes and state-specific portals.
                </p>
              </div>

              <div className="pt-2">
                <select
                  value={profile.state ?? ''}
                  onChange={(e) => setProfileField('state', e.target.value || undefined)}
                  className="w-full px-4 py-3 text-sm font-medium bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:bg-white"
                >
                  <option value="">-- {t('wizard.selectState')} --</option>
                  {INDIAN_STATES.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* STEP 4: RESIDENCE (RURAL / URBAN) */}
          {step === 4 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">
                  {t('wizard.qResidence')}
                </h3>
                <p className="text-xs text-slate-500">
                  Certain schemes focus specifically on rural development or urban poor.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
                {[
                  { id: 'rural' as Residence, labelKey: 'wizard.rural', icon: '🏡' },
                  { id: 'urban' as Residence, labelKey: 'wizard.urban', icon: '🏙' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setProfileField('residence', item.id)}
                    className={`flex items-center gap-3 p-4 rounded-xl border text-left font-medium transition-all ${
                      profile.residence === item.id
                        ? 'border-orange-600 bg-orange-50/60 ring-2 ring-orange-500/30 text-orange-950 font-bold'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <span>{t(item.labelKey)}</span>
                    {profile.residence === item.id && (
                      <CheckCircle2 className="w-5 h-5 text-orange-600 ml-auto" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: INCOME */}
          {step === 5 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">
                  {t('wizard.qIncome')}
                </h3>
                <p className="text-xs text-slate-500">{t('wizard.incomeHint')}</p>
              </div>

              <div className="pt-2 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="relative w-full sm:w-48">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400">
                      ₹
                    </span>
                    <input
                      type="number"
                      step="0.1"
                      min={0}
                      max={100}
                      placeholder="e.g. 1.8"
                      value={profile.incomeLakh ?? ''}
                      onChange={(e) => {
                        const val = e.target.value === '' ? undefined : parseFloat(e.target.value);
                        setProfileField('incomeLakh', val);
                      }}
                      className="w-full pl-8 pr-4 py-3 text-2xl font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:bg-white"
                    />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-slate-500">Lakh / year</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {[
                    { label: '< ₹1 Lakh', val: 0.8 },
                    { label: '₹1.5 - ₹2.5 Lakh', val: 2.0 },
                    { label: '₹2.5 - ₹5 Lakh', val: 3.5 },
                    { label: '₹5 - ₹8 Lakh', val: 6.0 },
                    { label: '₹8+ Lakh', val: 9.0 },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setProfileField('incomeLakh', preset.val)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                        profile.incomeLakh === preset.val
                          ? 'bg-orange-600 text-white border-orange-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: OCCUPATION */}
          {step === 6 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">
                  {t('wizard.qOccupation')}
                </h3>
                <p className="text-xs text-slate-500">
                  Select all that describe you or family members (multiple allowed).
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 max-h-[300px] overflow-y-auto pr-1">
                {OCCUPATION_OPTIONS.map((item) => {
                  const isSelected = profile.occupation?.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleOccupation(item.id)}
                      className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all text-xs font-medium ${
                        isSelected
                          ? 'border-orange-600 bg-orange-50/70 text-orange-950 font-bold ring-1 ring-orange-500/40'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span className="truncate">{t(item.labelKey)}</span>
                      {isSelected && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-orange-600 ml-auto shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <div>
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{t('wizard.back')}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSkip}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-700"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{t('wizard.skip')}</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {step < totalSteps && (
              <button
                type="button"
                onClick={handleSkip}
                className="px-3 py-2 text-xs font-medium text-slate-500 hover:text-slate-700"
              >
                {t('wizard.skip')}
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow transition-colors"
            >
              <span>{step === totalSteps ? t('wizard.showSchemes') : t('wizard.next')}</span>
              {step === totalSteps ? (
                <Sparkles className="w-4 h-4 text-orange-200" />
              ) : (
                <ArrowRight className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useProfileStore } from '../store/profile';
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Clock,
  Scale,
  Sparkles,
  Lock,
} from 'lucide-react';

export const Home: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { profile } = useProfileStore();

  const hasAnswers = Object.values(profile).some((val) => val !== undefined && val !== '');

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-orange-50/50 via-white to-slate-50 pt-12 pb-16 border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          {/* Privacy badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold shadow-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>{t('app.privacyBadge')}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            {t('hero.heading')}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {t('hero.subheading')}
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/find')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-base rounded-2xl shadow-lg hover:shadow-orange-600/25 transition-all transform hover:-translate-y-0.5"
            >
              <span>{hasAnswers ? t('hero.continue') : t('hero.cta')}</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <Link
              to="/results"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 bg-white hover:bg-slate-50 text-slate-700 font-bold text-base rounded-2xl border border-slate-300 shadow-xs transition-colors"
            >
              <span>Browse All Schemes</span>
            </Link>
          </div>

          {/* Quick trust metrics */}
          <div className="pt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto text-left">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-start gap-3">
              <Clock className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-xs font-bold text-slate-900">Under 2 Minutes</strong>
                <span className="text-[11px] text-slate-500">6 core questions; instant offline ranking</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-start gap-3">
              <Lock className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-xs font-bold text-slate-900">Zero Retention</strong>
                <span className="text-[11px] text-slate-500">No login, Aadhaar, or phone required</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-start gap-3">
              <FileText className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-xs font-bold text-slate-900">Document Checklist</strong>
                <span className="text-[11px] text-slate-500">Know exactly what papers to carry</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            {t('hero.howItWorks')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Three simple steps to unlock government support for your household
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 font-black text-xl flex items-center justify-center mx-auto border border-orange-200">
              1
            </div>
            <h3 className="font-bold text-slate-900 text-sm">
              {t('hero.step1')}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Answer basic questions about age, location, occupation, and family in English, Hindi, or Marathi.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 font-black text-xl flex items-center justify-center mx-auto border border-blue-200">
              2
            </div>
            <h3 className="font-bold text-slate-900 text-sm">
              {t('hero.step2')}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              See instant results grouped into Eligible, Almost Eligible (near-misses), and clear reasons for any missed criteria.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 font-black text-xl flex items-center justify-center mx-auto border border-emerald-200">
              3
            </div>
            <h3 className="font-bold text-slate-900 text-sm">
              {t('hero.step3')}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Print a unified document checklist with hints on where to obtain certificates, then apply directly on the official portal.
            </p>
          </div>
        </div>
      </section>

      {/* Constitutional Alignment Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 via-chakra-900 to-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
          <div className="relative z-10 space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-300 px-3 py-1 rounded-full text-xs font-bold border border-orange-500/30">
              <Scale className="w-3.5 h-3.5" />
              <span>Grounded in Constitutional Values</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black">
              The Four Pillars of Citizen Welfare
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Every scheme in Yojana Setu is mapped to the Directive Principles and Fundamental Rights of the Indian Constitution — Justice (Articles 38, 39), Liberty (Articles 19, 21A), Equality (Articles 14, 15), and Fraternity (Articles 41, 43).
            </p>

            <div className="pt-2">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-xs font-bold text-orange-400 hover:text-orange-300 hover:underline"
              >
                <span>Read Constitutional Mapping & Methodology</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

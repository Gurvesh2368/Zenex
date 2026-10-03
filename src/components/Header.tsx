import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { changeLanguage } from '../i18n';
import { useProfileStore } from '../store/profile';
import { useAuthStore } from '../store/auth';
import { ShieldCheck, RotateCcw, Bookmark, UserCheck, Globe, Scale } from 'lucide-react';

export const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { profile, resetProfile } = useProfileStore();
  const { status, shortlist, signOut } = useAuthStore();

  const hasAnswers = Object.values(profile).some((val) => val !== undefined && val !== '');

  const handleLangChange = (lang: 'en' | 'hi' | 'mr') => {
    changeLanguage(lang);
  };

  const handleClear = () => {
    if (window.confirm('Clear all your answers from this device?')) {
      resetProfile();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
      {/* Tricolour top line */}
      <div className="h-1.5 w-full flex">
        <div className="flex-1 bg-orange-500" />
        <div className="flex-1 bg-white border-y border-slate-200" />
        <div className="flex-1 bg-green-600" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Logo & Brand */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 rounded-full bg-slate-900 border-2 border-orange-500 flex items-center justify-center p-1 text-white shadow group-hover:scale-105 transition-transform">
            <Scale className="w-5 h-5 text-orange-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-slate-900">
                {t('app.title')}
              </span>
              <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                {t('app.privacyBadge')}
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              {t('app.subtitle')}
            </p>
          </div>
        </Link>

        {/* Right side controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Clear Answers Button (when answers entered) */}
          {hasAnswers && (
            <button
              onClick={handleClear}
              title={t('nav.clearAnswers')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
              <span className="hidden lg:inline">{t('nav.clearAnswers')}</span>
            </button>
          )}

          {/* Shortlist Link */}
          <Link
            to="/shortlist"
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              location.pathname === '/shortlist'
                ? 'bg-orange-50 text-orange-700 border border-orange-200'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Bookmark className="w-4 h-4 text-orange-600" />
            <span className="hidden sm:inline">{t('nav.shortlist')}</span>
            {shortlist.length > 0 && (
              <span className="bg-orange-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {shortlist.length}
              </span>
            )}
          </Link>

          {/* Language Switcher */}
          <div className="inline-flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <Globe className="w-3.5 h-3.5 ml-1.5 text-slate-400 hidden sm:block" />
            <button
              type="button"
              onClick={() => handleLangChange('en')}
              className={`px-2 py-1 text-xs font-medium rounded-md transition-colors ${
                i18n.language === 'en'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => handleLangChange('hi')}
              className={`px-2 py-1 text-xs font-medium rounded-md transition-colors ${
                i18n.language === 'hi'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              हिन्दी
            </button>
            <button
              type="button"
              onClick={() => handleLangChange('mr')}
              className={`px-2 py-1 text-xs font-medium rounded-md transition-colors ${
                i18n.language === 'mr'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              मराठी
            </button>
          </div>

          {/* Auth Button */}
          {status === 'authenticated' ? (
            <button
              onClick={() => signOut()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200"
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">{t('nav.logout')}</span>
            </button>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200"
            >
              <span>{t('nav.login')}</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

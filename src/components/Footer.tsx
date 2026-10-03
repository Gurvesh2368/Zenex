import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Calendar, BookOpen, ExternalLink } from 'lucide-react';

interface FooterProps {
  lastVerified?: string;
  source?: 'supabase' | 'fallback';
}

export const Footer: React.FC<FooterProps> = ({ lastVerified = '2026-09-15', source = 'fallback' }) => {
  const { t } = useTranslation();

  return (
    <footer className="mt-auto bg-slate-900 text-slate-300 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Col 1: Mission */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white text-base">
                {t('app.title')}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-orange-400 font-semibold px-2 py-0.5 rounded bg-orange-950/60 border border-orange-800/60">
                PS-19 Open Source
              </span>
            </div>
            <p className="text-slate-400 max-w-md leading-relaxed text-xs">
              {t('app.tagline')}
            </p>
            <div className="inline-flex items-center gap-2 text-emerald-400 bg-emerald-950/50 px-3 py-1.5 rounded-lg border border-emerald-800/50 text-[11px]">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{t('privacy.rule1Desc')}</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-white font-semibold mb-3 tracking-wide">
              Navigation
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link to="/find" className="hover:text-white transition-colors">
                  {t('nav.finder')}
                </Link>
              </li>
              <li>
                <Link to="/results" className="hover:text-white transition-colors">
                  {t('nav.results')}
                </Link>
              </li>
              <li>
                <Link to="/shortlist" className="hover:text-white transition-colors">
                  {t('nav.shortlist')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Principles & Rights */}
          <div>
            <h4 className="text-white font-semibold mb-3 tracking-wide">
              Constitutional Rights
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link to="/about" className="hover:text-white transition-colors flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>The 4 Pillars</span>
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>DPDP Privacy Guarantee</span>
                </Link>
              </li>
              <li>
                <a
                  href="https://india.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>National Portal of India</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400">
          <p className="text-[11px] text-center sm:text-left max-w-xl">
            {t('app.disclaimer')}
          </p>

          <div className="flex items-center gap-3 text-[11px] shrink-0">
            <span className="inline-flex items-center gap-1.5 text-slate-400">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>{t('scheme.lastVerified')}: <strong className="text-slate-200">{lastVerified}</strong></span>
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">
              {source === 'supabase' ? 'Online Catalog' : 'Offline Verified Cache'}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useProfileStore, PillarId } from '../store/profile';
import { Scheme } from '../engine/types';
import { Scale, Compass, Award, HeartHandshake, Check } from 'lucide-react';

interface PillarRailProps {
  schemes: Scheme[];
  className?: string;
}

interface PillarConfig {
  id: PillarId;
  titleKey: string;
  subKey: string;
  icon: React.ElementType;
  articles: string[];
  color: {
    bg: string;
    border: string;
    text: string;
    activeBg: string;
    badge: string;
  };
}

const PILLARS: PillarConfig[] = [
  {
    id: 'justice',
    titleKey: 'pillars.justice',
    subKey: 'pillars.justiceSub',
    icon: Scale,
    articles: ['Art. 38', 'Art. 39(b)', 'Art. 41', 'Art. 47'],
    color: {
      bg: 'bg-blue-50/60',
      border: 'border-blue-200',
      text: 'text-blue-900',
      activeBg: 'bg-blue-600 text-white',
      badge: 'bg-blue-100 text-blue-800',
    },
  },
  {
    id: 'liberty',
    titleKey: 'pillars.liberty',
    subKey: 'pillars.libertySub',
    icon: Compass,
    articles: ['Art. 19(1)(g)', 'Art. 21A', 'Art. 43', 'Art. 46'],
    color: {
      bg: 'bg-amber-50/60',
      border: 'border-amber-200',
      text: 'text-amber-900',
      activeBg: 'bg-amber-600 text-white',
      badge: 'bg-amber-100 text-amber-800',
    },
  },
  {
    id: 'equality',
    titleKey: 'pillars.equality',
    subKey: 'pillars.equalitySub',
    icon: Award,
    articles: ['Art. 14', 'Art. 15(3)', 'Art. 39(a)', 'Art. 42'],
    color: {
      bg: 'bg-emerald-50/60',
      border: 'border-emerald-200',
      text: 'text-emerald-900',
      activeBg: 'bg-emerald-600 text-white',
      badge: 'bg-emerald-100 text-emerald-800',
    },
  },
  {
    id: 'fraternity',
    titleKey: 'pillars.fraternity',
    subKey: 'pillars.fraternitySub',
    icon: HeartHandshake,
    articles: ['Art. 41', 'Art. 43', 'Preamble'],
    color: {
      bg: 'bg-purple-50/60',
      border: 'border-purple-200',
      text: 'text-purple-900',
      activeBg: 'bg-purple-600 text-white',
      badge: 'bg-purple-100 text-purple-800',
    },
  },
];

export const PillarRail: React.FC<PillarRailProps> = ({ schemes, className = '' }) => {
  const { t } = useTranslation();
  const { selectedPillars, togglePillar, clearPillars } = useProfileStore();

  const getPillarCount = (pillarId: PillarId) => {
    return schemes.filter((s) => s.category?.pillar === pillarId).length;
  };

  return (
    <aside className={`pillar-rail space-y-4 ${className}`}>
      {/* Title */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {t('pillars.title')}
          </h3>
          <p className="text-[11px] text-slate-400">
            {t('pillars.subtitle')}
          </p>
        </div>
        {selectedPillars.length > 0 && (
          <button
            onClick={clearPillars}
            className="text-[11px] font-semibold text-orange-600 hover:text-orange-700"
          >
            Show All
          </button>
        )}
      </div>

      {/* Pillar Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
        {PILLARS.map((p) => {
          const isSelected = selectedPillars.includes(p.id);
          const count = getPillarCount(p.id);
          const Icon = p.icon;

          return (
            <div
              key={p.id}
              onClick={() => togglePillar(p.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  togglePillar(p.id);
                }
              }}
              className={`p-3 rounded-xl border text-left cursor-pointer transition-all duration-150 select-none ${
                isSelected
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-orange-500/40'
                  : 'bg-white hover:bg-slate-50/80 border-slate-200 text-slate-800 shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                      isSelected ? 'bg-orange-500 text-white' : p.color.bg + ' ' + p.color.text
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold leading-tight">
                      {t(p.titleKey)}
                    </h4>
                    <p
                      className={`text-[10px] leading-tight ${
                        isSelected ? 'text-slate-300' : 'text-slate-500'
                      }`}
                    >
                      {t(p.subKey)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span
                    className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {count}
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-orange-400" />}
                </div>
              </div>

              {/* Constitutional Articles chips */}
              <div className="mt-2.5 pt-2 border-t border-slate-100/20 flex flex-wrap gap-1">
                {p.articles.map((art) => (
                  <span
                    key={art}
                    className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                      isSelected
                        ? 'bg-slate-800 text-slate-300 border border-slate-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {art}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
};

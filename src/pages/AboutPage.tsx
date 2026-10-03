import React from 'react';
import { useTranslation } from 'react-i18next';
import { Scale, BookOpen, ShieldCheck, Cpu, ExternalLink } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Title */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-orange-800 border border-orange-200 text-xs font-bold shadow-xs">
          <Scale className="w-4 h-4 text-orange-600" />
          <span>Constitutional Architecture</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
          About Yojana Setu
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
          An open, transparent, and private bridge connecting citizens to constitutional welfare guarantees without bureaucratic barriers.
        </p>
      </div>

      {/* The 4 Constitutional Pillars */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">
          The Four Pillars in Action
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block">
              1. Justice (Social, Economic & Political)
            </span>
            <h3 className="font-bold text-slate-900 text-sm">
              Securing basic livelihoods & healthcare
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Article 38 and 39 direct the state to eliminate inequalities and secure equitable distribution of material resources. Schemes like PM-KISAN and PM-JAY fulfill this mandate.
            </p>
            <div className="text-[11px] font-mono text-slate-500">
              Key Articles: 38, 39(b), 41, 47, 48
            </div>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block">
              2. Liberty (Thought, Expression & Enterprise)
            </span>
            <h3 className="font-bold text-slate-900 text-sm">
              Empowering self-reliance and education
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Article 19(1)(g) guarantees the right to practice any trade or business, while Article 21A guarantees education. Schemes like PM Vishwakarma and Post-Matric Scholarships enable citizens to pursue their potential freely.
            </p>
            <div className="text-[11px] font-mono text-slate-500">
              Key Articles: 19(1)(g), 21A, 43, 46
            </div>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
              3. Equality (Status & Opportunity)
            </span>
            <h3 className="font-bold text-slate-900 text-sm">
              Targeted affirmative welfare
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Article 15(3) empowers special provisions for women and children, while 15(4) enables advancement of SC/ST communities. Schemes like Ujjwala, Matru Vandana, and Sukanya Samriddhi bridge historic disparities.
            </p>
            <div className="text-[11px] font-mono text-slate-500">
              Key Articles: 14, 15(3), 15(4), 39(a), 42
            </div>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <span className="text-xs font-bold text-purple-700 uppercase tracking-wider block">
              4. Fraternity (Dignity & Social Security)
            </span>
            <h3 className="font-bold text-slate-900 text-sm">
              Universal dignity in old age & adversity
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Article 41 obligates public assistance in cases of unemployment, old age, sickness and disablement. Schemes like Atal Pension Yojana and IGNOAPS Old Age Pension safeguard dignity in old age.
            </p>
            <div className="text-[11px] font-mono text-slate-500">
              Key Articles: 41, 43, Preamble
            </div>
          </div>
        </div>
      </div>

      {/* Methodology & Algorithmic Determinism */}
      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs leading-relaxed">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Cpu className="w-5 h-5 text-orange-600" />
          <span>Algorithmic Determinism & Zero Hallucination</span>
        </h2>
        <p className="text-slate-600">
          Unlike black-box generative AI models that can hallucinate criteria, Yojana Setu uses an open, pure TypeScript evaluation engine. Every rule is evaluated using formal Boolean trees (with inclusive boundary operators and declared tolerances). Given the exact same inputs, the engine will always produce the exact same verdict and relevance score.
        </p>
      </div>
    </div>
  );
};

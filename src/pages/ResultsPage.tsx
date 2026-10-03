import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useProfileStore } from '../store/profile';
import { Scheme, Verdict } from '../engine/types';
import { evaluateAllSchemes } from '../engine/evaluate';
import { fetchCatalogue } from '../data/catalogue';
import { PillarRail } from '../components/PillarRail';
import { SchemeCard } from '../components/SchemeCard';
import { SchemeDetail } from '../components/SchemeDetail';
import {
  RotateCcw,
  Edit3,
  Search,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  AlertCircle,
  SlidersHorizontal,
} from 'lucide-react';

export const ResultsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language as 'en' | 'hi' | 'mr') || 'en';
  const navigate = useNavigate();

  const {
    profile,
    resetProfile,
    setProfileField,
    selectedPillars,
    searchQuery,
    setSearchQuery,
  } = useProfileStore();

  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Verdict>('eligible');
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  useEffect(() => {
    fetchCatalogue().then((res) => {
      setSchemes(res.schemes);
      setLoading(false);
    });
  }, []);

  // Filter schemes by active pillar filters (if any selected)
  const filteredCatalogue = useMemo(() => {
    if (selectedPillars.length === 0) return schemes;
    return schemes.filter((s) => s.category && selectedPillars.includes(s.category.pillar));
  }, [schemes, selectedPillars]);

  // Evaluate schemes against current in-memory profile
  const { evaluations, grouped } = useMemo(() => {
    return evaluateAllSchemes(filteredCatalogue, profile);
  }, [filteredCatalogue, profile]);

  // Filter by text search query
  const displayEvaluations = useMemo(() => {
    const list = grouped[activeTab] || [];
    if (!searchQuery.trim()) return list;

    const q = searchQuery.toLowerCase();
    return list.filter((evalItem) => {
      const sch = schemes.find((s) => s.slug === evalItem.slug);
      if (!sch) return false;
      const name = (sch.name_i18n[lang] || sch.name_i18n.en || '').toLowerCase();
      const summary = (sch.summary_i18n[lang] || sch.summary_i18n.en || '').toLowerCase();
      return name.includes(q) || summary.includes(q) || sch.category_id.includes(q);
    });
  }, [grouped, activeTab, searchQuery, schemes, lang]);

  // Set default selected scheme slug if none selected or activeTab changes
  useEffect(() => {
    if (displayEvaluations.length > 0) {
      if (!selectedSlug || !displayEvaluations.some((e) => e.slug === selectedSlug)) {
        setSelectedSlug(displayEvaluations[0].slug);
      }
    } else {
      setSelectedSlug(null);
    }
  }, [displayEvaluations, selectedSlug]);

  // Auto-switch to tab with schemes if current tab is empty
  useEffect(() => {
    if (grouped.eligible.length > 0) {
      setActiveTab('eligible');
    } else if (grouped.almost.length > 0) {
      setActiveTab('almost');
    } else if (grouped.possible.length > 0) {
      setActiveTab('possible');
    } else if (grouped.not_eligible.length > 0) {
      setActiveTab('not_eligible');
    }
  }, [schemes.length]);

  const selectedEvaluation = evaluations.find((e) => e.slug === selectedSlug);
  const selectedScheme = schemes.find((s) => s.slug === selectedSlug);

  const handleClear = () => {
    if (window.confirm('Clear all responses? All information will be wiped immediately.')) {
      resetProfile();
      navigate('/find');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs text-slate-500 font-medium">Loading verified government schemes...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* 3-Column Responsive Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Pillar Rail (Left Column on Desktop, Col 1-2) */}
        <div className="lg:col-span-2">
          <PillarRail schemes={schemes} />
        </div>

        {/* COLUMN A: YOUR DETAILS & REFINE (Col 3-4 on Desktop) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                A. Your Details
              </h3>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => navigate('/find')}
                  className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg text-xs font-semibold inline-flex items-center gap-1"
                  title="Edit Answers"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={handleClear}
                  className="p-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg text-xs font-semibold inline-flex items-center gap-1"
                  title="Clear Answers"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Answer Chips */}
            <div className="flex flex-wrap gap-1.5 text-xs">
              {profile.age !== undefined && (
                <span className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg font-medium">
                  Age: <strong>{profile.age}</strong>
                </span>
              )}
              {profile.gender && (
                <span className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg font-medium capitalize">
                  {profile.gender}
                </span>
              )}
              {profile.state && (
                <span className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg font-medium">
                  {profile.state}
                </span>
              )}
              {profile.residence && (
                <span className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg font-medium capitalize">
                  {profile.residence}
                </span>
              )}
              {profile.incomeLakh !== undefined && (
                <span className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg font-medium">
                  Income: <strong>₹{profile.incomeLakh}L</strong>
                </span>
              )}
              {profile.occupation && profile.occupation.length > 0 && (
                <span className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg font-medium capitalize">
                  {profile.occupation.join(', ')}
                </span>
              )}
            </div>

            {/* IMPROVE RESULTS: OPTIONAL REFINE QUESTIONS */}
            <div className="pt-3 border-t border-slate-100 space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <SlidersHorizontal className="w-3.5 h-3.5 text-orange-600" />
                <span>{t('wizard.refineTitle')}</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">
                {t('wizard.refineDesc')}
              </p>

              <div className="space-y-3 text-xs pt-1">
                {/* BPL Card */}
                <div>
                  <label className="text-slate-600 block mb-1 font-medium">{t('refine.bpl')}</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setProfileField('bpl', profile.bpl === 'yes' ? undefined : 'yes')}
                      className={`py-1.5 px-2 rounded-lg border text-center font-semibold transition-colors ${
                        profile.bpl === 'yes'
                          ? 'bg-orange-600 text-white border-orange-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {t('refine.bplYes')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setProfileField('bpl', profile.bpl === 'no' ? undefined : 'no')}
                      className={`py-1.5 px-2 rounded-lg border text-center font-semibold transition-colors ${
                        profile.bpl === 'no'
                          ? 'bg-slate-800 text-white border-slate-800'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {t('refine.bplNo')}
                    </button>
                  </div>
                </div>

                {/* Land Owner */}
                <div>
                  <label className="text-slate-600 block mb-1 font-medium">{t('refine.land')}</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setProfileField('landOwner', profile.landOwner === true ? undefined : true)}
                      className={`py-1.5 px-2 rounded-lg border text-center font-semibold transition-colors ${
                        profile.landOwner === true
                          ? 'bg-orange-600 text-white border-orange-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {t('refine.landYes')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setProfileField('landOwner', profile.landOwner === false ? undefined : false)}
                      className={`py-1.5 px-2 rounded-lg border text-center font-semibold transition-colors ${
                        profile.landOwner === false
                          ? 'bg-slate-800 text-white border-slate-800'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {t('refine.landNo')}
                    </button>
                  </div>
                </div>

                {/* Social Category */}
                <div>
                  <label className="text-slate-600 block mb-1 font-medium">{t('refine.category')}</label>
                  <div className="grid grid-cols-4 gap-1">
                    {(['general', 'obc', 'sc', 'st'] as const).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setProfileField('category', profile.category === cat ? undefined : cat)}
                        className={`py-1.5 rounded-lg border text-center font-bold uppercase transition-colors ${
                          profile.category === cat
                            ? 'bg-orange-600 text-white border-orange-600'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Active Bank Account */}
                <div>
                  <label className="text-slate-600 block mb-1 font-medium">{t('refine.bank')}</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setProfileField('hasBankAccount', profile.hasBankAccount === true ? undefined : true)}
                      className={`py-1.5 px-2 rounded-lg border text-center font-semibold transition-colors ${
                        profile.hasBankAccount === true
                          ? 'bg-orange-600 text-white border-orange-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {t('refine.bankYes')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setProfileField('hasBankAccount', profile.hasBankAccount === false ? undefined : false)}
                      className={`py-1.5 px-2 rounded-lg border text-center font-semibold transition-colors ${
                        profile.hasBankAccount === false
                          ? 'bg-slate-800 text-white border-slate-800'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {t('refine.bankNo')}
                    </button>
                  </div>
                </div>

                {/* Daughter Under 10 */}
                <div>
                  <label className="text-slate-600 block mb-1 font-medium">{t('refine.daughter')}</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setProfileField('daughterUnder10', profile.daughterUnder10 === true ? undefined : true)}
                      className={`py-1.5 px-2 rounded-lg border text-center font-semibold transition-colors ${
                        profile.daughterUnder10 === true
                          ? 'bg-orange-600 text-white border-orange-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {t('refine.daughterYes')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setProfileField('daughterUnder10', profile.daughterUnder10 === false ? undefined : false)}
                      className={`py-1.5 px-2 rounded-lg border text-center font-semibold transition-colors ${
                        profile.daughterUnder10 === false
                          ? 'bg-slate-800 text-white border-slate-800'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {t('refine.daughterNo')}
                    </button>
                  </div>
                </div>

                {/* Pregnant / Nursing */}
                <div>
                  <label className="text-slate-600 block mb-1 font-medium">{t('refine.pregnant')}</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setProfileField('pregnantOrNursing', profile.pregnantOrNursing === true ? undefined : true)}
                      className={`py-1.5 px-2 rounded-lg border text-center font-semibold transition-colors ${
                        profile.pregnantOrNursing === true
                          ? 'bg-orange-600 text-white border-orange-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {t('refine.pregnantYes')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setProfileField('pregnantOrNursing', profile.pregnantOrNursing === false ? undefined : false)}
                      className={`py-1.5 px-2 rounded-lg border text-center font-semibold transition-colors ${
                        profile.pregnantOrNursing === false
                          ? 'bg-slate-800 text-white border-slate-800'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {t('refine.pregnantNo')}
                    </button>
                  </div>
                </div>

                {/* Income Taxpayer */}
                <div>
                  <label className="text-slate-600 block mb-1 font-medium">{t('refine.taxpayer')}</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setProfileField('incomeTaxPayer', profile.incomeTaxPayer === false ? undefined : false)}
                      className={`py-1.5 px-2 rounded-lg border text-center font-semibold transition-colors ${
                        profile.incomeTaxPayer === false
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {t('refine.taxpayerNo')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setProfileField('incomeTaxPayer', profile.incomeTaxPayer === true ? undefined : true)}
                      className={`py-1.5 px-2 rounded-lg border text-center font-semibold transition-colors ${
                        profile.incomeTaxPayer === true
                          ? 'bg-slate-800 text-white border-slate-800'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {t('refine.taxpayerYes')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMN B: YOUR SCHEMES (Col 5-7 on Desktop) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                B. Your Schemes
              </h3>
              <span className="text-xs font-bold text-slate-700">
                {displayEvaluations.length} total
              </span>
            </div>

            {/* Local Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search schemes or benefits..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-orange-500"
              />
            </div>

            {/* Verdict Tabs */}
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => setActiveTab('eligible')}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-between border transition-all ${
                  activeTab === 'eligible'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{t('status.eligible')}</span>
                </span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === 'eligible' ? 'bg-white/25 text-white' : 'bg-slate-200 text-slate-800'}`}>
                  {grouped.eligible.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('almost')}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-between border transition-all ${
                  activeTab === 'almost'
                    ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{t('status.almost')}</span>
                </span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === 'almost' ? 'bg-white/25 text-white' : 'bg-slate-200 text-slate-800'}`}>
                  {grouped.almost.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('possible')}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-between border transition-all ${
                  activeTab === 'possible'
                    ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>{t('status.possible')}</span>
                </span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === 'possible' ? 'bg-white/25 text-white' : 'bg-slate-200 text-slate-800'}`}>
                  {grouped.possible.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('not_eligible')}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-between border transition-all ${
                  activeTab === 'not_eligible'
                    ? 'bg-slate-800 text-white border-slate-800 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{t('status.not_eligible')}</span>
                </span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === 'not_eligible' ? 'bg-white/25 text-white' : 'bg-slate-200 text-slate-800'}`}>
                  {grouped.not_eligible.length}
                </span>
              </button>
            </div>
          </div>

          {/* Cards List */}
          <div className="space-y-3">
            {displayEvaluations.length === 0 ? (
              <div className="bg-white rounded-2xl p-6 text-center border border-slate-200">
                <p className="text-xs text-slate-500 font-medium">
                  No schemes in this group right now.
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Try answering the refine questions in Column A or switching tabs.
                </p>
              </div>
            ) : (
              displayEvaluations.map((evalItem) => {
                const sch = schemes.find((s) => s.slug === evalItem.slug);
                if (!sch) return null;
                return (
                  <SchemeCard
                    key={sch.slug}
                    scheme={sch}
                    evaluation={evalItem}
                    isSelected={selectedSlug === sch.slug}
                    onSelect={() => setSelectedSlug(sch.slug)}
                  />
                );
              })
            )}
          </div>
        </div>

        {/* COLUMN C: SCHEME DETAIL (Col 8-12 on Desktop) */}
        <div className="lg:col-span-4 sticky top-20">
          {selectedScheme && selectedEvaluation ? (
            <SchemeDetail
              scheme={selectedScheme}
              evaluation={selectedEvaluation}
            />
          ) : (
            <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 text-slate-400">
              <p className="text-xs font-semibold">Select a scheme from Column B to inspect required documents and application steps.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Scheme } from '../engine/types';
import { fetchCatalogue } from '../data/catalogue';
import { evaluateScheme } from '../engine/evaluate';
import { useProfileStore } from '../store/profile';
import { SchemeDetail } from '../components/SchemeDetail';
import { ArrowLeft, Sparkles } from 'lucide-react';

export const SchemePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { profile } = useProfileStore();

  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCatalogue().then((res) => {
      setSchemes(res.schemes);
      setLoading(false);
    });
  }, []);

  const scheme = schemes.find((s) => s.slug === slug);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!scheme) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Scheme not found</h2>
        <p className="text-xs text-slate-500">The scheme you are looking for does not exist in our catalog.</p>
        <Link to="/results" className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-xl text-xs font-bold">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Schemes</span>
        </Link>
      </div>
    );
  }

  const evaluation = evaluateScheme(scheme, profile) || {
    schemeId: scheme.id,
    slug: scheme.slug,
    verdict: 'possible',
    leaves: [],
    missingFields: [],
    failedRules: [],
    nearRules: [],
    relevanceScore: 50,
    scoreBreakdown: {
      matchStrength: 20,
      needFit: 12.5,
      benefitValue: 7.5,
      ease: 5,
      openness: 5,
      total: 50,
    },
  };

  const hasAnswers = Object.values(profile).some((val) => val !== undefined && val !== '');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        {!hasAnswers && (
          <Link
            to="/find"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-700 border border-orange-200 rounded-xl text-xs font-bold hover:bg-orange-100"
          >
            <Sparkles className="w-3.5 h-3.5 text-orange-600" />
            <span>Check My Eligibility</span>
          </Link>
        )}
      </div>

      <SchemeDetail scheme={scheme} evaluation={evaluation} />
    </div>
  );
};

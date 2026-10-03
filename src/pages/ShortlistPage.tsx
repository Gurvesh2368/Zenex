import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Scheme, SchemeDocument } from '../engine/types';
import { fetchCatalogue } from '../data/catalogue';
import { useAuthStore } from '../store/auth';
import { useProfileStore } from '../store/profile';
import { evaluateScheme } from '../engine/evaluate';
import {
  Bookmark,
  Printer,
  FileCheck2,
  Trash2,
  ExternalLink,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const ShortlistPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language as 'en' | 'hi' | 'mr') || 'en';

  const { shortlist, toggleShortlist, status } = useAuthStore();
  const { profile } = useProfileStore();

  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCatalogue().then((res) => {
      setSchemes(res.schemes);
      setLoading(false);
    });
  }, []);

  const savedSchemes = useMemo(() => {
    return schemes.filter(
      (s) => shortlist.includes(s.id) || shortlist.includes(s.slug)
    );
  }, [schemes, shortlist]);

  // Merge and de-duplicate documents across all saved schemes
  const mergedDocuments = useMemo(() => {
    const docMap = new Map<
      string,
      {
        name: string;
        hint?: string;
        mandatory: boolean;
        schemes: string[];
      }
    >();

    savedSchemes.forEach((sch) => {
      const schName = sch.name_i18n[lang] || sch.name_i18n.en || sch.slug;
      sch.scheme_documents?.forEach((doc) => {
        const docName = doc.name_i18n[lang] || doc.name_i18n.en;
        const key = docName.toLowerCase().trim();

        if (docMap.has(key)) {
          const existing = docMap.get(key)!;
          if (!existing.schemes.includes(schName)) {
            existing.schemes.push(schName);
          }
          if (doc.mandatory) {
            existing.mandatory = true;
          }
        } else {
          docMap.set(key, {
            name: docName,
            hint: doc.hint_i18n ? doc.hint_i18n[lang] || doc.hint_i18n.en : undefined,
            mandatory: doc.mandatory,
            schemes: [schName],
          });
        }
      });
    });

    return Array.from(docMap.values());
  }, [savedSchemes, lang]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <Bookmark className="w-6 h-6 text-orange-600" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {t('nav.shortlist')}
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {savedSchemes.length} schemes saved in your shortlist
          </p>
        </div>

        <div className="flex items-center gap-3">
          {savedSchemes.length > 0 && (
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print Merged Checklist</span>
            </button>
          )}

          {status !== 'authenticated' && (
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-orange-50 text-orange-700 hover:bg-orange-100 rounded-xl text-xs font-bold border border-orange-200"
            >
              <span>Sync with Email</span>
            </Link>
          )}
        </div>
      </div>

      {savedSchemes.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-4">
          <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center mx-auto">
            <Bookmark className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            No schemes saved yet
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Browse through your matched schemes and tap the bookmark star to save schemes for quick reference.
          </p>
          <Link
            to="/results"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl transition-colors"
          >
            <span>Explore Schemes</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Saved Schemes List (Col 1) */}
          <div className="lg:col-span-1 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Saved Schemes ({savedSchemes.length})
            </h3>

            <div className="space-y-2.5">
              {savedSchemes.map((sch) => {
                const schName = sch.name_i18n[lang] || sch.name_i18n.en || sch.slug;
                const evalResult = evaluateScheme(sch, profile);

                return (
                  <div
                    key={sch.id}
                    className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex-1">
                      <Link
                        to={`/scheme/${sch.slug}`}
                        className="font-bold text-slate-900 hover:text-orange-600 block line-clamp-1"
                      >
                        {schName}
                      </Link>
                      {evalResult && (
                        <span className="text-[10px] font-semibold text-emerald-700">
                          Status: {t(`status.${evalResult.verdict}`)}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => toggleShortlist(sch.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Remove from shortlist"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* COMBINED MERGED DOCUMENT CHECKLIST (Col 2-3) */}
          <div className="lg:col-span-2 print-sheet bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <FileCheck2 className="w-5 h-5 text-orange-600" />
                  <span>Consolidated Document Checklist</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Carry these papers to apply for all your saved schemes without duplicate visits.
                </p>
              </div>

              <span className="text-xs font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">
                {mergedDocuments.length} Documents
              </span>
            </div>

            <div className="space-y-3">
              {mergedDocuments.map((doc, index) => (
                <div
                  key={index}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex items-start gap-3 text-xs"
                >
                  <input
                    type="checkbox"
                    className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-900 text-sm">
                        {doc.name}
                      </span>
                      {doc.mandatory ? (
                        <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                          Mandatory
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-slate-500 bg-slate-200 px-1.5 py-0.2 rounded">
                          Alternative
                        </span>
                      )}
                    </div>

                    {doc.hint && (
                      <p className="text-slate-500 text-[11px] mt-0.5">
                        Where to get: {doc.hint}
                      </p>
                    )}

                    <div className="mt-1.5 flex items-center gap-1 flex-wrap text-[10px] text-slate-500">
                      <span>Needed for:</span>
                      {doc.schemes.map((sName) => (
                        <span
                          key={sName}
                          className="bg-white text-slate-700 font-medium px-1.5 py-0.5 rounded border border-slate-200"
                        >
                          {sName}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Print Footer note */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>Generated by Yojana Setu • Print date: {new Date().toLocaleDateString()}</span>
              <span>Zero personal answers stored on server</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

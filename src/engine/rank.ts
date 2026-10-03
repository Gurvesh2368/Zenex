import { LeafEvaluation, Scheme } from './types';

export interface ScoreBreakdown {
  matchStrength: number;
  needFit: number;
  benefitValue: number;
  ease: number;
  openness: number;
  total: number;
}

/**
 * Calculates deterministic relevance score (0-100) per TRD §7.
 */
export function calculateRelevanceScore(
  scheme: Scheme,
  leaves: LeafEvaluation[],
  userSelectedCategoryIds: string[] = []
): { totalScore: number; breakdown: ScoreBreakdown } {
  // 1. matchStrength (weight: 40)
  // pass = 1.0, near = 0.5, unknown = 0.25, fail = 0
  const totalLeaves = leaves.length || 1;
  const passCount = leaves.filter((l) => l.status === 'pass').length;
  const nearCount = leaves.filter((l) => l.status === 'near').length;
  const unknownCount = leaves.filter((l) => l.status === 'unknown').length;

  const matchStrengthRaw = (passCount * 1.0 + nearCount * 0.5 + unknownCount * 0.25) / totalLeaves;
  const matchStrength = Number((matchStrengthRaw * 40).toFixed(1));

  // 2. needFit (weight: 25)
  // 1 if category matches selected, 0.5 if no category filter applied, 0 if filtered out
  let needFitFactor = 0.5;
  if (userSelectedCategoryIds.length > 0) {
    needFitFactor = userSelectedCategoryIds.includes(scheme.category_id) ? 1.0 : 0.0;
  }
  const needFit = Number((needFitFactor * 25).toFixed(1));

  // 3. benefitValue (weight: 15)
  // benefit_tier 1..3 => (tier - 1) / 2
  const benefitTier = scheme.benefit_tier || 2;
  const benefitFactor = (benefitTier - 1) / 2;
  const benefitValue = Number((benefitFactor * 15).toFixed(1));

  // 4. ease (weight: 10)
  // ease 1..3 => (ease - 1) / 2
  const easeLevel = scheme.ease || 2;
  const easeFactor = (easeLevel - 1) / 2;
  const ease = Number((easeFactor * 10).toFixed(1));

  // 5. openness (weight: 10)
  // open = 1.0, unknown = 0.5, closed = 0
  let openFactor = 1.0;
  if (scheme.status === 'unknown') openFactor = 0.5;
  if (scheme.status === 'closed') openFactor = 0.0;
  const openness = Number((openFactor * 10).toFixed(1));

  const total = Math.min(100, Math.max(0, Math.round(matchStrength + needFit + benefitValue + ease + openness)));

  return {
    totalScore: total,
    breakdown: {
      matchStrength,
      needFit,
      benefitValue,
      ease,
      openness,
      total,
    },
  };
}

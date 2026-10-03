import { LeafEvaluation } from './types';

export interface ExplanationItem {
  ruleId: string;
  field: string;
  status: 'fail' | 'near' | 'pass' | 'unknown';
  reasonKey: string;
  fixKey?: string;
  params: Record<string, unknown>;
}

/**
 * Generates structured explanation objects that the UI translates into human language.
 */
export function explainLeaf(leaf: LeafEvaluation): ExplanationItem {
  const params: Record<string, unknown> = {
    field: leaf.field,
    value: leaf.actual ?? 'Not specified',
    limit: Array.isArray(leaf.expected) ? leaf.expected.join(' - ') : leaf.expected,
    gap: leaf.gap,
  };

  return {
    ruleId: leaf.id,
    field: leaf.field,
    status: leaf.status,
    reasonKey: leaf.reasonKey,
    fixKey: leaf.fixKey,
    params,
  };
}

/**
 * Explains all failed rules for a scheme.
 */
export function explainFailedRules(failedLeaves: LeafEvaluation[]): ExplanationItem[] {
  return failedLeaves.map((leaf) => explainLeaf(leaf));
}

/**
 * Explains near-miss rules for a scheme with actionable advice.
 */
export function explainNearMisses(nearLeaves: LeafEvaluation[]): ExplanationItem[] {
  return nearLeaves.map((leaf) => explainLeaf(leaf));
}

import {
  Field,
  LeafEvaluation,
  LeafRule,
  Profile,
  Rule,
  RuleStatus,
  Scheme,
  SchemeEvaluation,
  Verdict,
} from './types';
import { calculateRelevanceScore } from './rank';

/**
 * Checks if actual value satisfies operator and target value.
 * Inclusivity rule: <= and >= are inclusive (e.g., income 2.5 <= 2.5 is true).
 */
export function compare(actual: unknown, op: LeafRule['op'], target: unknown): boolean {
  if (actual === undefined || actual === null) return false;

  switch (op) {
    case 'eq':
      return actual === target;

    case 'neq':
      return actual !== target;

    case 'in':
      if (Array.isArray(target)) {
        return target.includes(actual as never);
      }
      return false;

    case 'nin':
      if (Array.isArray(target)) {
        return !target.includes(actual as never);
      }
      return true;

    case 'gte':
      return typeof actual === 'number' && typeof target === 'number' && actual >= target;

    case 'lte':
      return typeof actual === 'number' && typeof target === 'number' && actual <= target;

    case 'between':
      if (Array.isArray(target) && target.length === 2 && typeof actual === 'number') {
        const [min, max] = target;
        return actual >= min && actual <= max;
      }
      return false;

    case 'includes':
      if (Array.isArray(actual)) {
        return actual.includes(target as never);
      }
      return false;

    default:
      return false;
  }
}

/**
 * Evaluates whether an out-of-bounds numeric value falls within tolerance limits.
 * For lte cap L: actual <= L * (1 + pct) or actual <= L + abs
 * For gte floor F: actual >= F * (1 - pct) or actual >= F - abs
 * For between [min, max]: within tolerance of either bound
 */
export function isWithinTolerance(
  actual: unknown,
  leaf: LeafRule
): { within: boolean; gap?: number } {
  if (typeof actual !== 'number' || !leaf.tolerance) {
    return { within: false };
  }

  const { abs, pct } = leaf.tolerance;

  if (leaf.op === 'lte' && typeof leaf.value === 'number') {
    const limit = leaf.value;
    const maxAllowed = Math.max(
      abs !== undefined ? limit + abs : limit,
      pct !== undefined ? limit * (1 + pct) : limit
    );
    if (actual <= maxAllowed) {
      return { within: true, gap: Number((actual - limit).toFixed(2)) };
    }
  }

  if (leaf.op === 'gte' && typeof leaf.value === 'number') {
    const limit = leaf.value;
    const minAllowed = Math.min(
      abs !== undefined ? limit - abs : limit,
      pct !== undefined ? limit * (1 - pct) : limit
    );
    if (actual >= minAllowed) {
      return { within: true, gap: Number((limit - actual).toFixed(2)) };
    }
  }

  if (
    leaf.op === 'between' &&
    Array.isArray(leaf.value) &&
    leaf.value.length === 2
  ) {
    const [min, max] = leaf.value as [number, number];
    if (actual < min) {
      const minAllowed = Math.min(
        abs !== undefined ? min - abs : min,
        pct !== undefined ? min * (1 - pct) : min
      );
      if (actual >= minAllowed) {
        return { within: true, gap: Number((min - actual).toFixed(2)) };
      }
    } else if (actual > max) {
      const maxAllowed = Math.max(
        abs !== undefined ? max + abs : max,
        pct !== undefined ? max * (1 + pct) : max
      );
      if (actual <= maxAllowed) {
        return { within: true, gap: Number((actual - max).toFixed(2)) };
      }
    }
  }

  return { within: false };
}

/**
 * Evaluates a single leaf rule against the profile.
 */
export function evaluateLeaf(leaf: LeafRule, profile: Profile): LeafEvaluation {
  const actual = profile[leaf.field];

  if (actual === undefined || actual === null) {
    return {
      id: leaf.id,
      field: leaf.field,
      status: 'unknown',
      actual: undefined,
      expected: leaf.value,
      tolerance: leaf.tolerance,
      fixable: leaf.fixable,
      reasonKey: leaf.reasonKey,
      fixKey: leaf.fixKey,
    };
  }

  const passed = compare(actual, leaf.op, leaf.value);
  if (passed) {
    return {
      id: leaf.id,
      field: leaf.field,
      status: 'pass',
      actual,
      expected: leaf.value,
      tolerance: leaf.tolerance,
      fixable: leaf.fixable,
      reasonKey: leaf.reasonKey,
      fixKey: leaf.fixKey,
    };
  }

  // Check tolerance
  const tol = isWithinTolerance(actual, leaf);
  if (tol.within) {
    return {
      id: leaf.id,
      field: leaf.field,
      status: 'near',
      actual,
      expected: leaf.value,
      tolerance: leaf.tolerance,
      fixable: leaf.fixable,
      reasonKey: leaf.reasonKey,
      fixKey: leaf.fixKey,
      gap: tol.gap,
    };
  }

  // Check fixable (e.g., doesn't have bank account yet, easily openable)
  if (leaf.fixable) {
    return {
      id: leaf.id,
      field: leaf.field,
      status: 'near',
      actual,
      expected: leaf.value,
      tolerance: leaf.tolerance,
      fixable: true,
      reasonKey: leaf.reasonKey,
      fixKey: leaf.fixKey,
    };
  }

  return {
    id: leaf.id,
    field: leaf.field,
    status: 'fail',
    actual,
    expected: leaf.value,
    tolerance: leaf.tolerance,
    fixable: leaf.fixable,
    reasonKey: leaf.reasonKey,
    fixKey: leaf.fixKey,
  };
}

interface NodeResult {
  status: RuleStatus;
  leaves: LeafEvaluation[];
}

/**
 * Recursively evaluates node (leaf, all, any).
 */
export function evaluateNode(rule: Rule, profile: Profile): NodeResult {
  if ('field' in rule) {
    const leafEval = evaluateLeaf(rule, profile);
    return { status: leafEval.status, leaves: [leafEval] };
  }

  if ('all' in rule) {
    const childResults = rule.all.map((r) => evaluateNode(r, profile));
    const allLeaves = childResults.flatMap((c) => c.leaves);

    // all: fail if any child fail; else unknown if any unknown (and no fail); else near if any near; else pass
    if (childResults.some((c) => c.status === 'fail')) {
      return { status: 'fail', leaves: allLeaves };
    }
    if (childResults.some((c) => c.status === 'unknown')) {
      return { status: 'unknown', leaves: allLeaves };
    }
    if (childResults.some((c) => c.status === 'near')) {
      return { status: 'near', leaves: allLeaves };
    }
    return { status: 'pass', leaves: allLeaves };
  }

  if ('any' in rule) {
    const childResults = rule.any.map((r) => evaluateNode(r, profile));
    const allLeaves = childResults.flatMap((c) => c.leaves);

    // any: pass if any pass; else unknown if any unknown; else near if any near; else fail
    if (childResults.some((c) => c.status === 'pass')) {
      return { status: 'pass', leaves: allLeaves };
    }
    if (childResults.some((c) => c.status === 'unknown')) {
      return { status: 'unknown', leaves: allLeaves };
    }
    if (childResults.some((c) => c.status === 'near')) {
      return { status: 'near', leaves: allLeaves };
    }
    return { status: 'fail', leaves: allLeaves };
  }

  return { status: 'unknown', leaves: [] };
}

/**
 * Determine overall Scheme verdict from evaluation tree.
 */
export function determineVerdict(rootStatus: RuleStatus, nearCount: number): Verdict {
  if (rootStatus === 'pass') {
    return 'eligible';
  }
  if (rootStatus === 'near') {
    return nearCount <= 2 ? 'almost' : 'not_eligible';
  }
  if (rootStatus === 'unknown') {
    return 'possible';
  }
  return 'not_eligible';
}

/**
 * Evaluates a scheme for a profile.
 * Excludes state-specific schemes if profile.state does not match.
 */
export function evaluateScheme(
  scheme: Scheme,
  profile: Profile,
  userSelectedCategoryIds: string[] = []
): SchemeEvaluation | null {
  // Scope filter: scheme with state_code != profile.state (when state answered) is excluded entirely
  if (scheme.state_code && profile.state && scheme.state_code !== profile.state) {
    return null;
  }

  const { status: rootStatus, leaves } = evaluateNode(scheme.rules, profile);

  const failedRules = leaves.filter((l) => l.status === 'fail');
  const nearRules = leaves.filter((l) => l.status === 'near');
  const missingLeaves = leaves.filter((l) => l.status === 'unknown');

  const missingFields: Field[] = Array.from(new Set(missingLeaves.map((l) => l.field)));

  const verdict = determineVerdict(rootStatus, nearRules.length);

  const { totalScore, breakdown } = calculateRelevanceScore(
    scheme,
    leaves,
    userSelectedCategoryIds
  );

  return {
    schemeId: scheme.id,
    slug: scheme.slug,
    verdict,
    leaves,
    missingFields,
    failedRules,
    nearRules,
    relevanceScore: totalScore,
    scoreBreakdown: breakdown,
  };
}

/**
 * Evaluates all published schemes against a profile and returns grouped, sorted evaluations.
 */
export function evaluateAllSchemes(
  schemes: Scheme[],
  profile: Profile,
  userSelectedCategoryIds: string[] = []
): {
  evaluations: SchemeEvaluation[];
  grouped: Record<Verdict, SchemeEvaluation[]>;
} {
  const evaluations: SchemeEvaluation[] = [];

  for (const scheme of schemes) {
    if (!scheme.is_published) continue;
    const result = evaluateScheme(scheme, profile, userSelectedCategoryIds);
    if (result) {
      evaluations.push(result);
    }
  }

  // Verdict priority order: eligible > almost > possible > not_eligible
  const verdictWeight: Record<Verdict, number> = {
    eligible: 4,
    almost: 3,
    possible: 2,
    not_eligible: 1,
  };

  // Sort: group by verdict desc, then score desc, then slug asc (deterministic)
  evaluations.sort((a, b) => {
    if (verdictWeight[b.verdict] !== verdictWeight[a.verdict]) {
      return verdictWeight[b.verdict] - verdictWeight[a.verdict];
    }
    if (b.relevanceScore !== a.relevanceScore) {
      return b.relevanceScore - a.relevanceScore;
    }
    return a.slug.localeCompare(b.slug);
  });

  const grouped: Record<Verdict, SchemeEvaluation[]> = {
    eligible: evaluations.filter((e) => e.verdict === 'eligible'),
    almost: evaluations.filter((e) => e.verdict === 'almost'),
    possible: evaluations.filter((e) => e.verdict === 'possible'),
    not_eligible: evaluations.filter((e) => e.verdict === 'not_eligible'),
  };

  return { evaluations, grouped };
}

export type Field =
  | 'age'
  | 'gender'
  | 'state'
  | 'residence'
  | 'incomeLakh'
  | 'occupation'
  | 'category'
  | 'disability'
  | 'bpl'
  | 'landOwner'
  | 'housing'
  | 'hasBankAccount'
  | 'pregnantOrNursing'
  | 'daughterUnder10'
  | 'incomeTaxPayer';

export type Gender = 'female' | 'male' | 'other';
export type Residence = 'rural' | 'urban';
export type Occupation =
  | 'farmer'
  | 'student'
  | 'artisan'
  | 'street_vendor'
  | 'self_employed'
  | 'salaried'
  | 'unemployed'
  | 'homemaker'
  | 'retired';
export type SocialCategory = 'general' | 'obc' | 'sc' | 'st';
export type DisabilityLevel = 'none' | '40to79' | '80plus';
export type HousingType = 'pucca' | 'kutcha' | 'none';

export interface Profile {
  age?: number;
  gender?: Gender;
  state?: string;
  residence?: Residence;
  incomeLakh?: number; // annual household, ₹ lakh
  occupation?: Occupation[];
  category?: SocialCategory;
  disability?: DisabilityLevel;
  bpl?: 'yes' | 'no';
  landOwner?: boolean;
  housing?: HousingType;
  hasBankAccount?: boolean;
  pregnantOrNursing?: boolean;
  daughterUnder10?: boolean;
  incomeTaxPayer?: boolean;
}

export type Operator = 'eq' | 'neq' | 'in' | 'nin' | 'gte' | 'lte' | 'between' | 'includes';

export interface Tolerance {
  abs?: number;
  pct?: number; // e.g. 0.15 = 15%
}

export interface LeafRule {
  id: string;
  field: Field;
  op: Operator;
  value: unknown;
  tolerance?: Tolerance;
  fixable?: boolean;
  reasonKey: string;
  fixKey?: string;
}

export type Rule =
  | LeafRule
  | { any: Rule[] }
  | { all: Rule[] };

export type RuleStatus = 'pass' | 'near' | 'fail' | 'unknown';

export interface LeafEvaluation {
  id: string;
  field: Field;
  status: RuleStatus;
  actual: unknown;
  expected: unknown;
  tolerance?: Tolerance;
  fixable?: boolean;
  reasonKey: string;
  fixKey?: string;
  gap?: number | string;
}

export type Verdict = 'eligible' | 'almost' | 'possible' | 'not_eligible';

export interface SchemeEvaluation {
  schemeId: string;
  slug: string;
  verdict: Verdict;
  leaves: LeafEvaluation[];
  missingFields: Field[];
  failedRules: LeafEvaluation[];
  nearRules: LeafEvaluation[];
  relevanceScore: number;
  scoreBreakdown: {
    matchStrength: number;
    needFit: number;
    benefitValue: number;
    ease: number;
    openness: number;
    total: number;
  };
}

export interface Category {
  id: string;
  pillar: 'justice' | 'liberty' | 'equality' | 'fraternity';
  name_i18n: Record<string, string>;
}

export interface SchemeDocument {
  id: string;
  scheme_id?: string;
  sort: number;
  mandatory: boolean;
  alt_group?: string | null;
  name_i18n: Record<string, string>;
  hint_i18n?: Record<string, string> | null;
}

export interface SchemeStep {
  id: string;
  scheme_id?: string;
  sort: number;
  text_i18n: Record<string, string>;
}

export interface Scheme {
  id: string;
  slug: string;
  level: 'central' | 'state';
  state_code?: string | null;
  category_id: string;
  category?: Category;
  name_i18n: Record<string, string>;
  summary_i18n: Record<string, string>;
  benefit_i18n: Record<string, string>;
  benefit_tier: 1 | 2 | 3;
  ease: 1 | 2 | 3;
  status: 'open' | 'closed' | 'unknown';
  apply_url: string;
  source_url: string;
  last_verified: string;
  rules: Rule;
  articles?: string[];
  is_published: boolean;
  scheme_documents?: SchemeDocument[];
  scheme_steps?: SchemeStep[];
}

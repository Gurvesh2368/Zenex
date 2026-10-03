import { describe, it, expect } from 'vitest';
import { evaluateScheme, evaluateAllSchemes, compare, isWithinTolerance } from '../evaluate';
import { Scheme, Profile } from '../types';

const testSchemes: Scheme[] = [
  {
    id: 's-kisan',
    slug: 'pm-kisan',
    level: 'central',
    category_id: 'agriculture',
    name_i18n: { en: 'PM-KISAN' },
    summary_i18n: { en: 'Farmer income support' },
    benefit_i18n: { en: '₹6,000/year' },
    benefit_tier: 2,
    ease: 3,
    status: 'open',
    apply_url: 'https://pmkisan.gov.in',
    source_url: 'https://pmkisan.gov.in',
    last_verified: '2026-09-15',
    is_published: true,
    rules: {
      all: [
        { id: 'occ', field: 'occupation', op: 'includes', value: 'farmer', reasonKey: 'r.needFarmer' },
        { id: 'land', field: 'landOwner', op: 'eq', value: true, reasonKey: 'r.needLand' },
        { id: 'tax', field: 'incomeTaxPayer', op: 'eq', value: false, reasonKey: 'r.noTaxpayer' },
      ],
    },
  },
  {
    id: 's-sc',
    slug: 'post-matric-sc',
    level: 'central',
    category_id: 'education',
    name_i18n: { en: 'Post-Matric SC' },
    summary_i18n: { en: 'Scholarship for SC' },
    benefit_i18n: { en: 'Tuition fees waiver' },
    benefit_tier: 3,
    ease: 2,
    status: 'open',
    apply_url: 'https://scholarships.gov.in',
    source_url: 'https://scholarships.gov.in',
    last_verified: '2026-08-18',
    is_published: true,
    rules: {
      all: [
        { id: 'occ', field: 'occupation', op: 'includes', value: 'student', reasonKey: 'r.needStudent' },
        { id: 'cat', field: 'category', op: 'eq', value: 'sc', reasonKey: 'r.needSC' },
        { id: 'inc', field: 'incomeLakh', op: 'lte', value: 2.5, tolerance: { pct: 0.15 }, reasonKey: 'r.incomeMax25' },
      ],
    },
  },
  {
    id: 's-oldage',
    slug: 'ignoaps-old-age',
    level: 'central',
    category_id: 'pension',
    name_i18n: { en: 'Old Age Pension' },
    summary_i18n: { en: 'Pension for 60+' },
    benefit_i18n: { en: 'Monthly pension' },
    benefit_tier: 2,
    ease: 2,
    status: 'open',
    apply_url: 'https://nsap.nic.in',
    source_url: 'https://nsap.nic.in',
    last_verified: '2026-08-15',
    is_published: true,
    rules: {
      all: [
        { id: 'age', field: 'age', op: 'gte', value: 60, tolerance: { abs: 2 }, reasonKey: 'r.needAge60' },
        { id: 'bpl', field: 'bpl', op: 'eq', value: 'yes', reasonKey: 'r.needBpl' },
      ],
    },
  },
];

describe('Rules Engine & Boundary Tests', () => {
  it('correctly compares operators including boundaries (inclusive <= and >=)', () => {
    expect(compare(2.5, 'lte', 2.5)).toBe(true);
    expect(compare(2.6, 'lte', 2.5)).toBe(false);
    expect(compare(60, 'gte', 60)).toBe(true);
    expect(compare(59, 'gte', 60)).toBe(false);
    expect(compare(['farmer', 'student'], 'includes', 'farmer')).toBe(true);
    expect(compare(['artisan'], 'includes', 'farmer')).toBe(false);
  });

  it('correctly calculates percentage and absolute tolerance', () => {
    // 2.5 cap with 15% tolerance max allowed = 2.875
    const tolPct = isWithinTolerance(2.7, {
      id: 'inc',
      field: 'incomeLakh',
      op: 'lte',
      value: 2.5,
      tolerance: { pct: 0.15 },
      reasonKey: 'r.inc',
    });
    expect(tolPct.within).toBe(true);
    expect(tolPct.gap).toBe(0.2);

    // 60 floor with abs 2 tolerance min allowed = 58
    const tolAbs = isWithinTolerance(59, {
      id: 'age',
      field: 'age',
      op: 'gte',
      value: 60,
      tolerance: { abs: 2 },
      reasonKey: 'r.age',
    });
    expect(tolAbs.within).toBe(true);
    expect(tolAbs.gap).toBe(1);
  });

  it('Persona P1: Ramesh (45, farmer, owns land, non-taxpayer) is eligible for PM-KISAN', () => {
    const ramesh: Profile = {
      age: 45,
      gender: 'male',
      state: 'MH',
      residence: 'rural',
      incomeLakh: 1.8,
      occupation: ['farmer'],
      landOwner: true,
      incomeTaxPayer: false,
    };

    const res = evaluateScheme(testSchemes[0], ramesh);
    expect(res).not.toBeNull();
    expect(res?.verdict).toBe('eligible');
    expect(res?.failedRules.length).toBe(0);
  });

  it('Persona P3: Aman (19, student, SC, income 2.7L with cap 2.5L) is almost eligible', () => {
    const aman: Profile = {
      age: 19,
      gender: 'male',
      occupation: ['student'],
      category: 'sc',
      incomeLakh: 2.7, // 2.7 <= 2.5*(1+0.15)=2.875 -> near
    };

    const res = evaluateScheme(testSchemes[1], aman);
    expect(res?.verdict).toBe('almost');
    expect(res?.nearRules.length).toBe(1);
    expect(res?.nearRules[0].gap).toBe(0.2);
  });

  it('Persona P4: Lakshmi (59, BPL) is almost eligible for Old Age Pension (within 2 years)', () => {
    const lakshmi: Profile = {
      age: 59,
      gender: 'female',
      residence: 'rural',
      bpl: 'yes',
    };

    const res = evaluateScheme(testSchemes[2], lakshmi);
    expect(res?.verdict).toBe('almost');
    expect(res?.nearRules.length).toBe(1);
    expect(res?.nearRules[0].gap).toBe(1);
  });

  it('Deterministic sorting: evaluateAllSchemes returns consistent ordering and groups', () => {
    const profile: Profile = {
      age: 45,
      occupation: ['farmer'],
      landOwner: true,
      incomeTaxPayer: false,
    };

    const result1 = evaluateAllSchemes(testSchemes, profile);
    const result2 = evaluateAllSchemes(testSchemes, profile);

    expect(result1.evaluations.map((e) => e.slug)).toEqual(result2.evaluations.map((e) => e.slug));
    expect(result1.grouped.eligible[0].slug).toBe('pm-kisan');
  });
});

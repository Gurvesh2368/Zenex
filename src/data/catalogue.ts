import { Scheme } from '../engine/types';
import { supabase } from '../lib/supabase';

let memoryCache: Scheme[] | null = null;
let lastSource: 'supabase' | 'fallback' = 'fallback';

export async function fetchCatalogue(): Promise<{
  schemes: Scheme[];
  source: 'supabase' | 'fallback';
  lastVerified: string;
}> {
  if (memoryCache && memoryCache.length > 0) {
    const maxVerified = getMaxVerifiedDate(memoryCache);
    return { schemes: memoryCache, source: lastSource, lastVerified: maxVerified };
  }

  // Attempt Supabase fetch if client exists
  if (supabase) {
    try {
      const fetchPromise = supabase
        .from('schemes')
        .select(`
          *,
          category:categories(*),
          scheme_documents(*),
          scheme_steps(*)
        `)
        .eq('is_published', true);

      // 3 second timeout for network resilience
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Supabase fetch timeout')), 3000)
      );

      const res = (await Promise.race([fetchPromise, timeoutPromise])) as {
        data: Scheme[] | null;
        error: unknown;
      };

      if (!res.error && res.data && res.data.length > 0) {
        memoryCache = res.data;
        lastSource = 'supabase';
        return {
          schemes: memoryCache,
          source: 'supabase',
          lastVerified: getMaxVerifiedDate(memoryCache),
        };
      }
    } catch {
      // Quietly fall back to bundled offline JSON on error or timeout
    }
  }

  // Fallback to local bundled JSON
  try {
    const resp = await fetch('/schemes.fallback.json');
    if (resp.ok) {
      const data = (await resp.json()) as Scheme[];
      memoryCache = data;
      lastSource = 'fallback';
      return {
        schemes: data,
        source: 'fallback',
        lastVerified: getMaxVerifiedDate(data),
      };
    }
  } catch (err) {
    console.error('Failed to load fallback schemes:', err);
  }

  return { schemes: [], source: 'fallback', lastVerified: '2026-09-15' };
}

function getMaxVerifiedDate(schemes: Scheme[]): string {
  if (!schemes || schemes.length === 0) return '2026-09-15';
  const dates = schemes.map((s) => s.last_verified).filter(Boolean);
  if (dates.length === 0) return '2026-09-15';
  return dates.reduce((latest, current) => (current > latest ? current : latest), dates[0]);
}

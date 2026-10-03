import { create } from 'zustand';
import { Profile } from '../engine/types';

export type PillarId = 'justice' | 'liberty' | 'equality' | 'fraternity';

interface ProfileState {
  profile: Profile;
  hasStarted: boolean;
  selectedPillars: PillarId[];
  consentAccepted: boolean;
  searchQuery: string;

  // Actions
  setProfileField: <K extends keyof Profile>(field: K, value: Profile[K]) => void;
  updateProfile: (partial: Partial<Profile>) => void;
  resetProfile: () => void;
  setHasStarted: (val: boolean) => void;
  togglePillar: (pillar: PillarId) => void;
  clearPillars: () => void;
  setConsentAccepted: (val: boolean) => void;
  setSearchQuery: (query: string) => void;
}

const initialProfile: Profile = {};

export const useProfileStore = create<ProfileState>((set) => ({
  profile: initialProfile,
  hasStarted: false,
  selectedPillars: [],
  consentAccepted: false,
  searchQuery: '',

  setProfileField: (field, value) =>
    set((state) => ({
      profile: {
        ...state.profile,
        [field]: value,
      },
    })),

  updateProfile: (partial) =>
    set((state) => ({
      profile: {
        ...state.profile,
        ...partial,
      },
    })),

  resetProfile: () =>
    set({
      profile: {},
      hasStarted: false,
      selectedPillars: [],
      searchQuery: '',
    }),

  setHasStarted: (hasStarted) => set({ hasStarted }),

  togglePillar: (pillar) =>
    set((state) => {
      const exists = state.selectedPillars.includes(pillar);
      return {
        selectedPillars: exists
          ? state.selectedPillars.filter((p) => p !== pillar)
          : [...state.selectedPillars, pillar],
      };
    }),

  clearPillars: () => set({ selectedPillars: [] }),

  setConsentAccepted: (consentAccepted) => set({ consentAccepted }),

  setSearchQuery: (searchQuery) => set({ searchQuery }),
}));

// Privacy safeguard: clear answers on tab pagehide / unload
if (typeof window !== 'undefined') {
  window.addEventListener('pagehide', () => {
    useProfileStore.getState().resetProfile();
  });
}

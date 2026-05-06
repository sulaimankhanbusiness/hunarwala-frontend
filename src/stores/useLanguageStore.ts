import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Lang = 'en' | 'ur';

interface LanguageStore {
  lang: Lang;
  toggle: () => void;
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set, get) => ({
      lang: 'en',
      toggle: () => set({ lang: get().lang === 'en' ? 'ur' : 'en' }),
    }),
    { name: 'hw-lang' }
  )
);

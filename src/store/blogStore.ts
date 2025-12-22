import { create } from 'zustand';

type Theme = 'light' | 'dark';
type Language = 'en' | 'zh';

type BlogState = {
  theme: Theme;
  language: Language;
  query: string;
  setTheme: (theme: Theme) => void;
  setLanguage: (language: Language) => void;
  setQuery: (query: string) => void;
};

export const useBlogStore = create<BlogState>((set) => ({
  theme: 'light',
  language: 'en',
  query: '',
  setTheme: (theme) => set({ theme }),
  setLanguage: (language) => set({ language }),
  setQuery: (query) => set({ query }),
}));

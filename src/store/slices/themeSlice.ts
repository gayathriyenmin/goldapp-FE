import { create } from 'zustand';
import { getStorage, setStorage } from '../../utils/localStorage';

interface ThemeState {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

const getInitialTheme = (): 'light' | 'dark' => {
  const saved = getStorage<string>('theme');
  if (saved === 'light' || saved === 'dark') return saved;
  // default to dark, or system preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light';
  }
  return 'dark';
};

export const useThemeStore = create<ThemeState>((set) => ({
  theme: getInitialTheme(),
  toggleTheme: () => {
    set((state) => {
      const nextTheme = state.theme === 'light' ? 'dark' : 'light';
      setStorage('theme', nextTheme);
      return { theme: nextTheme };
    });
  },
  setTheme: (theme) => {
    setStorage('theme', theme);
    set({ theme });
  },
}));

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { secureStorage } from '@/shared/lib/storage';
import { haptic } from '@/shared/utils/haptics';

export type ThemeMode = 'pink' | 'mono';

export interface ThemePalette {
  background: string;
  card: string;
  cardHover: string;
  border: string;
  primary: string;
  primaryForeground: string;
  primaryLight: string;
  primaryDark: string;
  primaryGlow: string;
  primarySubtle: string;
  primaryBorder: string;
  foreground: string;
  muted: string;
  mutedForeground: string;
  success: string;
  danger: string;
  warning: string;
}

export const themes: Record<ThemeMode, ThemePalette> = {
  pink: {
    background: '#000000',
    card: '#09090C',
    cardHover: '#141418',
    border: '#261426',
    primary: '#FF007F', // Rosa muito forte / Neon Hot Pink
    primaryForeground: '#FFFFFF',
    primaryLight: '#FF3399',
    primaryDark: '#D6006B',
    primaryGlow: 'rgba(255, 0, 127, 0.35)',
    primarySubtle: 'rgba(255, 0, 127, 0.14)',
    primaryBorder: 'rgba(255, 0, 127, 0.35)',
    foreground: '#FFFFFF',
    muted: '#A1A1AA',
    mutedForeground: '#71717A',
    success: '#10B981',
    danger: '#FF1744',
    warning: '#FFB300',
  },
  mono: {
    background: '#000000',
    card: '#0A0A0A',
    cardHover: '#181818',
    border: '#272727',
    primary: '#FFFFFF', // Modo Preto e Branco
    primaryForeground: '#000000',
    primaryLight: '#F4F4F5',
    primaryDark: '#E4E4E7',
    primaryGlow: 'rgba(255, 255, 255, 0.35)',
    primarySubtle: 'rgba(255, 255, 255, 0.14)',
    primaryBorder: 'rgba(255, 255, 255, 0.35)',
    foreground: '#FFFFFF',
    muted: '#A1A1AA',
    mutedForeground: '#71717A',
    success: '#FFFFFF',
    danger: '#EF4444',
    warning: '#F59E0B',
  },
};

interface ThemeState {
  mode: ThemeMode;
  colors: ThemePalette;
  toggleTheme: () => void;
  setMode: (mode: ThemeMode) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: 'pink',
      colors: themes.pink,

      toggleTheme: () => {
        haptic.selection();
        const nextMode: ThemeMode = get().mode === 'pink' ? 'mono' : 'pink';
        set({
          mode: nextMode,
          colors: themes[nextMode],
        });
      },

      setMode: (mode: ThemeMode) => {
        set({
          mode,
          colors: themes[mode],
        });
      },
    }),
    {
      name: 'agregador_theme_mode',
      storage: createJSONStorage(() => secureStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.colors = themes[state.mode || 'pink'];
        }
      },
    }
  )
);

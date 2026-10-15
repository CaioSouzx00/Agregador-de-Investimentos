export const colors = {
  background: '#0B1120',
  card: '#111827',
  cardHover: '#1F2937',
  border: '#1F2937',
  primary: {
    DEFAULT: '#3B82F6',
    foreground: '#FFFFFF',
    light: '#60A5FA',
    dark: '#2563EB',
  },
  success: '#10B981',
  danger: '#EF4444',
  warning: '#F59E0B',
  muted: {
    DEFAULT: '#94A3B8',
    foreground: '#64748B',
  },
  foreground: '#F8FAFC',
} as const;

export type ThemeColors = typeof colors;

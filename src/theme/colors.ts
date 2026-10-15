export const colors = {
  background: '#000000',
  card: '#09090C',
  cardHover: '#141418',
  border: '#261426',
  primary: {
    DEFAULT: '#FF007F', // Rosa muito forte
    foreground: '#FFFFFF',
    light: '#FF3399',
    dark: '#D6006B',
  },
  success: '#10B981',
  danger: '#FF1744',
  warning: '#FFB300',
  muted: {
    DEFAULT: '#A1A1AA',
    foreground: '#71717A',
  },
  foreground: '#FFFFFF',
} as const;

export type ThemeColors = typeof colors;

import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        ink: '#07110f',
        panel: '#0c1916',
        mint: '#55e6b1',
      },
      fontFamily: { sans: ['Arial', 'sans-serif'] },
    },
  },
  plugins: [],
};

export default config;

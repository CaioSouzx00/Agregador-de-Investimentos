/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "#000000",
        card: "#09090C",
        "card-hover": "#141418",
        border: "#261426",
        primary: {
          DEFAULT: "#FF007F",
          foreground: "#FFFFFF",
          light: "#FF3399",
          dark: "#D6006B",
        },
        success: "#10B981",
        danger: "#FF1744",
        warning: "#FFB300",
        muted: {
          DEFAULT: "#A1A1AA",
          foreground: "#71717A",
        },
        foreground: "#FFFFFF",
      },
    },
  },
  plugins: [],
};

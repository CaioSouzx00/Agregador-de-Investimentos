/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "#0B1120",
        card: "#111827",
        "card-hover": "#1F2937",
        border: "#1F2937",
        primary: {
          DEFAULT: "#3B82F6",
          foreground: "#FFFFFF",
        },
        success: "#10B981",
        danger: "#EF4444",
        warning: "#F59E0B",
        muted: {
          DEFAULT: "#94A3B8",
          foreground: "#64748B",
        },
        foreground: "#F8FAFC",
      },
    },
  },
  plugins: [],
};

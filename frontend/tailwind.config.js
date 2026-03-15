/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./utils/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#eeeaf8",
        "bg-deep": "#dbd4f5",
        surface: "rgba(255,255,255,0.72)",
        "surface-solid": "#f5f3ff",
        accent: "#5b5bd6",
        "accent-light": "#7c7cf0",
        danger: "#e53e3e",
        warning: "#dd6b20",
        success: "#38a169",
        "text-primary": "#1a1a3e",
        "text-muted": "#6b6b8f",
        border: "rgba(91,91,214,0.15)",
        "border-solid": "#d8d3f0",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        serif: ["Playfair Display", "Georgia", "serif"],
        mono: ["JetBrains Mono", "Consolas", "monospace"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "hero-glow":
          "radial-gradient(ellipse 90% 80% at 50% 10%, #c8c3f0 0%, #ddd8f8 30%, #eeeaf8 70%, transparent 100%)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow": "spin 8s linear infinite",
        "float": "float-blob 12s ease-in-out infinite",
      },
      boxShadow: {
        "glow-accent": "0 0 20px rgba(91,91,214,0.35)",
        "glow-danger": "0 0 20px rgba(229,62,62,0.35)",
        "glow-success": "0 0 20px rgba(56,161,105,0.35)",
        "card": "0 4px 32px rgba(91,91,214,0.08), 0 1px 4px rgba(0,0,0,0.04)",
        "navbar": "0 2px 24px rgba(91,91,214,0.08)",
      },
    },
  },
  plugins: [],
};

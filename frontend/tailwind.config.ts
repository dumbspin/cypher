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
          bg: "#121212",
          surface: "#1c1c1c",
          surface2: "#262626",
          surface3: "#333333",
          accent: "#fca311",
          danger: "#FF4C4C",
          warning: "#fca311",
          success: "#00C853",
          purple: "#7B61FF",
          text: "#ffffff",
          muted: "#e5e5e5",
          border: "rgba(229, 229, 229, 0.15)",
          border2: "rgba(229, 229, 229, 0.3)",
          "accent-dim": "rgba(252, 163, 17, 0.10)",
          "danger-dim": "rgba(255, 76, 76, 0.10)",
          "warning-dim": "rgba(252, 163, 17, 0.10)",
          "success-dim": "rgba(0, 200, 83, 0.10)",
          "purple-dim": "rgba(123, 97, 255, 0.10)",
        },
      fontFamily: {
        sans: ["var(--font-roboto-mono)", "system-ui", "sans-serif"],
        mono: ["var(--font-roboto-mono)", "monospace"],
        serif: ["var(--font-playfair)", "serif"],
        display: ["var(--font-playfair)", "serif"],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "marquee": "marquee var(--duration) linear infinite",
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: "#103F25",
        botanical: "#175C32",
        burgundy: "#651C2B",
        cream: "#F4F0E5",
        ivory: "#FFFDF5",
        sage: "#DDE7D4",
        gold: "#B49A58",
        charcoal: "#283329",
        moss: "#6B7F5E",
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        script: ["var(--font-allura)", "cursive"],
      },
      letterSpacing: {
        editorial: "0.28em",
        wide2: "0.18em",
      },
      opacity: {
        4: "0.04",
        6: "0.06",
        8: "0.08",
        12: "0.12",
        14: "0.14",
        16: "0.16",
        18: "0.18",
        22: "0.22",
        24: "0.24",
        28: "0.28",
        32: "0.32",
        38: "0.38",
        42: "0.42",
        48: "0.48",
        52: "0.52",
        58: "0.58",
        62: "0.62",
        68: "0.68",
        72: "0.72",
        78: "0.78",
        82: "0.82",
        88: "0.88",
        92: "0.92",
        96: "0.96",
        98: "0.98",
      },
      boxShadow: {
        soft: "0 18px 50px -24px rgba(16,63,37,0.35)",
        lift: "0 30px 70px -30px rgba(16,63,37,0.45)",
        gold: "0 0 0 1px rgba(180,154,88,0.45)",
      },
      transitionTimingFunction: {
        premium: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-14px) rotate(2deg)" },
        },
        drift: {
          "0%": { transform: "translate3d(0,0,0)" },
          "50%": { transform: "translate3d(14px,-20px,0)" },
          "100%": { transform: "translate3d(0,0,0)" },
        },
        sweep: {
          "0%": { transform: "translateX(-120%) skewX(-18deg)", opacity: "0" },
          "20%": { opacity: "0.7" },
          "100%": { transform: "translateX(220%) skewX(-18deg)", opacity: "0" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        float: "float 7s ease-in-out infinite",
        drift: "drift 16s ease-in-out infinite",
        sweep: "sweep 6s ease-in-out infinite",
        marquee: "marquee 32s linear infinite",
        shimmer: "shimmer 4s linear infinite",
        "fade-up": "fadeUp 0.8s cubic-bezier(0.22,1,0.36,1) both",
      },
    },
  },
  plugins: [],
};

export default config;

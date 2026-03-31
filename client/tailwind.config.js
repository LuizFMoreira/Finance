/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1C2F3A",
          50: "#E8EEF1",
          100: "#C5D4DC",
          200: "#9DBAC8",
          300: "#759FB4",
          400: "#4D85A0",
          500: "#1C2F3A",
          600: "#172733",
          700: "#121F2A",
          800: "#0D1720",
          900: "#080F17",
        },
        lavender: {
          DEFAULT: "#E6E1F9",
          light: "#F3F0FC",
          dark: "#C9C0F0",
        },
        gold: {
          DEFAULT: "#FFD700",
          light: "#FFE44D",
          dark: "#CCA800",
        },
        success: "#10B981",
        warning: "#F59E0B",
        danger: "#EF4444",
        info: "#3B82F6",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
        "card-hover": "0 4px 12px rgba(0,0,0,0.1), 0 12px 40px rgba(0,0,0,0.07)",
        glass: "0 8px 32px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.6)",
      },
      borderRadius: {
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      backgroundImage: {
        "sidebar-gradient": "linear-gradient(180deg, #1C2F3A 0%, #0f1e27 100%)",
        "gold-gradient": "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
        "ai-card": "linear-gradient(135deg, #1C2F3A 0%, #243b4a 50%, #1a3344 100%)",
      },
    },
  },
  plugins: [],
};

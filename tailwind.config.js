/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    screens: {
      sm: "576px",
      md: "768px",
      lg: "992px",
      xl: "1200px",
      "2xl": "1400px",
    },
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "water-droplet-pattern":
          "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9IiMwMDAiIHN0cm9rZT0iIzAwMDAiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjY29sb3I9InJlZCIgc3Ryb2tlLWxpbmVjY29sb3I9InJlc3RvcmUiIHN0cm9rZS1kYXNoYXJyYXk9IjMuMCIgZmlsbD0ibm9uZSIgZmlsbC1vcGFjaXR5PSIwLjI1IiBzdHJva2Utb3BhY2l0eT0iMC44IiBzdHJva2Utb3BhY2l0eT0iMCAuMCIgZmlsbC1saW5lY2xvb3I9InJlc3RvcmUiIHN0cm9rZS1vcGFjaXR5PSIxIiBzdHJva2Utd2lkdGg9IjMiIHN0cm9rZS1saW5lY2xvb3I9InJlc3RvcmUiIHN0cm9rZS1saW5lY2xvb3I9InJlc3RvcmUiIHN0cm9rZS1kYXNoYXJyYXk9IjAuMyIvPjxjaXJjbGUgY3g9IjEwIiBjeT0iMTAiIHI9IjEwIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1jb2xvcj0iYmxhY2siIC8+PC9zdmc+')",
        "red-stripes":
          "repeating-linear-gradient(260deg, #ff6b6b 0px, #ff6b6b 10px,transparent 10px,transparent 20px)",
        "green-stripes":
          "repeating-linear-gradient(135deg, #00E396 0px, #00E396 4px, #ffffff 4px, #ffffff 8px)",
      },
      scrollbarWidth: {
        1: "1px", // Custom width for scrollbar
      },
      scrollbarColor: {
        track: "#4CA858", // Track color
        thumb: "#888", // Thumb color
      },
      colors: {
        "z-green": {
          100: "#F8FDF8",
          200: "#F4FBF5",
          300: "#E6F3E8",
          400: "#A5D3AC",
          500: "#4CA858",
        },
        "z-blue": {
          100: "#F2F7FD",
          200: "#CCE3F7",
          300: "#0075DB",
          400: "#005096",
          500: "#003E75",
        },
        "z-gray": {
          100: "#F2F2F2",
          200: "#E5E5E5",
          300: "#575757",
          400: "#4C585B",
        },
        "z-br-lg-gray": "#EFEFEF",
        "z-br-gray": "#DCDCDC",
        "z-br-blue": "#DCD5FF",
        "z-br-blur": "#ffffff01",
        "z-br-ltp-gray": "#808080",
        "z-br-vwap-yellow": "#ffc40c",
        "z-orange-oi": "#F89880",
        "z-vwap": "#FFFD37",
        "z-pcr": "#FFA500",
        "z-maxpain": "#008000",
        "z-green-scale": {
          100: "#86EFAC",
          200: " #7EE07C",
          300: " #3FC269",
          400: "  #34B24D",
          500: " #22C55E",
          600: " #34B24D",
          700: " #1D9C4A",
          800: "#178337",
          900: "#16A34A",
          1000: "#15803D",
        },
        "z-red-scale": {
          100: "#FECACA",
          200: "#F5A0A0",
          300: "#F87171",
          400: "#EC4C4C",
          500: "#EF4444",
          600: "#DC1C1C",
          700: "#DC2626",
          800: "#B71B1B",
          900: "#B91C1C",
          1000: "#B91C1C",
        },
      },
      boxShadow: {
        "strong-top":
          "rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px", // Top shadow emphasized
        "strong-card":
          "0px -25px 20px -20px rgba(0, 0, 0, 0.25), 0px 25px 20px -20px rgba(0, 0, 0, 0.25)",
        "top-bottom":
          "0 -4px 6px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.1)",
      },

      keyframes: {
        slideDown: {
          "0%": { transform: "translateY(-100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(0)", opacity: "1" },
          "100%": { transform: "translateY(-100%)", opacity: "0" },
        },
        chainLoading: {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.5)", opacity: "0.5" },
        },
        wave: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-0.5rem)" },
        },
        movedown: {
          "0%": { transform: "translateY(-25px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        coinRotate: {
          "0%": { transform: "rotateY(0deg) rotateX(0deg)" },
          "100%": { transform: "rotateY(360deg) rotateX(0deg)" },
        },
      },
      animation: {
        chainLoading: "chainLoading 0.8s ease-in-out infinite",
        wave: "wave 0.8s ease-in-out infinite",
        slideDown: "slideDown 0.5s ease-in-out",
        slideUp: "slideUp 0.5s ease-in-out",
        movedown: "movedown 0.3s ease forwards",
        coinRotate: "coinRotate 0.8s linear 1.5",
      },

      spacing: {
        3: "0.75rem",
        "custom-top": "calc(60% + 1.5rem + 1rem + 7%)",
      },
      fontWeight: {
        heading: 420,
        table: 430,
        tableHead: 550,
        letter: 400,
        formHead: 380,
      },
      fontSize: {
        global: "0.85rem",
        standard: "0.75rem",
      },
    },
  },

  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        ".writing-vertical-rl": {
          "writing-mode": "vertical-lr",
          transform: "rotate(180deg)",
        },
        ".text-mixed": {
          "text-orientation": "text-mixed",
        },
        ".delay-0": {
          animationDelay: "0s",
        },
        ".delay-200": {
          animationDelay: "0.2s",
        },
        ".delay-400": {
          animationDelay: "0.4s",
        },
        ".delay-600": {
          animationDelay: "0.6s",
        },

        ".no-highlight": {
          "-webkit-tap-highlight-color": "transparent",
          "touch-action": "manipulation",
          "user-select": "none",
          "-webkit-user-select": "none",
          "-webkit-touch-callout": "none",
        },
        ".no-active": {
          "-webkit-tap-highlight-color": "transparent",
          "&:active": {
            background: "transparent",
          },
        },
      };

      addUtilities(newUtilities, ["responsive", "hover"]);
    },
    require("tailwind-scrollbar")({ preferredStrategy: "pseudoelements" }),
  ],
};

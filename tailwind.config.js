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
        "red-stripes":
          "repeating-linear-gradient(260deg,#ff6b6b 0px,#ff6b6b 10px,transparent 10px,transparent 20px)",
        "green-stripes":
          "repeating-linear-gradient(135deg,#00E396 0px,#00E396 4px,#ffffff 4px,#ffffff 8px)",
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
        wave: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-0.5rem)" },
        },
      },

      animation: {
        slideDown: "slideDown 0.5s ease-in-out",
        slideUp: "slideUp 0.5s ease-in-out",
        wave: "wave 0.8s ease-in-out infinite",
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
          writingMode: "vertical-lr",
          transform: "rotate(180deg)",
        },
        ".text-mixed": {
          textOrientation: "mixed",
        },
        ".delay-200": {
          animationDelay: "0.2s",
        },
        ".delay-400": {
          animationDelay: "0.4s",
        },
      };

      addUtilities(newUtilities, ["responsive", "hover"]);
    },
  ],
};

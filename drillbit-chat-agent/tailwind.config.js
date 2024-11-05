module.exports = {
  extend: {
    animation: {
      "neon-pulse": "neon-pulse 1s ease-in-out infinite alternate",
      fadeIn: "fadeIn 0.5s ease-out",
    },
    keyframes: {
      fadeIn: {
        "0%": {opacity: 0, transform: "translateY(20px)"},
        "100%": {opacity: 1, transform: "translateY(0)"},
      },
      "neon-pulse": {
        "0%, 100%": {
          textShadow:
            "0 0 7px #fff, 0 0 10px #fff, 0 0 21px #fff, 0 0 42px #0fa, 0 0 82px #0fa, 0 0 92px #0fa, 0 0 102px #0fa, 0 0 151px #0fa",
        },
        "50%": {
          textShadow:
            "0 0 4px #fff, 0 0 7px #fff, 0 0 15px #fff, 0 0 30px #0fa, 0 0 60px #0fa, 0 0 70px #0fa, 0 0 80px #0fa, 0 0 100px #0fa",
        },
      },
    },
  },
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
    },
    fontFamily: {
      dmSans: ["DM Sans"],
      coiny: ["Coiny"],
    },
  },
  plugins: [],
};

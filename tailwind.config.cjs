// tailwind.config.cjs
const withOpacity = (varName) => ({ opacityValue }) =>
  opacityValue ? `rgba(var(${varName}), ${opacityValue})` : `rgb(var(${varName}))`;

module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: withOpacity("--primary-color-500"),
        "primary-100": withOpacity("--primary-color-100"),
        secondary: withOpacity("--secondary-color-500"),
        accent: withOpacity("--accent-color-500"),
        background: withOpacity("--background-color"),
        card: withOpacity("--card-color"),
      },
      spacing: {
        '9': '2.25rem'
      },
      borderRadius: {
        xl: '1rem',
      }
    },
  },
  plugins: [],
};
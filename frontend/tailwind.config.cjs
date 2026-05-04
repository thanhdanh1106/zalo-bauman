module.exports = {
  darkMode: ["selector", '[zaui-theme="dark"]'],
  content: ["./src/**/*.{js,jsx,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        primary: "#B32025", 
        secondary: "#D4AF37", 
        tertiary: "#FDF9F0",
        neutral: "#1A1A1A",
        background: "#FCF9F8",
        surface: "#FCF9F8",
        "on-surface": "#1C1B1B",
        "surface-container-low": "#F6F3F2",
        "surface-container-high": "#EAE7E7",
        "surface-container-highest": "#E5E2E1",
        "surface-variant": "#E5E2E1",
        "on-surface-variant": "#5A403E",
        "secondary-container": "#FED65B",
        "on-secondary-container": "#745C00",
      },
      fontFamily: {
        sans: ["Be Vietnam Pro", "sans-serif"],
        serif: ["Plus Jakarta Sans", "serif"],
        display: ["Plus Jakarta Sans", "sans-serif"],
      },
      spacing: {
        "stack-sm": "8px",
        "stack-md": "16px",
        "margin-main": "16px",
        "gutter-grid": "12px",
        "stack-lg": "24px",
      },
    },
  },
};

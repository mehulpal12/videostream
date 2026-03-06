/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          bg: "#050505",
          surface: "#0f1115",
          accent: "#2563eb", // Blue
          card: "#161b22",
          textMuted: "#94a3b8",
        },
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(to bottom right, #1e3a8a, #581c87)',
      }
    },
  },
}
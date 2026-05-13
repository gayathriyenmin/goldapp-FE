/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#D4AF37",
          dark: "#B8860B",
        },
        background: "#0F172A",
        card: "#1E293B",
        accent: "#FACC15",
        success: "#22C55E",
        danger: "#EF4444",
        text: {
          light: "#F8FAFC",
        }
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

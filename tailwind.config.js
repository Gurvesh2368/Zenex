/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        chakra: {
          50: '#f0f5ff',
          100: '#e5edff',
          500: '#1d4ed8',
          700: '#1e3a8a',
          800: '#002B7F',
          900: '#0b192c',
        },
        saffron: {
          50: '#fff7ed',
          100: '#ffedd5',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
        },
        tirangaGreen: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
        parchment: {
          50: '#fcfbf7',
          100: '#f9f6ee',
          200: '#f3ede2',
        }
      },
    },
  },
  plugins: [],
}

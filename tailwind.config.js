/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Charte Corse-Matin officielle
        'corse-rouge': '#E60000',
        'corse-gris': '#333333',
        'corse-noir': '#000000',
        'corse-blanc': '#FFFFFF',
        // Variations pour UI
        'corse-rouge-light': '#FF3333',
        'corse-rouge-dark': '#CC0000',
        'corse-gris-light': '#555555',
        'corse-gris-lighter': '#888888',
      },
      backgroundColor: {
        primary: '#E60000',
        'primary-dark': '#CC0000',
        secondary: '#333333',
        accent: '#000000',
      },
      textColor: {
        primary: '#E60000',
        secondary: '#333333',
        accent: '#000000',
      },
      borderColor: {
        primary: '#E60000',
        secondary: '#333333',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

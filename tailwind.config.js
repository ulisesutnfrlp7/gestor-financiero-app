/** @type {import('tailwindcss').Config} */
module.exports = {
  // content: rutas donde Tailwind buscará clases para generar el CSS final
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  // nativewind/preset es obligatorio: adapta Tailwind a React Native
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Color primario de la app (indigo-600 de Tailwind, customizado para facilitar ref)
        primary: {
          DEFAULT: '#4F46E5',
          50: '#EEF2FF',
          100: '#E0E7FF',
          600: '#4F46E5',
          700: '#4338CA',
        },
        income: '#16A34A',
        expense: '#DC2626',
      },
    },
  },
  plugins: [],
}

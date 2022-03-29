/* eslint-disable no-undef */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const colors = require('tailwindcss/colors');

module.exports = {
  //mode: 'jit',
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  media: false,
  theme: {
    extend: {
      fontFamily: {
        'schubert': ['"Schubert"', 'Open Sans', 'Roboto']
      }
    },
    colors: {

      transparent: 'transparent',
      current: 'currentColor',
      brown: {
        DEFAULT: '#c1a796',
        dark: '#7f6e58',
        light: '#ecddc6',
      },
      gray: colors.neutral,
      white: colors.white,
      red: colors.red
    },
  },
  inset: {
    '4': '1rem',
  },
  variants: {
    extend: {},
  },
  plugins: [],
};


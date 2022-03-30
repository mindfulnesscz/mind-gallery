/* eslint-disable no-undef */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const colors = require( 'tailwindcss/colors' );

module.exports = {
  //mode: 'jit',
  content: ['./src/**/*.{js,ts,jsx,tsx}', './dist/index.html'],
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
      itsblue: {
        DEFAULT: '#00a5f5',
        dark: '#007ce9',
        light: '#00dbff',
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


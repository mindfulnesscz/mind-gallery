
// eslint-disable-next-line no-undef
module.exports = {

  //"parser": "sugarss",
  plugins: [
    'postcss-import',
    'postcss-css-variables',
    'tailwindcss/nesting',
    'tailwindcss',
    'postcss-flexbugs-fixes',
    [
      'postcss-preset-env',
      {
        autoprefixer: {
          flexbox: 'no-2009',
        },
        stage: 3,
        features: {
          'custom-properties': false,
        },
      },
    ],
  ]
};

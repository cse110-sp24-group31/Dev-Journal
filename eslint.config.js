const globals = require('globals');

module.exports = [
  {
    languageOptions: {
      globals: Object.keys(globals.browser).reduce((acc, key) => {
        acc[key.trim()] = globals.browser[key];
        return acc;
      }, {})
    },
    rules: {
      'no-undef': 'off',
    },
  },
];

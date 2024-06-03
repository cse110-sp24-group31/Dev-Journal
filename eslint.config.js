const globals = require('globals');

module.exports = [
  {
    languageOptions: { globals: globals.browser },
    rules: {
      'no-undef': 'off',
    },
  },
];

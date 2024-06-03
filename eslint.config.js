import globals from 'globals';

export default [
  {
    languageOptions: {
      globals: Object.keys(globals.browser).reduce((acc, key) => {
        acc[key.trim()] = globals.browser[key];
        return acc;
      }, {}),
    },
    rules: {
      'no-undef': 'off',
    },
  },
];

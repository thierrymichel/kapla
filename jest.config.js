const {defaults} = require('jest-config');

module.exports = {
  // DEV
  // modulePaths: [
  //   '<rootDir>',
  // ],
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'mjs'],
  moduleNameMapper: {
    '^kapla/(.*)': '<rootDir>/$1',
    '^utils/(.*)': '<rootDir>/__mocks__/utils/$1',
  },
  setupFiles: [
    './__mocks__/MutationObserver.js',
  ],
  // DEV
  // testMatch: ['**/__tests__/**/*.?(m)js?(x)', '**/?(*.)(spec|test).?(m)js?(x)'],
  verbose: true,
};

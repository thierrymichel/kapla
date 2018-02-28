module.exports = {
  // DEV
  // modulePaths: [
  //   '<rootDir>',
  // ],
  moduleNameMapper: {
    '^kapla/(.*)': '<rootDir>/$1',
    '^utils/(.*)': '<rootDir>/__mocks__/utils/$1',
  },
  setupFiles: [
    './__mocks__/MutationObserver.js',
  ],
  verbose: true,
};

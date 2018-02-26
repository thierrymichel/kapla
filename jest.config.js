module.exports = {
  // modulePaths: [
  //   '<rootDir>',
  // ],
  moduleNameMapper: {
    kapla: '<rootDir>/src/',
  },
  setupFiles: [
    './__mocks__/MutationObserver.js',
  ],
  verbose: true,
};

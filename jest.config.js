module.exports = {
  modulePathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/temp/'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      diagnostics: false,
    },
  },
};

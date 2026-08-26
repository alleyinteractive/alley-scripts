module.exports = {
  preset: 'ts-jest',
  modulePathIgnorePatterns: [
    '<rootDir>/dist/',
  ],
  resetModules: true,
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/src/tests/setupTests.ts'],
};

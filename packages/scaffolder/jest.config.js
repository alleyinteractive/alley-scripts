module.exports = {
  preset: 'ts-jest',
  modulePathIgnorePatterns: [
    '<rootDir>/dist/',
  ],
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/src/tests/setupTests.ts'],
};

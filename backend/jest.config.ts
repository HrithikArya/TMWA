export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src/tests'],
  testMatch: ['**/*.test.ts'],
  collectCoverageFrom: ['src/**/*.ts', '!src/tests/**'],
  coverageDirectory: 'coverage',
  setupFiles: ['<rootDir>/src/tests/setup.ts'],
  testTimeout: 60000,
};

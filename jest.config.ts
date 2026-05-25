import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests', '<rootDir>/backend'],
  moduleNameMapper: {
    '^@spectre/data-contracts$': '<rootDir>/data-contracts/src/index.ts',
    '^@spectre/backend/(.*)$': '<rootDir>/backend/$1',
  },
  projects: [
    {
      displayName: 'unit',
      testMatch: ['<rootDir>/tests/unit/**/*.test.ts', '<rootDir>/backend/**/*.unit.test.ts'],
    },
    {
      displayName: 'integration',
      testMatch: ['<rootDir>/tests/integration/**/*.test.ts'],
    },
  ],
};

export default config;

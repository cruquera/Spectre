const baseProject = {
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^@spectre/backend/(.*)$': '<rootDir>/backend/$1',
    '^@spectre/data-contracts$': '<rootDir>/data-contracts/src/index.ts',
  },
  resolver: '<rootDir>/jest-resolver.cjs',
  testEnvironment: 'node',
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: 'tsconfig.base.json', useESM: true }],
  },
};

module.exports = {
  projects: [
    {
      displayName: 'unit',
      testMatch: ['<rootDir>/tests/unit/**/*.test.ts', '<rootDir>/backend/**/*.unit.test.ts'],
      ...baseProject,
    },
    {
      displayName: 'integration',
      testMatch: ['<rootDir>/tests/integration/**/*.test.ts'],
      ...baseProject,
    },
  ],
};

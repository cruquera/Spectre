const baseProject = {
  extensionsToTreatAsEsm: ['.ts'],
  testEnvironment: 'node',
  moduleNameMapper: {
  '^@spectre/backend/(.*),: '<rootDir>/backend/$1',
  '^@spectre/data-contracts,: '<rootDir>/data-contracts/src/index.ts'
},
  resolver: '<rootDir>/jest-resolver.cjs',
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { useESM: true, tsconfig: 'tsconfig.base.json' }],
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

import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/modules/**/*.ts',
    'src/cache/**/*.ts',
    'src/utils/**/*.ts',
    'src/common/**/*.ts',
  ],
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
};

export default config;

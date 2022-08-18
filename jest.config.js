const config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/src/main.ts',
    '/src/app.module.ts',
    '/src/series/series.module.ts',
  ],
  testEnvironment: 'node',
  coverageThreshold: {
    global: {
      statements: 90,
      branches: 85,
      functions: 90,
      lines: 90,
    },
  },
};

module.exports = config;

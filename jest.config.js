module.exports = {
  roots: ['<rootDir>/src'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  "testMatch": [
    "**/?(*.)+(test|spec).ts?(x)"
  ],
  moduleNameMapper: {
    '^core/(.*)$': '<rootDir>/src/core/$1',
    '^app/(.*)$': '<rootDir>/src/app/$1',
    '^reader/(.*)$': '<rootDir>/src/reader/$1',
    '^matrix/(.*)$': '<rootDir>/src/matrix/$1',
    '^matrix$': '<rootDir>/src/matrix/index.ts',
  }
};

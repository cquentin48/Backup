/** @type {import('jest').Config} */
const config = {
  preset: "ts-jest",
  verbose: true,
  coverageReporters: [
    'html',
    'text-summary'
  ],
  testMatch: [
    "**/*.test.tsx"
  ],
  transform:{
    "\\.(gql|graphql)$": "@graphql-tools/jest-transform",
    "^.+\\.tsx?$": 'ts-jest',
  },
  rootDir: "../",
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "\\.(s?css|less)$": "identity-obj-proxy",
  },
  moduleFileExtensions: ['js', 'ts', 'jsx', 'tsx', 'gql', 'graphql'],
  testPathIgnorePatterns: [
    "/node_modules/"
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    "src/main/**/*.tsx",
    "!src/main/app/config/*.tsx",
    "!src/main/app/model/exception/"
  ],
  setupFilesAfterEnv: ["<rootDir>/jest/setup.js"]
};

module.exports = config;
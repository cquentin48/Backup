/** @type {import('jest').Config} */
const config = {
  preset: "ts-jest",
  verbose: true,
  coverageReporters: [
    'html',
    'text-summary'
  ],
  testMatch:[
    "**/*.test.tsx"
  ],
  rootDir:"../",
  testEnvironment: "jsdom",
  moduleNameMapper:{
    "\\.(s?css|less)$": "identity-obj-proxy",
    "\\.(gql|graphql)$": "identity-obj-proxy"
  },
  testPathIgnorePatterns:[
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
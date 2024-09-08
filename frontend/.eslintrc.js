module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'plugin:react/recommended',
    'standard-with-typescript'
  ],
  ignorePatterns:[
    "setupTests.ts",
    "index.tsx",
    "react-app-env.d.ts",
    "reportWebVitals.ts",
  ],
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ["tsconfig.json"]
  },
  plugins: [
    'react'
  ],
  rules: {
    '@typescript-eslint/quotes':'off',
    '@typescript-eslint/semi':'off'
  },
  settings: {
    react: {
      version: "detect"
    }
  }
}

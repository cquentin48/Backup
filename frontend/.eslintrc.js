module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'plugin:react/recommended',
    'standard-with-typescript'
  ],
  ignorePatterns: [
    "setupTests.ts",
    "index.tsx",
    "react-app-env.d.ts",
    "reportWebVitals.ts",
  ],
  overrides: [
    {
      files: [
        "src/test/*.tsx",
        "src/test/**/*.tsx"
      ],
      parserOptions: {
        project: ["tsconfig.json"],
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ["tsconfig.json"]
  },
  plugins: [
    'react',
    'jsdoc'
  ],
  rules: {
    '@typescript-eslint/quotes': 'off',
    '@typescript-eslint/semi': 'off',
    "@typescript-eslint/indent": ["error", 4],
    'padded-blocks': 'off', "jsdoc/check-access": 1,
    "jsdoc/check-alignment": 1,
    "jsdoc/check-param-names": 1,
    "jsdoc/check-property-names": 1,
    "jsdoc/check-tag-names": 1,
    "jsdoc/check-types": 1,
    "jsdoc/check-values": 1,
    "jsdoc/empty-tags": 1,
    "jsdoc/implements-on-classes": 1,
    "jsdoc/multiline-blocks": 1,
    "jsdoc/no-multi-asterisks": 1,
    "jsdoc/no-undefined-types": 1,
    "jsdoc/require-jsdoc": 1,
    "jsdoc/require-param": 1,
    "jsdoc/require-param-description": 1,
    "jsdoc/require-param-name": 1,
    "jsdoc/require-param-type": 1,
    "jsdoc/require-property": 1,
    "jsdoc/require-property-description": 1,
    "jsdoc/require-property-name": 1,
    "jsdoc/require-property-type": 1,
    "jsdoc/require-returns": 1,
    "jsdoc/require-returns-check": 1,
    "jsdoc/require-returns-description": 1,
    "jsdoc/require-returns-type": 1,
    "jsdoc/require-yields": 1,
    "jsdoc/require-yields-check": 1,
    "jsdoc/tag-lines": 1,
    "jsdoc/valid-types": 1
  },
  settings: {
    react: {
      version: "detect"
    }
  }
}

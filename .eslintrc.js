module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
    ecmaVersion: 12,
  },
  plugins: ['@typescript-eslint/eslint-plugin','sonarjs', 'no-loops', 'no-use-extend-native'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'airbnb-base',
    'airbnb-typescript'
  ],
  root: true,
  env: {
    node: true,
    jest: true,
    browser: true,
    es2021: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'no-return-await': 'warn',
    'no-console': 'off',
    'class-methods-use-this': 'off',
    'max-params': 'warn',
    camelcase: 'off',
  },
};


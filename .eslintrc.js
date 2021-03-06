module.exports = {
  env: {
    commonjs: true,
    es6: true,
    node: true,
    jest: true,
    'cypress/globals': true,
  },
  extends: 'eslint:recommended',
  plugins: ['jest', 'cypress'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 11,
  },
  rules: {
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],
    semi: ['error', 'never'],
    eqeqeq: 'error',
    'no-trailing-spaces': 'error',
    'object-curly-spacing': ['error', 'always'],
    'arrow-spacing': ['error', { before: true, after: true }],
    'no-console': 0,
  },
  root: true,
}

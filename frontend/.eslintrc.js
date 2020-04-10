module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  plugins: [
    '@typescript-eslint',
    'simple-import-sort',
  ],
  extends: [
    'airbnb-typescript',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
  ],
  rules: {
    'simple-import-sort/sort': 'error',
    'lines-between-class-members': 'off',
    'spaced-comment': 'off',
    'no-duplicate-imports': 'error',
    '@typescript-eslint/no-explicit-any': 'off',
    'no-restricted-syntax': 'off',
    'react/destructuring-assignment': 'off',
    'max-len': ['error', { 'code': 250 }]
  },
};

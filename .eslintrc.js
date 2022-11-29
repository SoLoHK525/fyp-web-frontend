module.exports = {
  env: {
    browser: true,
    node: true,
    es2020: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: [
    'jsx-a11y',
    '@typescript-eslint',
    'react',
    'react-hooks',
    'prettier',
    'import',
    'unused-imports',
    'simple-import-sort',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:react/jsx-runtime',
    'plugin:jsx-a11y/recommended',
    // 'plugin:import/recommended',
    'plugin:import/typescript',
    'prettier',
  ],
  ignorePatterns: ['**/*.hbs'],
  rules: {
    'import/extensions': 'off',
    'import/no-cycle': [0, { ignoreExternal: true }],
    'simple-import-sort/imports': [
      'warn',
      {
        groups: [
          ['^react$'],
          ['^\\u0000'],
          ['^@?\\w'],
          ['^components(/.*|$)'],
          ['^containers(/.*|$)'],
          ['^(types|utils|api|config|styles|pages)(/.*|$)'],
          ['^\\.'],
        ],
      },
    ],
    'simple-import-sort/exports': 'warn',
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],
    'react/jsx-uses-react': 'warn',
    'react/jsx-uses-vars': 'warn',
    'react/jsx-filename-extension': [1, { extensions: ['.ts', '.tsx'] }],
    'react/jsx-sort-props': 'warn',
    'react/prop-types': 'off',
    'jsx-a11y/anchor-is-valid': 'off',
    'react/jsx-props-no-spreading': ['error', { custom: 'ignore' }],
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_|React' },
    ],
    'no-empty-function': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-var-requires': 'off', // NextJS Specific
    'react/react-in-jsx-scope': 'off', // NextJS Specific
    'global-require': 'off', // NextJS Specific
    'react/display-name': 'off',
    'react/require-default-props': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-use-before-define': [
      'error',
      { functions: false, classes: false, variables: false }, // Off for variables temporary
    ],
    curly: 2,
  },
  overrides: [
    {
      files: ['slice.ts'],
      rules: {
        'no-param-reassign': 'off',
      },
    },
  ],
  settings: {
    'import/resolver': {
      'babel-module': {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        paths: ['src'],
      },
    },
    react: {
      version: 'detect',
    },
  },
};

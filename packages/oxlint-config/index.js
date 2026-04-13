import { defineConfig } from 'oxlint';

export default defineConfig({
  categories: {
    correctness: 'error',
    suspicious: 'error',
  },
  plugins: [
    'react',
    'typescript',
    'import',
    'unicorn',
    'jsx-a11y',
    'jsdoc',
    'promise',
    'oxc',
    'node',
  ],
  jsPlugins: ['oxlint-plugin-eslint'],
  options: {
    typeAware: true,
    typeCheck: true,
  },
  env: {
    builtin: true,
    es2024: true,
    jest: true,
    node: true,
  },
  rules: {
    'react/jsx-props-no-spreading': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/jsx-filename-extension': [
      'error',
      {
        extensions: ['.jsx', '.tsx'],
      },
    ],
    'react/jsx-no-useless-fragment': [
      'error',
      {
        allowExpressions: true,
      },
    ],
    'import/extensions': [
      'error',
      'always',
      {
        pattern: {
          js: 'never',
          ts: 'never',
          jsx: 'never',
          tsx: 'never',
          mjs: 'never',
        },
      },
    ],
    'eslint-js/no-restricted-syntax': [
      'error',
      {
        message:
          'Ternaries must be used instead of && in JSX expressions to avoid the potential for accidental output. Use, for example, {condition ? <Element /> : null}.',
        selector:
          ":matches(JSXElement, JSXFragment) > JSXExpressionContainer > LogicalExpression[operator='&&']",
      },
      {
        message:
          'Ternaries must be used instead of || in JSX expressions to avoid the potential for accidental output. Use, for example, {thing1 ? thing1 : thing2}.',
        selector:
          ":matches(JSXElement, JSXFragment) > JSXExpressionContainer > LogicalExpression[operator='||']",
      },
    ],
  },
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts'],
      rules: {
        'import/extensions': [
          'error',
          'always',
          {
            checkTypeImports: true,
            ignorePackages: true,
          },
        ],
      },
    },
  ],
});

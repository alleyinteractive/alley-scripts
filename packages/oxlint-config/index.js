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
      files: ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts', '**/*.d.ts'],
      rules: {
        'import/extensions': [
          'error',
          'always',
          {
            checkTypeImports: true,
            ignorePackages: true,
          },
        ],
        // Type-aware rules — not auto-enabled by typeAware: true, require explicit listing.
        'typescript/consistent-type-exports': 'error',
        'typescript/no-confusing-void-expression': 'error',
        'typescript/no-deprecated': 'error',
        'typescript/no-duplicate-type-constituents': 'error',
        'typescript/no-misused-promises': 'error',
        'typescript/no-mixed-enums': 'error',
        'typescript/no-unnecessary-type-assertion': 'error',
        'typescript/no-unsafe-argument': 'error',
        'typescript/no-unsafe-assignment': 'error',
        'typescript/no-unsafe-call': 'error',
        'typescript/no-unsafe-enum-comparison': 'error',
        'typescript/no-unsafe-member-access': 'error',
        'typescript/no-unsafe-return': 'error',
        'typescript/no-unsafe-type-assertion': 'error',
        'typescript/no-unsafe-unary-minus': 'error',
        'typescript/only-throw-error': 'error',
        'typescript/prefer-nullish-coalescing': 'error',
        'typescript/prefer-optional-chain': 'error',
        'typescript/prefer-promise-reject-errors': 'error',
        'typescript/restrict-plus-operands': [
          'error',
          {
            allowAny: false,
            allowBoolean: false,
            allowNullish: false,
            allowNumberAndString: false,
            allowRegExp: false,
          },
        ],
        'typescript/restrict-template-expressions': [
          'error',
          {
            allowNumber: true,
          },
        ],
        'typescript/return-await': ['error', 'error-handling-correctness-only'],
        'typescript/switch-exhaustiveness-check': 'error',
        'typescript/use-unknown-in-catch-callback-variable': 'error',
      },
    },
  ],
});

const { FlatCompat } = require('@eslint/eslintrc');
const js = require('@eslint/js');
// Importamos o pacote de globais para substituir o antigo 'env'
const globals = require('globals');

const compat = new FlatCompat({ recommendedConfig: js.configs.recommended });

const tsBaseConfigs = compat.extends(
  'eslint:recommended',
  'plugin:@typescript-eslint/recommended',
  'plugin:@typescript-eslint/recommended-requiring-type-checking',
  'plugin:@angular-eslint/recommended',
).map((config) => ({
  ...config,
  files: ['**/*.ts'],
  languageOptions: {
    parser: require('@typescript-eslint/parser'),
    parserOptions: {
      ecmaVersion: 'latest',
      project: [
        './apps/angular-app/tsconfig.app.json',
        './apps/electron-main/tsconfig.json',
        './apps/electron-preload/tsconfig.json',
        './backend/tsconfig.json',
        './data-contracts/tsconfig.json',
        './tsconfig.eslint.json',
      ],
      sourceType: 'module',
      tsconfigRootDir: __dirname,
    },
  },
  plugins: {
    '@angular-eslint': require('@angular-eslint/eslint-plugin'),
    '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
    import: require('eslint-plugin-import'),
  },
}));

const jsBaseConfigs = compat.extends('eslint:recommended').map((config) => ({
  ...config,
  files: ['**/*.{js,cjs,mjs}'],
  languageOptions: {
    // ???? CORRIGIDO: Removido 'env' e adicionado 'globals'
    ecmaVersion: 'latest',
    globals: {
      ...globals.es2021, // O pacote 'globals' mapeia es2021+ cobrindo o comportamento do es2023,
      ...globals.node,
    },
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  },
  plugins: {
    import: require('eslint-plugin-import'),
  },
}));

const dataContractsJsConfig = {
  files: ['data-contracts/src/**/*.js'],
  languageOptions: {
    ecmaVersion: 'latest',
    globals: {
      ...globals.es2021,
      ...globals.node,
    },
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'script',
    },
  },
};

const htmlBaseConfigs = compat.extends('plugin:@angular-eslint/template/recommended').map((config) => ({
  ...config,
  files: ['**/*.html'],
  languageOptions: {
    parser: require('@angular-eslint/template-parser'),
  },
  plugins: {
    '@angular-eslint': require('@angular-eslint/eslint-plugin'),
    '@angular-eslint/template': require('@angular-eslint/eslint-plugin-template'),
  },
}));

module.exports = [
  {
    ignores: ['**/dist/**', '**/*.d.ts', 'node_modules/**', '.eslintrc.cjs'],
  },
  ...tsBaseConfigs,
  {
    files: ['**/*.ts'],
    rules: {
      '@angular-eslint/component-class-suffix': 'error',
      '@angular-eslint/directive-selector': ['error', { prefix: 'sp', style: 'camelCase', type: 'attribute' }],
      '@angular-eslint/no-empty-lifecycle-method': 'warn',
      '@angular-eslint/no-input-rename': 'error',
      '@angular-eslint/no-output-native': 'error',
      '@angular-eslint/no-output-rename': 'error',
      '@angular-eslint/use-lifecycle-interface': 'warn',
      '@angular-eslint/use-pipe-transform-interface': 'warn',
      '@typescript-eslint/adjacent-overload-signatures': 'error',
      '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/explicit-function-return-type': ['warn', { allowExpressions: true }],
      '@typescript-eslint/explicit-member-accessibility': ['warn', { accessibility: 'explicit' }],
      '@typescript-eslint/member-ordering': [
        'warn',
        {
          default: [
            'public-static-field',
            'protected-static-field',
            'private-static-field',
            'public-static-method',
            'protected-static-method',
            'private-static-method',
            'public-instance-field',
            'protected-instance-field',
            'private-instance-field',
            'public-constructor',
            'protected-constructor',
            'private-constructor',
            'public-instance-method',
            'protected-instance-method',
            'private-instance-method',
          ],
        },
      ],
      '@typescript-eslint/method-signature-style': ['error', 'method'],
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-misused-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unsafe-call': 'warn',
      '@typescript-eslint/no-unsafe-member-access': 'warn',
      '@typescript-eslint/no-unsafe-return': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/prefer-readonly': 'error',
      '@typescript-eslint/unbound-method': 'warn',
      'array-bracket-newline': ['error', 'consistent'],
      'array-element-newline': ['error', 'consistent'],
      'brace-style': ['error', '1tbs', { allowSingleLine: true }],
      'comma-dangle': ['error', 'always-multiline'],
      'eol-last': ['error', 'always'],
      eqeqeq: ['error', 'always'],
      'func-call-spacing': ['error', 'never'],
      'import/order': [
        'error',
        {
          alphabetize: { caseInsensitive: true, order: 'asc' },
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index']],
          'newlines-between': 'always',
        },
      ],
      indent: ['error', 2, { SwitchCase: 1 }],
      'keyword-spacing': ['error', { after: true, before: true }],
      'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
      'no-console': 'warn',
      'no-duplicate-imports': 'error',
      'no-extra-semi': 'error',
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0 }],
      'no-trailing-spaces': 'error',
      'object-curly-spacing': ['error', 'always'],
      'padding-line-between-statements': [
        'error',
        { blankLine: 'always', next: 'return', prev: '*' },
        { blankLine: 'always', next: '*', prev: ['const', 'let', 'var'] },
        { blankLine: 'any', next: ['const', 'let', 'var'], prev: ['const', 'let', 'var'] },
      ],
      'quote-props': ['error', 'as-needed'],
      quotes: ['error', 'single', { allowTemplateLiterals: true, avoidEscape: true }],
      semi: ['error', 'always'],
      'sort-imports': ['error', { ignoreDeclarationSort: true }],
      'sort-keys': ['warn', 'asc', { caseSensitive: false, minKeys: 2, natural: true }],
      'wrap-iife': ['error', 'outside'],
    },
  },
  ...jsBaseConfigs,
  dataContractsJsConfig,
  {
    files: ['*.js', '*.cjs', '*.mjs'],
    rules: {
      'array-bracket-newline': ['error', 'consistent'],
      'array-element-newline': ['error', 'consistent'],
      'brace-style': ['error', '1tbs', { allowSingleLine: true }],
      'comma-dangle': ['error', 'always-multiline'],
      'eol-last': ['error', 'always'],
      eqeqeq: ['error', 'always'],
      'func-call-spacing': ['error', 'never'],
      'import/order': [
        'error',
        {
          alphabetize: { caseInsensitive: true, order: 'asc' },
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index']],
          'newlines-between': 'always',
        },
      ],
      indent: ['error', 2, { SwitchCase: 1 }],
      'keyword-spacing': ['error', { after: true, before: true }],
      'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
      'no-console': 'warn',
      'no-duplicate-imports': 'error',
      'no-extra-semi': 'error',
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0 }],
      'no-trailing-spaces': 'error',
      'object-curly-spacing': ['error', 'always'],
      'padding-line-between-statements': [
        'error',
        { blankLine: 'always', next: 'return', prev: '*' },
        { blankLine: 'always', next: '*', prev: ['const', 'let', 'var'] },
        { blankLine: 'any', next: ['const', 'let', 'var'], prev: ['const', 'let', 'var'] },
      ],
      'quote-props': ['error', 'as-needed'],
      quotes: ['error', 'single', { allowTemplateLiterals: true, avoidEscape: true }],
      semi: ['error', 'always'],
      'sort-imports': ['error', { ignoreDeclarationSort: true }],
      'sort-keys': ['warn', 'asc', { caseSensitive: false, minKeys: 2, natural: true }],
      'wrap-iife': ['error', 'outside'],
    },
  },
  ...htmlBaseConfigs,
];

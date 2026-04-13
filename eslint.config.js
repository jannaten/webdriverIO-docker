'use strict';

const js = require('@eslint/js');
const pluginWdio = require('eslint-plugin-wdio');
const pluginMocha = require('eslint-plugin-mocha');

/**
 * ESLint v9 flat configuration
 *
 * Three layers:
 *  1. Base JS rules (all files)
 *  2. WebdriverIO + Mocha rules (test files only)
 *  3. Config/tooling files with relaxed rules
 */
module.exports = [
  // ── 1. Base rules for the whole project ───────────────────────────────────
  {
    ...js.configs.recommended,
    files: ['**/*.js'],
    ignores: ['node_modules/**', 'allure-report/**', 'allure-results/**'],
  },
  // ── 2. Test files ─────────────────────────────────────────────────────────
  {
    files: ['test/**/*.js'],
    plugins: {
      wdio: pluginWdio,
      mocha: pluginMocha,
    },
    languageOptions: {
      ecmaVersion: 2022,
      // commonjs provides require, module, exports, __dirname, __filename automatically
      sourceType: 'commonjs',
      globals: {
        // WebdriverIO browser globals — injected by the runner at runtime
        browser: 'readonly',
        driver: 'readonly',
        $: 'readonly',
        $$: 'readonly',
        expect: 'readonly',
        // Mocha globals
        describe: 'readonly',
        context: 'readonly',
        it: 'readonly',
        specify: 'readonly',
        before: 'readonly',
        beforeEach: 'readonly',
        after: 'readonly',
        afterEach: 'readonly',
      },
    },
    rules: {
      // ── WebdriverIO rules ──────────────────────────────────────────────────
      // Flags browser.pause() — acceptable for debugging, never in CI code.
      'wdio/no-pause': 'error',
      // Every browser command must be awaited in async mode.
      'wdio/await-expect': 'error',
      // ── Mocha rules ───────────────────────────────────────────────────────
      // .only() left in a spec file would silently skip all other tests in CI.
      'mocha/no-exclusive-tests': 'error',
      // .skip() in a committed spec is usually a bug or forgotten test.
      'mocha/no-skipped-tests': 'warn',
      // Two tests with identical names in the same suite are always a mistake.
      'mocha/no-identical-title': 'error',
      // Prefer arrow functions in describe/it for stylistic consistency.
      'mocha/prefer-arrow-callback': 'warn',
      // describe() blocks must never be async — async describe is always a mistake.
      'mocha/no-async-describe': 'error',
      // Returning a value from an async test silently swallows the actual result.
      'mocha/no-return-from-async': 'error',
      // ── General quality rules ─────────────────────────────────────────────
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      // console.log is acceptable in test helpers but flag it for review.
      'no-console': 'warn',
      // Promises should never be silently dropped.
      'no-floating-decimal': 'error',
    },
  },
  // ── 3. Config / tooling files ──────────────────────────────────────────────
  {
    files: ['wdio.conf.js', 'eslint.config.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: {
        process: 'readonly',
        __dirname: 'readonly',
        browser: 'readonly', // afterTest hook references browser
      },
    },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
];

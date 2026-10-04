// Flat config: @eslint/js recommended for every module; Node globals for the pipeline, plus
// browser globals for design scripts that drive pages through Playwright.
import js from '@eslint/js';
import globals from 'globals';

export default [
  { ignores: ['web/**', 'node_modules/**', '.tools/**', 'out/**'] },
  js.configs.recommended,
  {
    files: ['**/*.{js,mjs}'],
    languageOptions: { ecmaVersion: 'latest', sourceType: 'module', globals: { ...globals.node } },
  },
  {
    files: ['design/**/*.mjs'],
    languageOptions: { globals: { ...globals.node, ...globals.browser } },
  },
];

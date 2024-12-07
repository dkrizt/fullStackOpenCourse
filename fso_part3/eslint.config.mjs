import globals from 'globals'
import stylisticJs from '@stylistic/eslint-plugin-js'
import js from '@eslint/js'
import prettierConfig from 'eslint-config-prettier' // Import Prettier config
import prettierPlugin from 'eslint-plugin-prettier' // Import Prettier plugin

/** @type {import('eslint').Linter.Config[]} */
export default [
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
      },
      ecmaVersion: 'latest',
    },
    plugins: {
      '@stylistic/js': stylisticJs,
      prettier: prettierPlugin, // Add Prettier plugin
    },
    rules: {
      // Stylistic rules from @stylistic/js
      '@stylistic/js/indent': ['error', 2],
      '@stylistic/js/linebreak-style': ['error', 'unix'],
      '@stylistic/js/quotes': ['error', 'single'],
      '@stylistic/js/semi': ['error', 'never'],
      eqeqeq: 'error',
      'no-trailing-spaces': 'error',
      'object-curly-spacing': ['error', 'always'],
      'arrow-spacing': ['error', { before: true, after: true }],
      'no-console': 'off',

      // Prettier rule (ensures Prettier issues are shown as ESLint errors)
      'prettier/prettier': 'error',
    },
  },
  {
    ignores: ['dist/**', 'build/**'],
  },
  // Add Prettier config as the final override to disable conflicting rules
  prettierConfig,
]

import globals from 'globals';

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['**/*.js'], languageOptions: { sourceType: 'commonjs' } },
  { 
    files: ['utils/**/*.js'], // or ['utils/clerk.js'] for just that file
    languageOptions: { sourceType: 'module' } 
  },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  {
    rules: {
      'no-console': 'off',                // Allows console statements
      'no-unused-vars': 'error',          // Warns about unused variables
      'eqeqeq': 'error',                  // Enforces strict equality (=== and !==)
      'curly': 'error',                   // Enforces curly braces for all control statements
      'semi': ['error', 'always'],        // Enforces semicolons at the end of statements
      'quotes': ['error', 'single'],      // Enforces single quotes
      'comma-dangle': ['error', 'never'], // Disallows trailing commas
      'object-curly-spacing': ['error', 'always'],
      'max-len': ['error', { code: 100, ignoreComments: true }],
      'space-in-parens': ['error', 'never'],
      'array-bracket-spacing': ['error', 'never'],
      'no-var': 'error',
      'object-shorthand': 'off',
      'no-multi-assign': 'error',
      'no-multiple-empty-lines': ['error', { max: 1 }],
      'no-duplicate-imports': 'error'
    }
  }
];

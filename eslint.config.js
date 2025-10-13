const globals = require("globals");
const js = require("@eslint/js");

module.exports = [
  // Load the recommended ESLint rules
  js.configs.recommended,

  // Configure language options and global variables
  {
    languageOptions: {
      ecmaVersion: 2015, // This is equivalent to "es6: true"
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jquery,
        "angular": "readonly",
        "io": "readonly",
        "moment": "readonly",
        "_": "readonly"
      }
    },
    rules: {
      "no-unused-vars": ["warn", {
        "vars": "all",
        "args": "none" // Do not check for unused function arguments
      }]
    }
  }
];
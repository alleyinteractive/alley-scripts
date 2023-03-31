/**
 * Parser options that can be applied to both babel and typescript parsers.
 */
module.exports = {
  parserOptions: {
    ecmaFeatures: {
      globalReturn: true,
      impliedStrict: true,
      jsx: true,
    },
    requireConfigFile: false,
    sourceType: 'module',
  },
};

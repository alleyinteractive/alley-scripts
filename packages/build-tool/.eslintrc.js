module.exports = {
  root: true,
  extends: [
    '@alleyinteractive/eslint-config/typescript',
  ],
  parserOptions: {
    project: './config/tsconfig.eslint.json',
    tsconfigRootDir: __dirname,
  },
};

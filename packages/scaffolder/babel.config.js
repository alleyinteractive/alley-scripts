module.exports = {
  presets: [
    '@babel/preset-typescript',
    [
      '@babel/preset-env',
      {
        exclude: ['@babel/plugin-proposal-dynamic-import'],
        targets: {
          node: 20,
        },
      },
    ],
  ],
  ignore: ['**/*.d.ts'],
};

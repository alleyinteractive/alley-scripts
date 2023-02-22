module.exports = {
  'stories': [
    '../stories/**/*.stories.mdx',
    '../packages/block-editor-tools/src/**/*.stories.@(js|jsx|ts|tsx|mdx)',
  ],
  'addons': [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-docs',
    '@storybook/preset-scss',
    'storybook-addon-turbo-build',
  ],
  'framework': '@storybook/react',
  'core': {
    'builder': '@storybook/builder-webpack5'
  }
}

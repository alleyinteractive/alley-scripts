module.exports = {
  'stories': [
    // packages/block-editor-tools/src/components/audio-picker/index.stories.tsx
    '../packages/block-editor-tools/src/**/*.stories.@(js|jsx|ts|tsx|mdx)',
    '../stories/**/*.stories.mdx',
    // '../stories/**/*.stories.@(js|jsx|ts|tsx)'
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

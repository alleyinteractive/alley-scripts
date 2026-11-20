import path from 'path';
import { createRequire } from 'module';
import { StorybookConfig } from '@storybook/react-vite';

const wordpressFlags = {
  'process.env.IS_GUTENBERG_PLUGIN': 'false',
  'process.env.IS_WORDPRESS_CORE': 'false',
};

const requireFromBlockEditor = createRequire(require.resolve('@wordpress/block-editor/package.json'));

const config: StorybookConfig = {
  stories: [
    '../stories/**/*.mdx',
    '../packages/block-editor-tools/src/**/*.stories.@(js|jsx|ts|tsx|mdx)',
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  docs: {
    autodocs: true,
    defaultName: 'Documentation',
  },
  viteFinal: async (viteConfig) => ({
    ...viteConfig,
    // WordPress packages expect these build-time flags to be compiled in.
    define: {
      ...viteConfig.define,
      ...wordpressFlags,
    },
    optimizeDeps: {
      ...viteConfig.optimizeDeps,
      esbuildOptions: {
        ...viteConfig.optimizeDeps?.esbuildOptions,
        define: {
          ...viteConfig.optimizeDeps?.esbuildOptions?.define,
          ...wordpressFlags,
        },
      },
    },
    resolve: {
      ...viteConfig.resolve,
      alias: {
        ...viteConfig.resolve?.alias,
        // npm installs a separate private-apis per @wordpress package, but lock/unlock only
        // works across packages that share one copy, as they do via wp.privateApis in WordPress.
        '@wordpress/private-apis': path.dirname(requireFromBlockEditor.resolve('@wordpress/private-apis/package.json')),
      },
    },
  }),
};

export default config;

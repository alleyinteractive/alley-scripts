import type { Meta, StoryObj } from '@storybook/react';

import { resolveReadmeLinks } from '../../../../../.storybook/components/readme';
import readme from './README.md?raw';

import SafeHTML from './index';

const meta: Meta<typeof SafeHTML> = {
  component: SafeHTML,
  title: 'Block Editor Tools/Components/Safe HTML',
  parameters: {
    docs: {
      description: {
        component: resolveReadmeLinks(readme, 'packages/block-editor-tools/src/components/safe-html'),
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof SafeHTML>;

export const Default: Story = {
  args: {
    html: '<strong>Bold</strong>, <em>italic</em>, and <a href="https://alley.com">a link</a>.',
    tag: 'p',
  },
};

export const Sanitized: Story = {
  args: {
    html: 'The script and onerror handler are stripped: <script>alert("xss")</script><img src="x" onerror="alert(\'xss\')" alt="broken image">',
    tag: 'div',
  },
};

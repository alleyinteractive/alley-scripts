import type { Meta, StoryObj } from '@storybook/react';

import { resolveReadmeLinks } from '../../../../../.storybook/components/readme';
import readme from './README.md?raw';

import Selector from './index';

const meta: Meta<typeof Selector> = {
  component: Selector,
  title: 'Block Editor Tools/Components/Selector',
  parameters: {
    docs: {
      description: {
        component: resolveReadmeLinks(readme, 'packages/block-editor-tools/src/components/selector'),
      },
    },
  },
  args: {
    type: 'post',
    label: 'Search for posts',
    placeholder: 'Type at least 3 characters, e.g. "the"',
  },
};

export default meta;

type Story = StoryObj<typeof Selector>;

export const Default: Story = {};

export const Multiple: Story = {
  args: {
    multiple: true,
    selected: [
      { id: 100, title: 'Hello World' },
    ],
  },
};

export const Terms: Story = {
  args: {
    type: 'term',
    label: 'Search for terms',
    placeholder: 'e.g. "tech"',
    subTypes: ['category', 'post_tag'],
  },
};

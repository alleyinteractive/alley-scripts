import type { Meta, StoryObj } from '@storybook/react';

import PostSelector from './index';

const meta: Meta<typeof PostSelector> = {
  component: PostSelector,
  title: 'Block Editor Tools/Components/Post Selector',
  parameters: {
    docs: {
      description: {
        component: 'Deprecated since 0.3.0. Use `Selector` with `type="post"` or `PostPicker` instead.',
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof PostSelector>;

export const Default: Story = {};

export const Pages: Story = {
  args: {
    multiple: true,
    subTypes: ['page'],
  },
};

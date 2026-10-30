import type { Meta, StoryObj } from '@storybook/react';

import TermSelector from './index';

const meta: Meta<typeof TermSelector> = {
  component: TermSelector,
  title: 'Block Editor Tools/Components/Term Selector',
};

export default meta;

type Story = StoryObj<typeof TermSelector>;

export const Default: Story = {};

export const Multiple: Story = {
  args: {
    multiple: true,
    selected: [
      { id: 202, title: 'Engineering' },
      { id: 209, title: 'Technology' },
    ],
  },
};

export const CategoriesOnly: Story = {
  args: {
    label: 'Search for categories',
    multiple: true,
    subTypes: ['category'],
  },
};

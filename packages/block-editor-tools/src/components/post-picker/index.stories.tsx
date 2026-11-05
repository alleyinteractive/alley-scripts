import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { resolveReadmeLinks } from '../../../../../.storybook/components/readme';
import readme from './README.md?raw';

import PostPicker from './index';

const meta: Meta<typeof PostPicker> = {
  component: PostPicker,
  title: 'Block Editor Tools/Components/Post Picker',
  parameters: {
    docs: {
      description: {
        component: resolveReadmeLinks(readme, 'packages/block-editor-tools/src/components/post-picker'),
      },
    },
  },
  render: function Render(args) {
    const [value, setValue] = useState(args.value);

    return (
      <PostPicker
        {...args}
        value={value}
        onReset={() => setValue(0)}
        onUpdate={setValue}
      />
    );
  },
};

export default meta;

type Story = StoryObj<typeof PostPicker>;

export const Default: Story = {
  args: {
    value: 0,
  },
};

export const Selected: Story = {
  args: {
    title: 'Featured Post',
    value: 100,
  },
};

export const ListFormat: Story = {
  args: {
    modalFormat: 'list',
    value: 0,
  },
};

export const PagesOnly: Story = {
  args: {
    allowedTypes: ['page'],
    modalTitle: 'Select Page',
    value: 0,
  },
};

export const Unavailable: Story = {
  args: {
    value: 999,
  },
};

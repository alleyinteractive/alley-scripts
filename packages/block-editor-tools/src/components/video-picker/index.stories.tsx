import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { resolveReadmeLinks } from '../../../../../.storybook/components/readme';
import readme from './README.md?raw';

import VideoPicker from './index';

const meta: Meta<typeof VideoPicker> = {
  component: VideoPicker,
  title: 'Block Editor Tools/Components/Video Picker',
  parameters: {
    docs: {
      description: {
        component: resolveReadmeLinks(readme, 'packages/block-editor-tools/src/components/video-picker'),
      },
    },
  },
  render: function Render(args) {
    const [value, setValue] = useState(args.value);
    const [valueURL, setValueURL] = useState(args.valueURL);

    return (
      <VideoPicker
        {...args}
        value={value}
        valueURL={valueURL}
        onReset={() => {
          setValue(0);
          setValueURL('');
        }}
        onUpdate={({ id }: { id: number }) => setValue(id)}
        onUpdateURL={(url: string) => setValueURL(url)}
      />
    );
  },
};

export default meta;

type Story = StoryObj<typeof VideoPicker>;

export const Default: Story = {
  args: {
    value: 0,
    valueURL: '',
  },
};

export const Selected: Story = {
  args: {
    value: 20,
  },
};

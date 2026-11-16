import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { resolveReadmeLinks } from '../../../../../.storybook/components/readme';
import readme from './README.md?raw';

import AudioPicker from './index';

const meta: Meta<typeof AudioPicker> = {
  component: AudioPicker,
  title: 'Block Editor Tools/Components/Audio Picker',
  parameters: {
    docs: {
      description: {
        component: resolveReadmeLinks(readme, 'packages/block-editor-tools/src/components/audio-picker'),
      },
    },
  },
  render: function Render(args) {
    const [value, setValue] = useState(args.value);
    const [valueURL, setValueURL] = useState(args.valueURL);

    return (
      <AudioPicker
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

type Story = StoryObj<typeof AudioPicker>;

export const Default: Story = {
  args: {
    value: 0,
    valueURL: '',
  },
};

export const Selected: Story = {
  args: {
    value: 10,
  },
};

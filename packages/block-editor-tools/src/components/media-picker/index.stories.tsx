import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { resolveReadmeLinks } from '../../../../../.storybook/components/readme';
import readme from './README.md?raw';

import MediaPicker from './index';

const meta: Meta<typeof MediaPicker> = {
  component: MediaPicker,
  title: 'Block Editor Tools/Components/Media Picker',
  parameters: {
    docs: {
      description: {
        component: resolveReadmeLinks(readme, 'packages/block-editor-tools/src/components/media-picker'),
      },
    },
  },
  render: function Render(args) {
    const [value, setValue] = useState(args.value);
    const [valueURL, setValueURL] = useState(args.valueURL);

    return (
      <MediaPicker
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

type Story = StoryObj<typeof MediaPicker>;

export const Default: Story = {
  args: {
    allowedTypes: ['application/pdf'],
    value: 0,
    valueURL: '',
  },
};

export const Selected: Story = {
  args: {
    value: 2,
  },
};

export const CustomPreview: Story = {
  args: {
    imageSize: 'full',
    preview: (({ src }: { src: string }) => (
      <figure style={{ margin: 0 }}>
        <img src={src} alt="" style={{ maxWidth: 300 }} />
        <figcaption>{src}</figcaption>
      </figure>
    )) as any,
    value: 3,
  },
};

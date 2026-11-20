import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { resolveReadmeLinks } from '../../../../../.storybook/components/readme';
import readme from './README.md?raw';

import ImagePicker from './index';

const meta: Meta<typeof ImagePicker> = {
  component: ImagePicker,
  title: 'Block Editor Tools/Components/Image Picker',
  parameters: {
    docs: {
      description: {
        component: resolveReadmeLinks(readme, 'packages/block-editor-tools/src/components/image-picker'),
      },
    },
  },
  render: function Render(args) {
    const [value, setValue] = useState(args.value);
    const [valueURL, setValueURL] = useState(args.valueURL);

    return (
      <ImagePicker
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

type Story = StoryObj<typeof ImagePicker>;

export const Default: Story = {
  args: {
    value: 0,
    valueURL: '',
  },
};

export const Selected: Story = {
  args: {
    value: 1,
  },
};

export const FromURL: Story = {
  args: {
    value: 0,
    valueURL: 'https://picsum.photos/seed/alley-url/600/400',
  },
};

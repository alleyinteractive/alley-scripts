import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { resolveReadmeLinks } from '../../../../../.storybook/components/readme';
import readme from './README.md?raw';

import SortableItem from './index';

const meta: Meta<typeof SortableItem> = {
  component: SortableItem,
  title: 'Block Editor Tools/Components/Sortable Item',
  parameters: {
    docs: {
      description: {
        component: resolveReadmeLinks(readme, 'packages/block-editor-tools/src/components/sortable-item'),
      },
    },
  },
  render: function Render(args) {
    const [list, setList] = useState<string[]>(args.list);

    return (
      <>
        {list.map((item, index) => (
          <SortableItem
            index={index}
            key={item}
            list={list}
            setList={setList}
          >
            <p>{item}</p>
          </SortableItem>
        ))}
      </>
    );
  },
};

export default meta;

type Story = StoryObj<typeof SortableItem>;

export const Default: Story = {
  args: {
    list: ['Apples', 'Bananas', 'Cherries'],
  },
};

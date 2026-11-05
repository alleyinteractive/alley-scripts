import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { resolveReadmeLinks } from '../../../../../.storybook/components/readme';
import readme from './README.md?raw';
import { TextControl } from '@wordpress/components';

import Sortable from './index';
import SortableItem from '../sortable-item';

const meta: Meta<typeof Sortable> = {
  component: Sortable,
  title: 'Block Editor Tools/Components/Sortable',
  parameters: {
    docs: {
      description: {
        component: resolveReadmeLinks(readme, 'packages/block-editor-tools/src/components/sortable'),
      },
    },
  },
  subcomponents: { SortableItem } as Meta['subcomponents'],
  render: function Render(args) {
    const [list, setList] = useState<string[]>(args.list);

    return (
      <Sortable {...args} list={list} setList={setList}>
        {list.map((item, index) => (
          <SortableItem
            index={index}
            key={index} // eslint-disable-line react/no-array-index-key
            list={list}
            setList={setList}
          >
            <TextControl
              label={`Item ${index + 1}`}
              onChange={(next: string) => {
                const newList = [...list];
                newList[index] = next;
                setList(newList);
              }}
              value={item}
            />
          </SortableItem>
        ))}
      </Sortable>
    );
  },
};

export default meta;

type Story = StoryObj<typeof Sortable>;

export const Default: Story = {
  args: {
    emptyItem: '',
    list: ['First item', 'Second item', 'Third item'],
  },
};

export const Empty: Story = {
  args: {
    buttonText: 'Add New Link',
    emptyItem: '',
    list: [],
  },
};

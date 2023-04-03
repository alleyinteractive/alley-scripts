import React, { useState } from 'react';
import type { Meta, StoryFn } from '@storybook/react';

import Checkboxes from './index';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Block Editor Tools/Components/Checkboxes',
  component: Checkboxes,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as Meta<typeof Checkboxes>;

const options = [
  {
    label: 'Option 1',
    value: 'option-1',
  },
  {
    label: 'Option 2',
    value: 'option-2',
  },
  {
    label: 'Option 3',
    value: 'option-3',
  },
];

const DefaultTemplate: StoryFn<typeof Checkboxes> = ({onChange, ...args }) => {
  const [checked, setChecked] = useState(args.value || []);

  return (
    <Checkboxes
      {...args}
      value={checked}
      onChange={(value) => setChecked(value)}
    />
  );
};

export const Default = DefaultTemplate.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {
  label: 'Settings',
  options,
};

export const Selected = DefaultTemplate.bind({});
Selected.args = {
  label: 'Settings',
  value: [
    'option-1',
  ],
  options,
};

export const MultipleSelected = DefaultTemplate.bind({});
MultipleSelected.args = {
  label: 'Settings',
  value: [
    'option-1',
    'option-3',
  ],
  options,
};

import React, { useState } from 'react';
import type { ComponentMeta, ComponentStory } from '@storybook/react';

import Checkboxes from './index';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/Checkboxes',
  component: Checkboxes,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof Checkboxes>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = (args: object) => <Checkboxes {...args} />;

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

const DefaultTemplate: ComponentStory<typeof Checkboxes> = ({onChange, ...args }) => {
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

import React from 'react';
import { ComponentMeta } from '@storybook/react';

import AudioPicker from './index';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/Audio Picker',
  component: AudioPicker,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof AudioPicker>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = (args: object) => <AudioPicker {...args} />;

export const Default = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {
  src: '',
  value: 0,
};

export const Selected = Template.bind({});
Selected.args = {
  src: 'https://cldup.com/59IrU0WJtq.mp3',
  value: 1,
};

import React from 'react';
import type { ComponentMeta, ComponentStory } from '@storybook/react';

import ImagePicker from './index';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  component: ImagePicker,
  title: 'Components/Image Picker',
} as ComponentMeta<typeof ImagePicker>;

const DefaultTemplate: ComponentStory<typeof ImagePicker> = (args: any) => (
  <ImagePicker onReset={() => null} onUpdate={() => null} {...args} />
);

export const Default = DefaultTemplate.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {
  value: 1,
  valueURL: 'https://picsum.photos/200/300',
};

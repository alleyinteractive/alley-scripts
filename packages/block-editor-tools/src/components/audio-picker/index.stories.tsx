import React from 'react';
import { useSelect } from '@wordpress/data';
import type { ComponentMeta, ComponentStory } from '@storybook/react';

import AudioPicker from './index';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/Audio Picker',
  component: AudioPicker,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof AudioPicker>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof AudioPicker> = (args: any) => {
  const store: {
    getMedia: () => {
      [key: string]: any;
    };
  } = useSelect(
    (select) => select('core'),
    [],
  );

  const {
    id = 1,
    valueURL = 'https://cldup.com/59IrU0WJtq.mp3',
  } = args;

  // Override the getMedia call to use a local image.
  store.getMedia = () => ({
    id,
    source_url: valueURL || 'https://picsum.photos/200/300',
  });

  return <AudioPicker {...args} />;
};

export const Default = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {
  valueURL: '',
  value: 0,
};

export const Selected = Template.bind({});
Selected.args = {
  value: 1,
  valueURL: 'https://cldup.com/59IrU0WJtq.mp3',
};

import React from 'react';
import { useSelect } from '@wordpress/data';

import type { ComponentMeta, ComponentStory } from '@storybook/react';

import ImagePicker from './index';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  component: ImagePicker,
  title: 'Components/Image Picker',
} as ComponentMeta<typeof ImagePicker>;

const DefaultTemplate: ComponentStory<typeof ImagePicker> = (args: any) => {
  const store: {
    getMedia: () => {
      [key: string]: any;
    };
  } = useSelect(
    (select) => select('core'),
    [],
  );

  const { value = 0 } = args;
  let { valueURL = '' } = args;

  if (!value || value === '0') {
    // Override the getMedia call to return nothing if no value is set.
    store.getMedia = () => ({});
  } else {
    // Ensure that if an ID is set, we always have a URL. This will emulate an
    // ID being set but not a URL.
    if (!valueURL) {
      valueURL = 'https://picsum.photos/200/300';
    }

    // Override the getMedia call to use a local image
    store.getMedia = () => ({
      id: value,
      sizes: {
        thumbnail: {
          url: valueURL,
        },
        full: {
          url: valueURL,
        },
      },
      url: valueURL,
      source_url: valueURL,
    });
  }

  return (
    <ImagePicker
      // Setting the key to the URL forces it to re-render when the URL changes in Canvas.
      key={`image-picker-${valueURL}-${value}`}
      onReset={() => null}
      onUpdate={() => null}
      {...args}
    />
  );
};

export const Default = DefaultTemplate.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {
  value: 0,
  valueURL: '',
};

export const Selected = DefaultTemplate.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Selected.args = {
  value: 1,
  valueURL: 'https://picsum.photos/200/300',
};

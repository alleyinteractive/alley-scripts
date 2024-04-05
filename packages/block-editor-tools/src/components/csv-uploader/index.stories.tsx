import type { Meta, StoryFn } from '@storybook/react';

import CSVUploader from './index';

export default {
  component: CSVUploader,
  title: 'Block Editor Tools/Components/CSV Uploader',
} as Meta<typeof CSVUploader>;

// @ts-expect-error CSVUploader is not a valid component.
const Template = (args: object): StoryFn<typeof CSVUploader> => <CSVUploader {...args} />;

export const Default = Template.bind({});
// @ts-expect-error CSVUploader is not a valid component.
Default.args = {
  attributeName: 'attribute-name',
  setAttributes: () => {},
};

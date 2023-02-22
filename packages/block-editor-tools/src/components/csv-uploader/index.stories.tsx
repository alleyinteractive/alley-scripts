import React from 'react';
import type { ComponentMeta } from '@storybook/react';

import CSVUploader from './index';

export default {
  component: CSVUploader,
  title: 'Components/CSV Uploader',
} as ComponentMeta<typeof CSVUploader>;

// @ts-expect-error CSVUploader is not a valid component.
const Template = (args: object) => <CSVUploader {...args} />;

export const Default = Template.bind({});
Default.args = {
  attributeName: 'attribute-name',
  setAttributes: () => {},
};

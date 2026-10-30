import { Preview } from "@storybook/react";
import { WithStyles } from "./decorators/with-styles";

import "@wordpress/core-data";
import "./mocks/api";

const preview: Preview = {
  decorators: [
    WithStyles,
  ],
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;

import { Preview } from "@storybook/react";
import { WithStyles } from "./decorators/with-styles";

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

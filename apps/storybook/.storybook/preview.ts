import type { Preview } from '@storybook/react';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      element: 'body',
      config: {},
      options: {},
      manual: true,
    },
  },

  tags: ['autodocs'],
};

export default preview;

import React from 'react';
import { themes } from '@storybook/theming';
import { MantineProvider, ColorSchemeProvider } from '@mantine/core';
// @ts-ignore
import { mantineConfig } from '@config';

function ThemeWrapper(props: { children: React.ReactNode }) {
  return (
    <ColorSchemeProvider colorScheme={'dark'} toggleColorScheme={() => {}}>
      <MantineProvider theme={{ ...mantineConfig, colorScheme: 'dark' }} withGlobalStyles withNormalizeCSS>
        {props.children}
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export const decorators = [(renderStory: Function) => <ThemeWrapper>{renderStory()}</ThemeWrapper>];

export const parameters = {
  darkMode: {
    // Override the default dark theme
    dark: { ...themes.dark, appBg: 'black' },
    // Override the default light theme
    light: { ...themes.normal, appBg: 'white' },
  },
};

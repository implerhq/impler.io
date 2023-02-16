import React, { useState } from 'react';
import { MantineProvider, ColorSchemeProvider } from '@mantine/core';
// @ts-ignore
import { mantineConfig } from '@config';

function ThemeWrapper(props: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <ColorSchemeProvider
      colorScheme={isDarkMode ? 'dark' : 'light'}
      toggleColorScheme={() => setIsDarkMode(!isDarkMode)}
    >
      <MantineProvider
        theme={{ ...mantineConfig, colorScheme: isDarkMode ? 'dark' : 'light' }}
        withGlobalStyles
        withNormalizeCSS
      >
        {props.children}
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export const decorators = [(renderStory: Function) => <ThemeWrapper>{renderStory()}</ThemeWrapper>];

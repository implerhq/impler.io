/* eslint-disable @typescript-eslint/no-unused-vars, no-unused-vars */
import { createStyles, MantineTheme } from '@mantine/core';
import React from 'react';

export const getHeaderStyles = (theme: MantineTheme): React.CSSProperties => ({
  marginBottom: theme.spacing.xs,
  marginRight: 0,
});

export const getModalStyles = (theme: MantineTheme): React.CSSProperties => ({
  height: 'calc(100vh - 20%)',
  width: 'calc(100vw - 20%)',
  display: 'flex',
  flexDirection: 'column',
});

export const getModalBodyStyles = (theme: MantineTheme): React.CSSProperties => ({
  flexGrow: 1,
});

export const getTitleStyles = (theme: MantineTheme) => ({
  visibility: 'visible',
  [`@media (min-width: ${theme.breakpoints.md}px)`]: {
    visibility: 'hidden',
  },
});

export default createStyles((theme: MantineTheme, params, getRef): Record<string, any> => {
  return {
    title: getTitleStyles(theme),
    header: getHeaderStyles(theme),
    content: getModalStyles(theme),
    body: getModalBodyStyles(theme),
  };
});

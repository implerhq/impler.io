/* eslint-disable @typescript-eslint/no-unused-vars, no-unused-vars */
import { createStyles, MantineTheme } from '@mantine/core';
import React from 'react';

export const getHeaderStyles = (theme: MantineTheme): React.CSSProperties => ({
  marginBottom: theme.spacing.xs,
  marginRight: 0,
});

export const getModalStyles = (theme: MantineTheme): React.CSSProperties => ({
  padding: '100px',
  height: 'calc(100vh - 20%)',
  width: 'calc(100vw - 20%)',
  display: 'flex',
  flexDirection: 'column',
});

export const getModalBodyStyles = (theme: MantineTheme): React.CSSProperties => ({
  flexGrow: 1,
});

export default createStyles((theme: MantineTheme, params, getRef): Record<string, any> => {
  return {
    header: getHeaderStyles(theme),
    modal: getModalStyles(theme),
    body: getModalBodyStyles(theme),
  };
});

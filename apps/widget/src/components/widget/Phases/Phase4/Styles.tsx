/* eslint-disable @typescript-eslint/no-unused-vars, no-unused-vars */
import { colors } from '@config';
import { createStyles, MantineTheme } from '@mantine/core';
import React from 'react';

export const getWrapperStyles = (theme: MantineTheme): React.CSSProperties => ({
  flexDirection: 'column',
  textAlign: 'center',
  alignItems: 'center',
  justifyContent: 'center',
  flexGrow: 1,
  overflow: 'auto',
  height: '100%',
  gap: 0,
});

export const getCheckIconStyles = (theme: MantineTheme): React.CSSProperties => ({
  backgroundColor: colors.success,
  color: colors.white,
  borderRadius: '100%',
  height: 50,
  padding: 5,
  [`@media (min-width: ${theme.breakpoints.md}px)`]: {
    height: 70,
    padding: 10,
  },
});

export const getTitleStyles = (theme: MantineTheme): React.CSSProperties => ({
  fontSize: theme.fontSizes.xl,
  [`@media (min-width: ${theme.breakpoints.md}px)`]: {
    fontSize: 30,
  },
});

export const getSubTitleStyles = (theme: MantineTheme): React.CSSProperties => ({
  fontSize: theme.fontSizes.lg,
  [`@media (min-width: ${theme.breakpoints.md}px)`]: {
    fontSize: 25,
  },
});

export default createStyles((theme: MantineTheme, params, getRef): Record<string, any> => {
  return {
    subTitle: getSubTitleStyles(theme),
    title: getTitleStyles(theme),
    wrapper: getWrapperStyles(theme),
    check: getCheckIconStyles(theme),
  };
});

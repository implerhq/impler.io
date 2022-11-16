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
  height: 70,
  borderRadius: '100%',
  padding: 10,
});

export default createStyles((theme: MantineTheme, params, getRef): Record<string, any> => {
  return {
    wrapper: getWrapperStyles(theme),
    check: getCheckIconStyles(theme),
  };
});

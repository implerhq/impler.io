/* eslint-disable @typescript-eslint/no-unused-vars, no-unused-vars */
import { colors } from '../../config/colors.config';
import { createStyles, MantineTheme } from '@mantine/core';
import { IStepperProps } from './Stepper';

export const getSeparatorStyles = (theme: MantineTheme) => ({
  backgroundColor: 'none',
  flex: 0,
  marginLeft: 7,
  marginRight: 7,
  color: colors.lightGray,
});

export const getStepLabelStyles = (theme: MantineTheme) => ({
  color: colors.darkDeem,
  fontWeight: 600,
});

export const getStepBodyStyles = (theme: MantineTheme) => ({
  marginLeft: '5px',
});

export default createStyles((theme: MantineTheme, params: IStepperProps, getRef): Record<string, any> => {
  return {
    separator: getSeparatorStyles(theme),
    stepLabel: getStepLabelStyles(theme),
    stepBody: getStepBodyStyles(theme),
  };
});

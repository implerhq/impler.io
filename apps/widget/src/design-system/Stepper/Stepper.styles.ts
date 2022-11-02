/* eslint-disable @typescript-eslint/no-unused-vars, no-unused-vars */
import { colors } from '../../config/colors.config';
import { createStyles, MantineTheme } from '@mantine/core';
import { IStepperProps } from './Stepper';

export const getSeparatorStyles = (theme: MantineTheme) => ({
  backgroundColor: 'none',
  flex: 0,
  marginLeft: 10,
  marginRight: 10,
  color: colors.lightGray,
});

export default createStyles((theme: MantineTheme, params: IStepperProps, getRef) => {
  return {
    separator: getSeparatorStyles(theme),
  };
});

import { Text, TextProps } from '@mantine/core';
import React from 'react';
import { colors } from '@config';

type ModifiedTextProps = TextProps;

export function ModifiedText({ children, ...props }: ModifiedTextProps): JSX.Element {
  return (
    <Text color={colors.StrokeDark} {...props}>
      {children}
    </Text>
  );
}

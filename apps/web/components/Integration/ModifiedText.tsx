import { useMantineColorScheme, Text, TextProps } from '@mantine/core';
import React from 'react';
import { colors } from '@config';

type ModifiedTextProps = TextProps;

export function ModifiedText({ children, ...props }: ModifiedTextProps): JSX.Element {
  const { colorScheme } = useMantineColorScheme();

  return (
    <Text color={colorScheme === 'dark' ? colors.StrokeLight : colors.StrokeDark} {...props}>
      {children}
    </Text>
  );
}

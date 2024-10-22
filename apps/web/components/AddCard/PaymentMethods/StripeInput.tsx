import React from 'react';
import { Box, Text } from '@mantine/core';
import { colors, stripeElementsOptions } from '@config';

interface StripeInputProps {
  label: string;
  StripeElement: React.ComponentType<any>;
  isFullWidth?: boolean;
}

export function StripeInput({ label, StripeElement, isFullWidth = false }: StripeInputProps) {
  return (
    <Box w={isFullWidth ? '100%' : 'auto'}>
      <Text size="sm" weight={500} color={colors.blackGrey} mb={6}>
        {label}
      </Text>
      <Box
        sx={{
          border: `1px solid ${colors.black}`,
          borderRadius: '4px',
          padding: '8px',
          backgroundColor: colors.white,
        }}
      >
        <StripeElement options={stripeElementsOptions} />
      </Box>
    </Box>
  );
}

// StripeInput.tsx
import React, { useState } from 'react';
import { Box, Text } from '@mantine/core';
import { colors } from '@config';

interface StripeInputProps {
  label: string;
  StripeElement: React.ComponentType<any>;
  isFullWidth?: boolean;
  error?: string;
  required?: boolean;
  onChange: (event: any) => void;
  options?: any;
}

export function StripeInput({
  label,
  StripeElement,
  isFullWidth = false,
  error,
  required = false,
  onChange,
  options,
}: StripeInputProps) {
  const [isClicked, setIsClicked] = useState(false);

  return (
    <Box w={isFullWidth ? '100%' : 'auto'}>
      <Text size="sm" weight={500} color={error ? colors.danger : colors.blackGrey} mb={6}>
        {label} {required && <span style={{ color: colors.danger }}>*</span>}
      </Text>
      <Box
        style={{
          border: `1px solid ${error && isClicked ? colors.danger : colors.black}`,
          borderRadius: '4px',
          padding: '8px',
          backgroundColor: colors.white,
        }}
      >
        <StripeElement
          options={options}
          onChange={(event: any) => {
            setIsClicked(true);
            onChange(event);
          }}
          onBlur={() => setIsClicked(true)}
        />
      </Box>
      {error && isClicked && (
        <Text size="xs" color="red" mt={4}>
          {error}
        </Text>
      )}
    </Box>
  );
}

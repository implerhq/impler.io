import React from 'react';
import Image from 'next/image';
import { colors } from '@config';
import { capitalizeFirstLetter } from '@shared/utils';
import { Flex, Radio, Stack, Text, useMantineTheme } from '@mantine/core';

interface PaymentMethodOptionProps {
  method: {
    paymentMethodId: string;
    brand: string;
    last4Digits: string;
    expMonth: number;
    expYear: number;
  };
  selected: boolean;
  onChange: (methodId: string) => void;
}

export function PaymentMethodOption({ method, selected, onChange }: PaymentMethodOptionProps) {
  const theme = useMantineTheme();
  const cardBrandsSrc = method.brand.toLowerCase().replaceAll(' ', '_') || 'default';

  const handleClick = () => {
    onChange(method.paymentMethodId);
  };

  return (
    <div style={{ marginBottom: '20px', cursor: 'pointer' }} onClick={handleClick}>
      <Flex
        justify="space-between"
        align="center"
        p="xl"
        style={{
          border: `1px solid ${selected ? colors.blue : 'transparent'}`,
          backgroundColor: selected
            ? theme.colorScheme === 'dark'
              ? colors.BGSecondaryDark
              : colors.BGSecondaryLight
            : 'transparent',
          padding: '8px',
        }}
      >
        <Flex align="center" gap="xl">
          <Radio value={method.paymentMethodId} id={method.paymentMethodId} checked={selected} />
          <Stack spacing={4}>
            <Text fw={700} size="md">
              {capitalizeFirstLetter(method.brand)} **** {method.last4Digits}
            </Text>
            <Text size="sm">Expires {`${method.expMonth}/${method.expYear}`}</Text>
          </Stack>
        </Flex>
        <Image width={50} height={30} src={`/images/cards/${cardBrandsSrc}.png`} alt="Card Company" />
      </Flex>
    </div>
  );
}

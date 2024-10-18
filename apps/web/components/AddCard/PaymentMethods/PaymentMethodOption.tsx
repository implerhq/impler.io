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
    <label style={{ border: `1px solid ${colors.grey}`, padding: theme.spacing.xs }} onClick={handleClick}>
      <Flex gap="xs" direction="row" align="top">
        <Radio value={method.paymentMethodId} id={method.paymentMethodId} checked={selected} onChange={handleClick} />
        <Stack spacing={4}>
          <Text color={colors.grey} fw={700} size="md">
            {capitalizeFirstLetter(method.brand)} **** {method.last4Digits}
          </Text>
          <Text fw="bold" color={colors.black} size="xs">
            Expires {`${method.expMonth}/${method.expYear}`}
          </Text>
        </Stack>
        <Image width={35} height={30} src={`/images/cards/${cardBrandsSrc}.png`} alt="Card Company" />
      </Flex>
    </label>
  );
}

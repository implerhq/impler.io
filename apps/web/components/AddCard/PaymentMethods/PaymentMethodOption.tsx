import React from 'react';
import Image from 'next/image';
import { colors } from '@config';
import { Flex, Group, Radio, Stack, Text, useMantineTheme } from '@mantine/core';
import { useStyles } from './PaymentMethods.styles';

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
  const { classes } = useStyles();

  const cardBrandsSrc = method.brand.toLowerCase().replaceAll(' ', '_') || 'default';

  const handleClick = () => {
    onChange(method.paymentMethodId);
  };

  return (
    <label
      style={{
        cursor: 'pointer',
        padding: theme.spacing.xs,
        borderRadius: theme.spacing.xs,
        border: `1px solid ${colors.StrokeSecondaryLight}`,
      }}
      onClick={handleClick}
    >
      <Flex gap="xs" align="top" justify="space-between">
        <Group align="top" spacing={4}>
          <Radio
            size="xs"
            checked={selected}
            id={method.paymentMethodId}
            onChange={handleClick}
            value={method.paymentMethodId}
            className={classes.radio}
          />
          <Stack spacing={4}>
            <Text color={colors.grey} size="xs">
              Expires {`${method.expMonth}/${method.expYear}`}
            </Text>
            <Text color={colors.black} fw={700} size="md">
              #### {method.last4Digits}
            </Text>
          </Stack>
        </Group>
        <Image width={40} height={30} src={`/images/cards/${cardBrandsSrc}.png`} alt="Card Company" />
      </Flex>
    </label>
  );
}

import React from 'react';
import Image from 'next/image';
import { Card as MantineCard, Group, Stack, Text, useMantineColorScheme } from '@mantine/core';

import { colors } from '@config';
import { Button } from '@ui/button';
import useStyles from './Card.styles';
import { ICardData } from '@impler/shared';
import { DeleteIcon } from '@assets/icons/Delete.icon';

interface CardProps {
  data: ICardData;
  onRemoveCardClick: (paymentMethodId: string) => void;
}

export const Card = ({ data, onRemoveCardClick }: CardProps) => {
  const { classes } = useStyles();
  const { colorScheme } = useMantineColorScheme();
  const src = data.brand.toLowerCase()?.replaceAll(' ', '_') || 'default';

  return (
    <MantineCard withBorder className={classes.card} p="sm">
      <Stack>
        <Image width={50} height={30} src={`/images/cards/${src}.png`} alt="Card Company" />

        <Stack spacing="xs">
          <Text size="xs" fw="lighter" color={colors.grey}>
            Card Number
          </Text>
          <Text size="xl" fw="bolder" color={colorScheme === 'dark' ? colors.TXTDark : colors.TXTLight}>
            **** **** **** {data.last4Digits}
          </Text>
        </Stack>

        <Group position="apart">
          <Stack spacing="xs">
            <Text size="xs" fw="lighter" color={colors.grey}>
              Expiry Date
            </Text>
            <Text size="xl" fw="bolder" color={colorScheme === 'dark' ? colors.TXTDark : colors.TXTLight}>
              {`${data?.expMonth}/${data?.expYear}`}
            </Text>
          </Stack>

          <Button
            borderLess
            color="red"
            variant="outline"
            leftIcon={<DeleteIcon />}
            onClick={() => onRemoveCardClick(data.paymentMethodId)}
          >
            Remove
          </Button>
        </Group>
      </Stack>
    </MantineCard>
  );
};

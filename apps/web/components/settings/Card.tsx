import React from 'react';
import Image from 'next/image';
import { ICardData } from '@impler/shared';
import { Flex, Group, Stack, Text } from '@mantine/core';

import { colors } from '@config';
import { IconButton } from '@ui/icon-button';
import { DeleteIcon } from '@assets/icons/Delete.icon';

interface CardProps {
  refetchPaymentMethods: () => void;
  data: ICardData;
  onRemoveCardClick: () => void;
}

export function Card({ data, onRemoveCardClick }: CardProps) {
  const src = data.brand.toLowerCase()?.replaceAll(' ', '_') || 'default';
  const expiry = `${data?.expMonth}/${data?.expYear}`;

  return (
    <Stack bg="gray" p="xs" spacing="xs" style={{ flexGrow: 1 }}>
      <Flex justify="space-between">
        <Text fs="italic" size="md">
          xxxx {data.last4Digits}
        </Text>
        <IconButton onClick={onRemoveCardClick} label="Remove Card">
          <DeleteIcon color={colors.danger} />
        </IconButton>
      </Flex>
      <Flex justify="space-between" gap="xs" wrap="wrap">
        <Group spacing="xs">
          <Text fw="lighter">Expiry:</Text>
          <Text tt="uppercase" size="md" fw="bold" className="uppercase text-xl font-bold">
            {expiry}
          </Text>
        </Group>
        <Image width={75} height={35} src={`/images/cards/${src}.png`} alt="CC" />
      </Flex>
    </Stack>
  );
}

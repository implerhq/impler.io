import React from 'react';
import Link from 'next/link';
import { Group, Title, Text } from '@mantine/core';
import { colors } from '@config';
import { ICardData } from '@impler/shared';
import { PaymentMethodOption } from './PaymentMethods';

interface CurrentCardSectionProps {
  activeCard: ICardData | undefined;
  hasPaymentMethods: boolean;
  onAddNewClick: () => void;
}

export function CurrentCardSection({ activeCard, hasPaymentMethods, onAddNewClick }: CurrentCardSectionProps) {
  return (
    <>
      <Group position="apart">
        <Title color={colors.black} fw="bold" order={3}>
          Current Card
        </Title>
        {hasPaymentMethods && (
          <Link href="#" onClick={onAddNewClick}>
            <Text weight={500} color={colors.blue}>
              + Add New Card
            </Text>
          </Link>
        )}
      </Group>

      {activeCard && (
        <PaymentMethodOption
          method={{
            paymentMethodId: activeCard.paymentMethodId,
            brand: activeCard.brand,
            last4Digits: activeCard.last4Digits,
            expMonth: activeCard.expMonth,
            expYear: activeCard.expYear,
          }}
          selected={true}
          onChange={() => {}}
          showRadio={false}
        />
      )}
    </>
  );
}

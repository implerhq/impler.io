import React, { useState } from 'react';
import { Stack, Group, Title, Text, Flex } from '@mantine/core';
import Link from 'next/link';
import { Button } from '@ui/button';
import { PaymentMethods } from './PaymentMethods';
import { AddNewPaymentMethodForm } from './PaymentMethods/AddNewPaymentMethodForm';
import { colors } from '@config';
import { ICardData } from '@impler/shared';
import { CurrentCardSection } from './CurrentCardSection';

interface CardFormProps {
  showForm: boolean;
  activeCard: ICardData | undefined;
  paymentMethods?: ICardData[];
  selectedPaymentMethod: string | undefined;
  isLoading: boolean;
  onToggleForm: () => void;
  onPaymentMethodChange: (id: string) => void;
  onSubmit: () => void;
}

export function CardForm({
  showForm,
  activeCard,
  paymentMethods,
  selectedPaymentMethod,
  isLoading,
  onToggleForm,
  onPaymentMethodChange,
  onSubmit,
}: CardFormProps) {
  const [isFormValid, setIsFormValid] = useState(false);

  const handleSubmit = () => {
    if (showForm && !isFormValid) {
      return;
    }
    onSubmit();
  };

  return (
    <Flex direction="column" h="100%">
      <Stack spacing="lg" style={{ flex: 1 }}>
        {showForm ? (
          <>
            <Group position="apart">
              <Title color={colors.black} fw="bold" order={3}>
                Add New Card
              </Title>
              <Link href="#" onClick={onToggleForm}>
                <Text weight={500} color={colors.blue}>
                  Show Added Cards
                </Text>
              </Link>
            </Group>
            <AddNewPaymentMethodForm setIsValid={setIsFormValid} />
          </>
        ) : (
          <Stack spacing="sm">
            <CurrentCardSection
              activeCard={activeCard}
              hasPaymentMethods={Boolean(paymentMethods?.length)}
              onAddNewClick={onToggleForm}
            />
            <Title color={colors.black} fw="bold" order={3}>
              New Card
            </Title>
            <PaymentMethods
              paymentMethods={paymentMethods}
              selectedPaymentMethod={selectedPaymentMethod}
              handlePaymentMethodChange={onPaymentMethodChange}
            />
          </Stack>
        )}
      </Stack>

      <Stack spacing="sm" mt="lg">
        <Button fullWidth size="md" color="blue" loading={isLoading} onClick={handleSubmit}>
          {showForm ? 'Add Card' : 'Change Card'}
        </Button>
      </Stack>
    </Flex>
  );
}

import React, { useState } from 'react';
import Link from 'next/link';
import { Flex, Loader, Stack, Group, Title, Text, Card } from '@mantine/core';
import { usePaymentMethods } from '@hooks/usePaymentMethods';
import { ActiveSubscriptionContent } from './ActiveSubscriptionContent';
import { usePlanDetails } from '@hooks/usePlanDetails';
import { colors } from '@config';
import { Button } from '@ui/button';
import { useUpdatePaymentMethod } from '@hooks/useUpdatePaymentMethod';
import { PaymentMethods } from './PaymentMethods';
import { AddNewPaymentMethodForm } from './PaymentMethods/AddNewPaymentMethodForm';
import { useStripe, useElements, CardNumberElement } from '@stripe/react-stripe-js';
import { useAddCard } from '@hooks/useAddCard';

export interface ChangeCardModalContentProps {
  email: string;
  planCode: string;
  onClose: () => void;
}

export function ChangeCard({ email }: ChangeCardModalContentProps) {
  const { paymentMethods, isPaymentMethodsLoading, refetchPaymentMethods } = usePaymentMethods();
  const { activePlanDetails, isActivePlanLoading } = usePlanDetails({ email });
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | undefined>();
  const [showForm, setShowForm] = useState(false);
  const { updatePaymentMethod, isUpdatePaymentMethodLoading } = useUpdatePaymentMethod();
  const { addPaymentMethod, isAddPaymentMethodLoading } = useAddCard({ refetchPaymentMethods });

  const stripe = useStripe();
  const elements = useElements();

  const toggleFormVisibility = () => {
    setShowForm((prev) => {
      if (!prev) {
        setSelectedPaymentMethod(undefined);
      }

      return !prev;
    });
  };

  const handleAddCard = async () => {
    if (!stripe || !elements) return;

    const cardNumberElement = elements.getElement(CardNumberElement);
    if (!cardNumberElement) return;

    const { paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardNumberElement,
    });

    if (paymentMethod) {
      await addPaymentMethod(paymentMethod.id);
      setShowForm(false);
    }
  };

  if (isActivePlanLoading || isPaymentMethodsLoading) {
    return (
      <Flex align="center" justify="center" style={{ minHeight: '200px' }}>
        <Loader />
      </Flex>
    );
  }

  return (
    <Flex bg={colors.white} gap={0}>
      <ActiveSubscriptionContent activePlanDetails={activePlanDetails} email={email} />

      <Card bg={colors.white} withBorder shadow="sm" w="50%" radius={0}>
        <Stack spacing="lg" style={{ height: '100%' }}>
          <Group position="apart">
            <Title color={colors.black} fw="bold" order={3}>
              Change Card
            </Title>
            {paymentMethods && paymentMethods.length > 0 ? (
              <Link color={colors.blue} href="#" onClick={toggleFormVisibility}>
                <Text weight={500}>{showForm ? 'Show Added Cards' : '+ Add New Card'}</Text>
              </Link>
            ) : null}
          </Group>

          <Stack spacing="md" style={{ flexGrow: 1 }}>
            {showForm ? (
              <>
                <AddNewPaymentMethodForm />
                <Button fullWidth size="md" color="blue" loading={isAddPaymentMethodLoading} onClick={handleAddCard}>
                  Add Card
                </Button>
              </>
            ) : (
              <>
                <Group position="apart">
                  <Title size="sm" color={colors.black} fw="bold" order={3}>
                    Selected Card
                  </Title>
                </Group>

                <PaymentMethods
                  paymentMethods={paymentMethods}
                  selectedPaymentMethod={selectedPaymentMethod}
                  handlePaymentMethodChange={setSelectedPaymentMethod}
                />

                <Button
                  fullWidth
                  size="md"
                  color="blue"
                  loading={isUpdatePaymentMethodLoading}
                  onClick={() => {
                    if (selectedPaymentMethod) {
                      updatePaymentMethod({ paymentMethodId: selectedPaymentMethod, email });
                    }
                  }}
                >
                  Change Card
                </Button>
              </>
            )}
          </Stack>
        </Stack>
      </Card>
    </Flex>
  );
}

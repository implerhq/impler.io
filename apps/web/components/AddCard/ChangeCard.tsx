import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Flex, Loader, Stack, Group, Title, Text, Card } from '@mantine/core';
import { usePaymentMethods } from '@hooks/usePaymentMethods';
import { ActiveSubscriptionContent } from './ActiveSubscriptionContent';
import { usePlanDetails } from '@hooks/usePlanDetails';
import { colors } from '@config';
import { Button } from '@ui/button';
import { useUpdatePaymentMethod } from '@hooks/useUpdatePaymentMethod';
import { PaymentMethodOption, PaymentMethods } from './PaymentMethods';
import { AddNewPaymentMethodForm } from './PaymentMethods/AddNewPaymentMethodForm';
import { useStripe, useElements, CardNumberElement } from '@stripe/react-stripe-js';
import { useAddCard } from '@hooks/useAddCard';
import { ICardData } from '@impler/shared';

export interface ChangeCardModalContentProps {
  email: string;
  planCode: string;
  onClose: () => void;
}

export function ChangeCard({ email }: ChangeCardModalContentProps) {
  const { paymentMethods, isPaymentMethodsLoading, refetchPaymentMethods } = usePaymentMethods();
  const { activePlanDetails, isActivePlanLoading } = usePlanDetails({ email });
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | undefined>();
  const [activeCard, setActiveCard] = useState<ICardData | undefined>(undefined);
  const [showForm, setShowForm] = useState(false);
  const { updatePaymentMethod, isUpdatePaymentMethodLoading } = useUpdatePaymentMethod();
  const { addPaymentMethod, isAddPaymentMethodLoading } = useAddCard({ refetchPaymentMethods });

  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    if (paymentMethods) {
      setActiveCard(paymentMethods[0]);
      setSelectedPaymentMethod(paymentMethods[0]?.paymentMethodId);
    }
  }, [paymentMethods]);

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
      addPaymentMethod(paymentMethod.id);
      setShowForm(false);
      await refetchPaymentMethods();
    }
  };

  const handleChangeCard = async () => {
    if (selectedPaymentMethod) {
      await updatePaymentMethod({ paymentMethodId: selectedPaymentMethod, email });
      const newActiveCard = paymentMethods?.find((method) => method.paymentMethodId === selectedPaymentMethod);
      setActiveCard(newActiveCard);
    }
  };

  if (isActivePlanLoading || isPaymentMethodsLoading) {
    return (
      <Flex align="center" justify="center" h={200}>
        <Loader />
      </Flex>
    );
  }

  return (
    <Flex bg={colors.white} gap={0}>
      <ActiveSubscriptionContent activePlanDetails={activePlanDetails} email={email} />

      <Card bg={colors.white} withBorder shadow="sm" w="50%" radius={0}>
        <Flex direction="column" h="100%" justify="space-between">
          <Stack spacing="lg">
            {showForm ? (
              <>
                <Group position="apart">
                  <Title color={colors.black} fw="bold" order={3}>
                    Add New Card
                  </Title>
                  <Link href="#" onClick={toggleFormVisibility}>
                    <Text weight={500} color={colors.blue}>
                      Show Added Cards
                    </Text>
                  </Link>
                </Group>
                <AddNewPaymentMethodForm />
              </>
            ) : (
              <>
                <Group position="apart">
                  <Title color={colors.black} fw="bold" order={3}>
                    Change Card
                  </Title>
                  {paymentMethods && paymentMethods.length > 0 ? (
                    <Link href="#" onClick={toggleFormVisibility}>
                      <Text weight={500} color={colors.blue}>
                        + Add New Card
                      </Text>
                    </Link>
                  ) : null}
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
                  />
                )}

                <PaymentMethods
                  paymentMethods={paymentMethods}
                  selectedPaymentMethod={selectedPaymentMethod}
                  handlePaymentMethodChange={(id) => {
                    setSelectedPaymentMethod(id);
                  }}
                />
              </>
            )}
            <Button
              fullWidth
              size="md"
              color="blue"
              loading={isAddPaymentMethodLoading || isUpdatePaymentMethodLoading}
              onClick={showForm ? handleAddCard : handleChangeCard}
            >
              {showForm ? 'Add Card' : 'Change Card'}
            </Button>
          </Stack>
        </Flex>
      </Card>
    </Flex>
  );
}

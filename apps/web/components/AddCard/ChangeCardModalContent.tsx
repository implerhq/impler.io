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

export interface ChangeCardModalContentProps {
  email: string;
  planCode: string;
  onClose: () => void;
}

export function ChangeCardModalContent({ email }: ChangeCardModalContentProps) {
  const { paymentMethods, isPaymentMethodsLoading } = usePaymentMethods();
  const { activePlanDetails, isActivePlanLoading } = usePlanDetails({ email });
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | undefined>();
  const [showForm, setShowForm] = useState(false);
  const { updatePaymentMethod, isUpdatePaymentMethodLoading } = useUpdatePaymentMethod({
    refetchPaymentMethods: () => {},
  });

  const toggleFormVisibility = () => {
    setShowForm((prev) => {
      if (!prev) {
        setSelectedPaymentMethod(undefined);
      }

      return !prev;
    });
  };

  if (isActivePlanLoading || isPaymentMethodsLoading) {
    return (
      <Flex align="center" justify="center" style={{ minHeight: '200px' }}>
        <Loader />
      </Flex>
    );
  }

  const selectedMethodDetails = paymentMethods?.find((method) => method.paymentMethodId === selectedPaymentMethod);

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
            <Group position="apart">
              <Title size="sm" color={colors.black} fw="bold" order={3}>
                Selected Card
              </Title>
            </Group>

            {selectedMethodDetails ? (
              <PaymentMethods
                paymentMethods={paymentMethods}
                selectedPaymentMethod={selectedMethodDetails.paymentMethodId}
                handlePaymentMethodChange={setSelectedPaymentMethod}
              />
            ) : null}

            {showForm ? (
              <>
                <AddNewPaymentMethodForm />
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
            ) : (
              <PaymentMethods
                paymentMethods={paymentMethods}
                selectedPaymentMethod={selectedPaymentMethod}
                handlePaymentMethodChange={setSelectedPaymentMethod}
              />
            )}
          </Stack>

          {!showForm && (
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
          )}
        </Stack>
      </Card>
    </Flex>
  );
}

import { useEffect, useState } from 'react';
import getConfig from 'next/config';
import { useRouter } from 'next/router';
import { modals } from '@mantine/modals';
import { Radio, Flex, Text, Loader, Group, Divider, Title, Stack, useMantineTheme } from '@mantine/core';
import { Button } from '@ui/button';

import Image from 'next/image';
import { MODAL_KEYS, ROUTES, colors } from '@config';
import { usePaymentMethods } from '@hooks/usePaymentMethods';

const { publicRuntimeConfig } = getConfig();

interface SelectCardModalProps {
  email: string;
  planCode: string;
  onClose: () => void;
  paymentMethodId?: string;
}

export function SelectCardModal({ email, planCode, onClose, paymentMethodId }: SelectCardModalProps) {
  const theme = useMantineTheme();
  const router = useRouter();
  const { action } = router.query;
  const gatewayURL = publicRuntimeConfig.NEXT_PUBLIC_PAYMENT_GATEWAY_URL;
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | undefined>(paymentMethodId);
  const { paymentMethods, isPaymentMethodsLoading } = usePaymentMethods({ enabled: action !== 'addcardmodal' });

  const handleProceed = () => {
    if (selectedPaymentMethod) {
      router.push(
        `${gatewayURL}/api/v1/plans/${planCode}/buy/${email}/redirect?paymentMethodId=${selectedPaymentMethod}`
      );
      onClose();
    }
  };

  const handleAddMoreCard = () => {
    modals.close(MODAL_KEYS.SELECT_CARD);
    modals.close(MODAL_KEYS.PAYMENT_PLANS);

    router.push(ROUTES.ADD_CARD);
  };

  useEffect(() => {
    if (paymentMethods && paymentMethods?.length > 0 && !selectedPaymentMethod) {
      setSelectedPaymentMethod(paymentMethods[0].paymentMethodId);
    }
  }, [paymentMethods, selectedPaymentMethod]);

  const handlePaymentMethodChange = (methodId: string) => {
    setSelectedPaymentMethod(methodId);
  };

  return isPaymentMethodsLoading ? (
    <Loader />
  ) : (
    <>
      <Radio.Group
        name="paymentMethod"
        label={<Title size={20}>Select the card you want to proceed with</Title>}
        value={selectedPaymentMethod || undefined}
        onChange={handlePaymentMethodChange}
        w={480}
      >
        <Divider my="sm" mt={10} />
        {paymentMethods?.map((method) => {
          const cardBrandsSrc = method.brand.toLowerCase().replaceAll(' ', '_') || 'default';

          return (
            <label htmlFor={method.paymentMethodId} key={method.paymentMethodId}>
              <Flex
                justify="space-between"
                align="center"
                p="xs"
                style={{
                  border: `1px solid ${selectedPaymentMethod === method.paymentMethodId ? colors.blue : 'transparent'}`,
                  cursor: 'pointer',
                  backgroundColor:
                    selectedPaymentMethod === method.paymentMethodId
                      ? theme.colorScheme === 'dark'
                        ? colors.BGSecondaryDark
                        : colors.BGSecondaryLight
                      : 'transparent',
                }}
              >
                <Group spacing="sm">
                  <Radio
                    value={method.paymentMethodId}
                    id={method.paymentMethodId}
                    checked={selectedPaymentMethod === method.paymentMethodId}
                  />
                  <Stack spacing={2}>
                    <Text fw={700} size="md">
                      {method.brand[0].toUpperCase() + method.brand.slice(1)} **** {method.last4Digits}
                    </Text>
                    <Text mt={10} size="sm">
                      Expires {`${method.expMonth}/${method.expYear}`}
                    </Text>
                  </Stack>
                </Group>
                <Image width={50} height={30} src={`/images/cards/${cardBrandsSrc}.png`} alt="Card Company" />
              </Flex>
            </label>
          );
        })}
        <Flex gap="xl" mt="lg">
          <Button pr={20} variant="outline" onClick={handleAddMoreCard} fullWidth>
            + Add Card
          </Button>
          <Button onClick={handleProceed} variant="filled" fullWidth>
            Proceed
          </Button>
        </Flex>
      </Radio.Group>
    </>
  );
}

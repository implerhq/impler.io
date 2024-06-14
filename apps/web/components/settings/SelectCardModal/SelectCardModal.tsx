import Image from 'next/image';
import getConfig from 'next/config';
import { useRouter } from 'next/router';
import { modals } from '@mantine/modals';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Radio, Flex, Text, Loader, Group, Divider, Title, Stack, useMantineTheme } from '@mantine/core';

import { Button } from '@ui/button';
import { notify } from '@libs/notify';
import { commonApi } from '@libs/api';
import { ICardData, IErrorObject } from '@impler/shared';
import { API_KEYS, MODAL_KEYS, NOTIFICATION_KEYS, ROUTES, colors } from '@config';
import { capitalizeFirstLetter } from '@shared/utils';

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
  const gatewayURL = publicRuntimeConfig.NEXT_PUBLIC_PAYMENT_GATEWAY_URL;
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | undefined>(paymentMethodId);
  const { data: paymentMethods, isLoading: isPaymentMethodsLoading } = useQuery<
    unknown,
    IErrorObject,
    ICardData[],
    [string]
  >([API_KEYS.PAYMENT_METHOD_LIST], () => commonApi<ICardData[]>(API_KEYS.PAYMENT_METHOD_LIST as any, {}), {
    onSuccess(data) {
      if (data?.length === 0) {
        notify(NOTIFICATION_KEYS.NO_PAYMENT_METHOD_FOUND, {
          title: 'No Cards Found!',
          message: 'Please Add your Card first. Redirecting you to cards!',
          color: 'red',
        });
        modals.closeAll();
        router.push(ROUTES.ADD_CARD);
      }
    },
  });

  const handleProceed = () => {
    modals.closeAll();
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

  return (
    <>
      <Radio.Group
        name="paymentMethod"
        label={<Title size={20}>Select the card</Title>}
        value={selectedPaymentMethod || undefined}
        onChange={handlePaymentMethodChange}
        w={480}
      >
        <Divider my="sm" mt={10} />
        {isPaymentMethodsLoading ? (
          <Flex align="center" justify="center">
            <Loader />
          </Flex>
        ) : null}

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
                      {capitalizeFirstLetter(method.brand)} **** {method.last4Digits}
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
          <Button pr={20} variant="outline" onClick={handleAddMoreCard} fullWidth disabled={isPaymentMethodsLoading}>
            + Add Card
          </Button>
          <Button onClick={handleProceed} variant="filled" fullWidth disabled={isPaymentMethodsLoading}>
            Proceed
          </Button>
        </Flex>
      </Radio.Group>
    </>
  );
}

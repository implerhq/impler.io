import Image from 'next/image';
import { useState } from 'react';
import getConfig from 'next/config';
import { useRouter } from 'next/router';
import { modals } from '@mantine/modals';
import { useQuery } from '@tanstack/react-query';
import {
  Radio,
  Flex,
  Text,
  Loader,
  Group,
  Divider,
  Title,
  Stack,
  TextInput,
  useMantineTheme,
  Alert,
} from '@mantine/core';

import { notify } from '@libs/notify';
import { Button } from '@ui/button'; // Import your custom Button component
import { commonApi } from '@libs/api';
import { useCoupon } from '@hooks/useCoupon';
import { useCheckout } from '@hooks/useCheckout';
import { CheckoutDetails } from './CheckoutDetails';
import { CheckIcon } from '@assets/icons/Check.icon';
import { capitalizeFirstLetter } from '@shared/utils';
import { ICardData, IErrorObject } from '@impler/shared';
import { API_KEYS, CONSTANTS, MODAL_KEYS, NOTIFICATION_KEYS, ROUTES, colors } from '@config';

const { publicRuntimeConfig } = getConfig();

interface SelectCardModalProps {
  email: string;
  planCode: string;
  onClose: () => void;
  paymentMethodId?: string;
}

export function SelectCardModal({ email, planCode, onClose, paymentMethodId }: SelectCardModalProps) {
  const router = useRouter();
  const theme = useMantineTheme();

  const gatewayURL = publicRuntimeConfig.NEXT_PUBLIC_PAYMENT_GATEWAY_URL;
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | undefined>(paymentMethodId);
  const {
    data: paymentMethods,
    isLoading: isPaymentMethodsLoading,
    isFetching: isPaymentMethodsFetching,
  } = useQuery<unknown, IErrorObject, ICardData[], [string]>(
    [API_KEYS.PAYMENT_METHOD_LIST],
    () => commonApi<ICardData[]>(API_KEYS.PAYMENT_METHOD_LIST as any, {}),
    {
      onSuccess(data) {
        if (data?.length === 0) {
          notify(NOTIFICATION_KEYS.NO_PAYMENT_METHOD_FOUND, {
            title: 'No Cards Found!',
            message: 'Please Add your Card first. Redirecting you to cards!',
            color: 'red',
          });
          modals.closeAll();
          router.push(ROUTES.ADD_CARD + `&${CONSTANTS.PLAN_CODE_QUERY_KEY}=${planCode}`);
        } else {
          setSelectedPaymentMethod(data[0].paymentMethodId);
        }
      },
    }
  );

  const {
    register,
    errors,
    applyCouponSubmit,
    handleSubmit,
    appliedCouponCode,
    setAppliedCouponCode,
    isApplyCouponLoading,
  } = useCoupon({
    planCode: planCode,
  });
  const { checkoutData, isCheckoutDataLoading } = useCheckout({
    couponCode: appliedCouponCode,
    paymentMethodId: selectedPaymentMethod,
    planCode,
  });

  const handleProceed = () => {
    modals.closeAll();
    onClose();
    if (selectedPaymentMethod) {
      let url =
        `${gatewayURL}/api/v1/plans/${planCode}/buy/${email}/redirect?paymentMethodId=${selectedPaymentMethod}`.replaceAll(
          '"',
          ''
        );

      if (appliedCouponCode) {
        url += `&couponCode=${appliedCouponCode}`;
      }

      window.location.href = url;
    }
  };

  const handleAddMoreCard = () => {
    modals.close(MODAL_KEYS.SELECT_CARD);
    modals.close(MODAL_KEYS.PAYMENT_PLANS);
    router.push(ROUTES.ADD_CARD);
  };

  const handlePaymentMethodChange = (methodId: string) => {
    setSelectedPaymentMethod(methodId);
  };

  return (
    <>
      {isPaymentMethodsLoading || isPaymentMethodsFetching ? (
        <Flex w={480} align="center" justify="center" style={{ minHeight: '600px' }}>
          <Loader />
        </Flex>
      ) : (
        <>
          <Title size={20}>Confirm your subscription</Title>
          <Divider my="sm" mt={10} />
          <Radio.Group
            w={480}
            name="paymentMethod"
            value={selectedPaymentMethod || undefined}
            onChange={handlePaymentMethodChange}
          >
            {paymentMethods?.map((method) => {
              const cardBrandsSrc = method.brand.toLowerCase().replaceAll(' ', '_') || 'default';

              return (
                <div
                  key={method.paymentMethodId}
                  style={{ marginBottom: '20px', cursor: 'pointer' }}
                  onClick={() => handlePaymentMethodChange(method.paymentMethodId)}
                >
                  <Flex
                    justify="space-between"
                    align="center"
                    p="xl"
                    style={{
                      border: `1px solid ${
                        selectedPaymentMethod === method.paymentMethodId ? colors.blue : 'transparent'
                      }`,
                      backgroundColor:
                        selectedPaymentMethod === method.paymentMethodId
                          ? theme.colorScheme === 'dark'
                            ? colors.BGSecondaryDark
                            : colors.BGSecondaryLight
                          : 'transparent',
                      padding: '8px',
                    }}
                  >
                    <Flex align="center" gap="xl">
                      <Radio
                        value={method.paymentMethodId}
                        id={method.paymentMethodId}
                        checked={selectedPaymentMethod === method.paymentMethodId}
                      />
                      <Stack spacing={4}>
                        <Text fw={700} size="md">
                          {capitalizeFirstLetter(method.brand)} **** {method.last4Digits}
                        </Text>
                        <Text size="sm">Expires {`${method.expMonth}/${method.expYear}`}</Text>
                      </Stack>
                    </Flex>
                    <Image width={50} height={30} src={`/images/cards/${cardBrandsSrc}.png`} alt="Card Company" />
                  </Flex>
                </div>
              );
            })}
          </Radio.Group>

          <Button variant="outline" color="yellow" fullWidth onClick={handleAddMoreCard}>
            + Add Card
          </Button>

          <Stack spacing="md" mt="md">
            {appliedCouponCode ? (
              <Alert
                fw="bolder"
                color="green"
                variant="outline"
                withCloseButton
                onClose={() => setAppliedCouponCode(undefined)}
                icon={<CheckIcon color="white" size="md" />}
              >
                {`Coupon ${appliedCouponCode} is applied!`}
              </Alert>
            ) : (
              <form onSubmit={handleSubmit(applyCouponSubmit)}>
                <Group spacing={0} align="flex-start">
                  <TextInput
                    placeholder="Enter coupon code"
                    style={{ flexGrow: 1 }}
                    {...register('couponCode')}
                    error={errors.couponCode?.message}
                  />

                  <Button type="submit" compact loading={isApplyCouponLoading}>
                    Apply
                  </Button>
                </Group>
              </form>
            )}

            <CheckoutDetails checkoutData={checkoutData} isCheckoutDataLoading={isCheckoutDataLoading} />

            <Button onClick={handleProceed} fullWidth mt="md">
              Confirm
            </Button>
          </Stack>
        </>
      )}
    </>
  );
}

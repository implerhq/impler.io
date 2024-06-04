import getConfig from 'next/config';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Radio, Flex, Text, Loader } from '@mantine/core';

import { Button } from '@ui/button';
import { notify } from '@libs/notify';
import { NOTIFICATION_KEYS, colors } from '@config';
import { usePaymentMethods } from '@hooks/usePaymentMethods';
import { modals } from '@mantine/modals';

const { publicRuntimeConfig } = getConfig();

interface SelectCardModalProps {
  email: string;
  planCode: string;
  onClose: () => void;
}

export function SelectCardModal({ email, planCode, onClose }: SelectCardModalProps) {
  const router = useRouter();
  const gatewayURL = publicRuntimeConfig.NEXT_PUBLIC_PAYMENT_GATEWAY_URL;
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const { paymentMethods, isPaymentMethodsLoading, isPaymentMethodsFetched } = usePaymentMethods();

  useEffect(() => {
    if (paymentMethods?.length === 0) {
      notify(NOTIFICATION_KEYS.NO_PAYMENT_METHOD_FOUND, {
        title: 'No Appropriate Payment Method Found',
        message: 'Please Add your Card first. Redirecting you to cards.',
        color: 'red',
      });
      modals.closeAll();
      router.push(`/settings?tab=addcard&action=addcardmodal`);
    }
  }, [isPaymentMethodsFetched]);

  const handleProceed = () => {
    if (selectedPaymentMethod) {
      router.push(
        `${gatewayURL}/api/v1/plans/${planCode}/buy/${email}/redirect?paymentMethodId=${selectedPaymentMethod}`
      );
      onClose();
    }
  };

  return isPaymentMethodsLoading ? (
    <Loader />
  ) : (
    <>
      <Radio.Group
        name="paymentMethod"
        label="Select the card you want to proceed with"
        value={selectedPaymentMethod || undefined}
        onChange={setSelectedPaymentMethod}
        w={400}
      >
        {paymentMethods?.map((method) => (
          <label htmlFor={method.paymentMethodId} key={method.paymentMethodId}>
            <Flex justify="space-between" p="xs" style={{ border: `1px solid ${colors.TXTGray}`, cursor: 'pointer' }}>
              <Text fs="italic" size="md">
                XXXX XXXX XXXX {method.last4Digits}
              </Text>
              <Radio value={method.paymentMethodId} label={method.brand} id={method.paymentMethodId} />
            </Flex>
          </label>
        ))}
        <Flex justify="center" mt="lg">
          <Button color="blue" variant="filled" onClick={handleProceed}>
            Proceed
          </Button>
        </Flex>
      </Radio.Group>
    </>
  );
}

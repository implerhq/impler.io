import { Radio } from '@mantine/core';
import { useRouter } from 'next/router';
import { modals } from '@mantine/modals';
import { MODAL_KEYS, ROUTES } from '@config';
import { ICardData } from '@impler/shared';
import { Button } from '@ui/button';

import PaymentMethodOption from './PaymentMethodOption';

interface PaymentMethodGroupProps {
  paymentMethods: ICardData[] | undefined;
  selectedPaymentMethod: string | undefined;
  handlePaymentMethodChange: (methodId: string) => void;
}

export function PaymentMethodGroup({
  paymentMethods,
  selectedPaymentMethod,
  handlePaymentMethodChange,
}: PaymentMethodGroupProps) {
  const router = useRouter();

  const handleAddMoreCard = () => {
    modals.close(MODAL_KEYS.SELECT_CARD);
    modals.close(MODAL_KEYS.PAYMENT_PLANS);
    router.push(ROUTES.ADD_CARD);
  };

  return (
    <>
      <Radio.Group
        w={480}
        name="paymentMethod"
        value={selectedPaymentMethod || undefined}
        onChange={(event) => handlePaymentMethodChange(event)}
      >
        {paymentMethods?.map((method) => (
          <PaymentMethodOption
            key={method.paymentMethodId}
            method={method}
            selected={selectedPaymentMethod === method.paymentMethodId}
            onChange={() => handlePaymentMethodChange(method.paymentMethodId)}
          />
        ))}
      </Radio.Group>

      <Button variant="outline" color="yellow" fullWidth onClick={handleAddMoreCard}>
        + Add Card
      </Button>
    </>
  );
}

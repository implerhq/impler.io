import { ICardData } from '@impler/shared';
import { Radio, SimpleGrid, useMantineTheme } from '@mantine/core';

import { PaymentMethodOption } from './PaymentMethodOption';

interface PaymentMethodsProps {
  paymentMethods: ICardData[] | undefined;
  selectedPaymentMethod: string | undefined;
  handlePaymentMethodChange: (methodId: string) => void;
}

export function PaymentMethods({
  paymentMethods,
  selectedPaymentMethod,
  handlePaymentMethodChange,
}: PaymentMethodsProps) {
  const theme = useMantineTheme();

  return (
    <Radio.Group
      name="paymentMethod"
      value={selectedPaymentMethod || undefined}
      onChange={(event) => handlePaymentMethodChange(event)}
    >
      <SimpleGrid
        cols={2}
        spacing="xs"
        breakpoints={[
          { maxWidth: theme.breakpoints.xl, cols: 1 },
          { minWidth: theme.breakpoints.xl, cols: 2 },
        ]}
      >
        {paymentMethods?.map((method) => (
          <PaymentMethodOption
            key={method.paymentMethodId}
            method={method}
            selected={selectedPaymentMethod === method.paymentMethodId}
            onChange={() => handlePaymentMethodChange(method.paymentMethodId)}
          />
        ))}
      </SimpleGrid>
    </Radio.Group>
  );
}

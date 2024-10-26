import { Card, Flex } from '@mantine/core';
import { CardForm } from './CardForm';
import { colors } from '@config';
import { ActiveSubscriptionContent } from './ActiveSubscriptionContent';
import { ICardData } from '@impler/shared';
import { CardNumberElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useAddCard } from '@hooks/useAddCard';
import { usePaymentMethods } from '@hooks/usePaymentMethods';
import { usePlanDetails } from '@hooks/usePlanDetails';
import { useUpdatePaymentMethod } from '@hooks/useUpdatePaymentMethod';
import { useState, useEffect } from 'react';

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

  const handleSubmit = async () => {
    if (showForm) {
      await handleAddCard();
    } else {
      await handleChangeCard();
    }
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
      updatePaymentMethod({ paymentMethodId: selectedPaymentMethod, email });
      const newActiveCard = paymentMethods?.find(
        (method: ICardData) => method.paymentMethodId === selectedPaymentMethod
      );
      setActiveCard(newActiveCard);
    }
  };

  return (
    <Flex m={-20} bg={colors.white} gap={0}>
      <ActiveSubscriptionContent
        activePlanDetails={activePlanDetails}
        email={email}
        isActivePlanDetailsLoading={isActivePlanLoading}
      />

      <Card bg={colors.white} withBorder shadow="sm" w="50%" radius={0}>
        <CardForm
          showForm={showForm}
          activeCard={activeCard}
          paymentMethods={paymentMethods}
          selectedPaymentMethod={selectedPaymentMethod}
          isLoading={isAddPaymentMethodLoading || isUpdatePaymentMethodLoading || isPaymentMethodsLoading}
          onToggleForm={toggleFormVisibility}
          onPaymentMethodChange={setSelectedPaymentMethod}
          onSubmit={handleSubmit}
        />
      </Card>
    </Flex>
  );
}

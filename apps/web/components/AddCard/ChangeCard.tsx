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
  projectId: string;
  planCode: string;
  onClose: () => void;
}

export function ChangeCard({ email, projectId }: ChangeCardModalContentProps) {
  const { paymentMethods, isPaymentMethodsLoading, refetchPaymentMethods } = usePaymentMethods();
  const { activePlanDetails, isActivePlanLoading } = usePlanDetails({ projectId });
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | undefined>();
  const [activeCard, setActiveCard] = useState<ICardData | undefined>(undefined);
  const [showForm, setShowForm] = useState(false);
  const [displayedPaymentMethods, setDisplayedPaymentMethods] = useState<ICardData[]>([]);
  const { updatePaymentMethod, isUpdatePaymentMethodLoading } = useUpdatePaymentMethod();
  const { addPaymentMethod, isAddPaymentMethodLoading } = useAddCard({ refetchPaymentMethods });

  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    if (paymentMethods && activePlanDetails) {
      const activePaymentMethodId = activePlanDetails.customer?.paymentMethodId;

      const userActiveCard = paymentMethods.find(
        (method: ICardData) => method.paymentMethodId === activePaymentMethodId
      );

      setActiveCard(userActiveCard);
      setSelectedPaymentMethod(activePaymentMethodId);
      setDisplayedPaymentMethods(paymentMethods);
    }
  }, [paymentMethods, activePlanDetails]);

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
      await addPaymentMethod(paymentMethod.id);
      setShowForm(false);
      await refetchPaymentMethods();
    }
  };

  const orderPaymentMethods = () => {
    if (!paymentMethods) return [];

    const selected = paymentMethods.find((method) => method.paymentMethodId === selectedPaymentMethod);
    const others = paymentMethods.filter((method) => method.paymentMethodId !== selectedPaymentMethod);

    return selected ? [selected, ...others] : others;
  };

  const handleChangeCard = async () => {
    if (selectedPaymentMethod) {
      const sortedMethods = orderPaymentMethods();
      setDisplayedPaymentMethods(sortedMethods);

      await updatePaymentMethod({ paymentMethodId: selectedPaymentMethod, email });
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
          paymentMethods={showForm ? paymentMethods : displayedPaymentMethods}
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

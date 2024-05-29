import { useDisclosure } from '@mantine/hooks';
import { Modal, SimpleGrid, Stack, Box, LoadingOverlay } from '@mantine/core';
import { Button } from '@ui/button';
import { AddCardModal, Card } from '@components/settings';
import { usePaymentMethods } from '@hooks/usePaymentMethods';
import { modals } from '@mantine/modals';
import getConfig from 'next/config';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export function UserCards() {
  const router = useRouter();
  const { tab, action } = router.query;
  const [opened, { open, close }] = useDisclosure(false);

  useEffect(() => {
    if (tab === 'addcard' && action === 'addcardmodal') {
      open();
    }
  }, []);

  const { publicRuntimeConfig } = getConfig();
  const defaultPaymentGateway = publicRuntimeConfig.NEXT_PUBLIC_DEFAULT_PAYMENT_GATEWAY;
  const razorpayKey = publicRuntimeConfig.NEXT_PUBLIC_RAZORPAY_KEY;

  const {
    refetchPaymentMethods,
    paymentMethods,
    deletePaymentMethod,
    isDeletePaymentMethodLoading,
    isPaymentMethodsLoading,
  } = usePaymentMethods();

  const handleAuthorizationTransaction = async () => {
    if (defaultPaymentGateway === 'RAZORPAY') {
      const options = {
        key: razorpayKey,
        order_id: 'order_OFwYpDKdDnAvJr',
        customer_id: 'cust_ODrMF3Khtptkl1',
        recurring: '1',
        handler: function (response: any) {
          alert('Payment Successful!\nPayment ID: ' + response.razorpay_payment_id);
          alert('Order ID: ' + response.razorpay_order_id);
          alert('Signature: ' + response.razorpay_signature);
        },
        notes: {
          note_key1: 'value1',
          note_key2: 'value2',
        },
        theme: {
          color: '#F37254',
        },
      };
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      const rzp1 = new Razorpay(options);

      rzp1.open();
    } else {
      open();
    }
    // Logic to handle the specific URL
  };

  function handleDeleteCard(card: any) {
    modals.openConfirmModal({
      title: 'Please confirm your action',
      children: 'Are you sure you want to delete your card?',
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      onConfirm: async () => {
        deletePaymentMethod(card.paymentMethodId);
        refetchPaymentMethods();
      },
    });
  }

  return (
    <Box pos="relative" mt={20}>
      <LoadingOverlay visible={isDeletePaymentMethodLoading || isPaymentMethodsLoading} />
      <Stack spacing="xs" mt={10}>
        <SimpleGrid cols={4} spacing="xs">
          {paymentMethods?.map((card) => (
            <Card
              data={card}
              key={card.paymentMethodId}
              refetchPaymentMethods={refetchPaymentMethods}
              onRemoveCardClick={() => handleDeleteCard(card)}
            />
          ))}
        </SimpleGrid>
        <Button onClick={handleAuthorizationTransaction}>Add Card</Button>
      </Stack>

      <Modal opened={opened} withCloseButton onClose={close} title="Add Your Card Details" centered>
        <AddCardModal refetchPaymentMethods={refetchPaymentMethods} close={close} />
      </Modal>
    </Box>
  );
}

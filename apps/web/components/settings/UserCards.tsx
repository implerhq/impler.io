import { useDisclosure } from '@mantine/hooks';
import { Modal, SimpleGrid, Stack, Box, LoadingOverlay } from '@mantine/core';
import { Button } from '@ui/button';
import { AddCardModal, Card } from '@components/settings';
import { usePaymentMethods } from '@hooks/usePaymentMethods';
import { modals } from '@mantine/modals';

export function UserCards() {
  const [opened, { open, close }] = useDisclosure(false);
  const {
    refetchPaymentMethods,
    paymentMethods,
    deletePaymentMethod,
    isDeletePaymentMethodLoading,
    isPaymentMethodsLoading,
  } = usePaymentMethods();

  function handleDeleteCard(card: any) {
    modals.openConfirmModal({
      title: 'Please confirm your action',
      children: 'Are you sure you want to delete your card?',
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      onCancel: () => console.log('Cancel'),
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
        <Button onClick={open}>Add Card</Button>
      </Stack>

      <Modal opened={opened} withCloseButton onClose={close} title="Add Your Card Details" centered>
        <AddCardModal refetchPaymentMethods={refetchPaymentMethods} close={close} />
      </Modal>
    </Box>
  );
}

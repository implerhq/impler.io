import React from 'react';
import { Stack } from '@mantine/core';
import { useRouter } from 'next/router';
import { modals } from '@mantine/modals';
import { useDisclosure } from '@mantine/hooks';
import { Modal, SimpleGrid, Box, LoadingOverlay } from '@mantine/core';

import { Card } from './Card';
import { CONSTANTS } from '@config';
import { AddCard } from './AddCard';
import { AddCardModal } from './AddCard/AddCardModal';
import { usePaymentMethods } from '@hooks/usePaymentMethods';

export function UserCards() {
  const router = useRouter();
  const { action, [CONSTANTS.PLAN_CODE_QUERY_KEY]: selectedPlan } = router.query;
  const [opened, { open, close }] = useDisclosure(action === 'addcardmodal');
  const {
    refetchPaymentMethods,
    paymentMethods,
    deletePaymentMethod,
    isDeletePaymentMethodLoading,
    isPaymentMethodsLoading,
  } = usePaymentMethods();

  function handleDeleteCard(paymentMethodId: string) {
    modals.openConfirmModal({
      title: 'Please confirm your action',
      children: 'Are you sure you want to delete your card?',
      centered: true,
      confirmProps: { color: 'red' },
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      onConfirm: async () => deletePaymentMethod(paymentMethodId),
    });
  }

  return (
    <Box pos="relative" mt={20}>
      <LoadingOverlay visible={isDeletePaymentMethodLoading || isPaymentMethodsLoading} />
      <Stack spacing="xs" mt={10}>
        <SimpleGrid
          spacing="sm"
          cols={4}
          breakpoints={[
            { maxWidth: 'xl', cols: 3, spacing: 'md' },
            { maxWidth: 'lg', cols: 2, spacing: 'md' },
            { maxWidth: 'sm', cols: 1, spacing: 'sm' },
          ]}
        >
          {paymentMethods?.map((card) => (
            <Card key={card.paymentMethodId} data={card} onRemoveCardClick={handleDeleteCard} />
          ))}
          <AddCard onClick={open} />
        </SimpleGrid>
      </Stack>

      <Modal zIndex={1000} opened={opened} withCloseButton onClose={close} title="Add Your Card" centered>
        <AddCardModal plan={selectedPlan as string} refetchPaymentMethods={refetchPaymentMethods} close={close} />
      </Modal>
    </Box>
  );
}

import { useDisclosure } from '@mantine/hooks';
import { Modal, SimpleGrid, Stack, Box, LoadingOverlay, Title } from '@mantine/core';

import { Button } from '@ui/button';
import { AddCardModal, Card } from '@components/settings';
import { usePaymentMethods } from '@hooks/usePaymentMethods';

export function UserCards() {
  const [opened, { open, close }] = useDisclosure(false);
  const { paymentMethods, deletePaymentMethod, isDeletePaymentMethodLoading, isPaymentMethodsLoading } =
    usePaymentMethods();

  return (
    <Box pos="relative">
      <Title order={3}>Add Card</Title>
      <LoadingOverlay visible={isDeletePaymentMethodLoading || isPaymentMethodsLoading} />
      <Stack spacing="xs" mt={10}>
        <SimpleGrid cols={4} spacing="xs">
          {paymentMethods?.map((card) => (
            <Card
              data={card}
              key={card.paymentMethodId}
              onRemoveCardClick={() => deletePaymentMethod(card.paymentMethodId)}
            />
          ))}
        </SimpleGrid>
        <Button onClick={open}>Add</Button>
      </Stack>

      <Modal opened={opened} onClose={close} title="Add Your Card Details">
        <AddCardModal />
      </Modal>
    </Box>
  );
}

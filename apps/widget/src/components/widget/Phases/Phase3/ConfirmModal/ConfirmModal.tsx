import { CheckIcon } from '@icons';
import { colors, TEXTS } from '@config';
import { Button } from '@ui/Button';
import { Group, Modal as MantineModal, Text, Title } from '@mantine/core';
import { replaceVariablesInString, numberFormatter } from '@impler/shared';

interface IConfirmModalProps {
  opened: boolean;
  onClose: () => void;
  totalRecords: number;
  onConfirm: () => void;
}

export function ConfirmModal(props: IConfirmModalProps) {
  const { opened, onClose, onConfirm, totalRecords } = props;

  return (
    <MantineModal centered opened={opened} onClose={onClose} withCloseButton={false} padding="xl" size="lg">
      <Group spacing="sm" style={{ flexDirection: 'column', textAlign: 'center' }}>
        <CheckIcon
          styles={{
            width: 40,
            height: 40,
            padding: 2,
            borderRadius: '100%',
            color: colors.success,
            backgroundColor: colors.lightSuccess,
          }}
        />
        <Title color={colors.success} order={3} mt="sm">
          All records are found valid!
        </Title>
        <Text color="dimmed" mb="sm">
          {replaceVariablesInString(TEXTS.PHASE3.ALL_VALID_CONFIRMATION, {
            total: numberFormatter(totalRecords),
          })}
        </Text>
        <Group spacing="sm" style={{ flexDirection: 'row' }}>
          <Button onClick={onClose} color="gray" variant="outline">
            {TEXTS.PROMPT.NO}
          </Button>
          <Button onClick={onConfirm}>{TEXTS.PROMPT.YES}</Button>
        </Group>
      </Group>
    </MantineModal>
  );
}

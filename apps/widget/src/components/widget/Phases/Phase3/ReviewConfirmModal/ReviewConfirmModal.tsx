import { Button } from '@ui/Button';
import { Group, Modal as MantineModal, Text, Title } from '@mantine/core';
import { CheckIcon } from '@icons';
import { colors } from '@config';
import { replaceVariablesInString, numberFormatter, WIDGET_TEXTS } from '@impler/shared';

interface IConfirmModalProps {
  opened: boolean;
  onClose: () => void;
  totalRecords: number;
  onConfirm: () => void;
  texts: typeof WIDGET_TEXTS;
}

export function ReviewConfirmModal(props: IConfirmModalProps) {
  const { opened, onClose, onConfirm, totalRecords, texts } = props;

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
          {texts.PHASE3?.ALL_RECORDS_VALID_TITLE}
        </Title>
        <Text color="dimmed" mb="sm">
          {replaceVariablesInString(texts.PHASE3.ALL_RECORDS_VALID_DETAILS, {
            total: numberFormatter(totalRecords),
          })}
        </Text>
        <Group spacing="sm" style={{ flexDirection: 'row' }}>
          <Button onClick={onClose} color="gray" variant="outline">
            {texts.CLOSE_CONFIRMATION.CANCEL_CLOSE}
          </Button>
          <Button onClick={onConfirm}>{texts.CLOSE_CONFIRMATION.CONFIRM_CLOSE}</Button>
        </Group>
      </Group>
    </MantineModal>
  );
}

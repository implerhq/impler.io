import { Group, Modal as MantineModal, Text, Title } from '@mantine/core';

import { Warning } from '@icons';
import { Button } from '@ui/Button';
import { colors } from '@config';

interface IPromptModalProps {
  opened: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title: string;
  subTitle: string;
  confirmLabel: string;
  cancelLabel: string;
}

export function ConfirmModal(props: IPromptModalProps) {
  const { opened, onCancel, onConfirm, title, subTitle, confirmLabel, cancelLabel } = props;

  return (
    <MantineModal centered opened={opened} onClose={onCancel} withCloseButton={false} padding="xl" size="lg">
      <Group spacing={0} style={{ flexDirection: 'column', textAlign: 'center' }}>
        <Warning fill={colors.red} styles={{ width: 40, height: 40 }} />
        <Title color={colors.red} order={3} mt="sm">
          {title}
        </Title>
        <Text color="dimmed" mb="sm" dangerouslySetInnerHTML={{ __html: subTitle }} />
        <Group spacing="sm" style={{ flexDirection: 'row' }}>
          <Button onClick={onCancel} color="gray" variant="outline">
            {cancelLabel}
          </Button>
          <Button color="red" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </Group>
      </Group>
    </MantineModal>
  );
}

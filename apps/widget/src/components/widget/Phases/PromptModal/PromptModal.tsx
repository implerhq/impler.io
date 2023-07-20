import { Warning } from '@icons';
import { colors, TEXTS } from '@config';
import { Button } from '@ui/Button';
import { Group, Modal as MantineModal, Text, Title } from '@mantine/core';
import { PromptModalTypesEnum } from '@types';

interface IPromptModalProps {
  opened: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  action?: PromptModalTypesEnum;
}

export function PromptModal(props: IPromptModalProps) {
  const { opened, onCancel, onConfirm, action } = props;
  const subTitle = {
    [PromptModalTypesEnum.CLOSE]: TEXTS.PROMPT.SUBTITLE_CLOSE,
    [PromptModalTypesEnum.UPLOAD_AGAIN]: TEXTS.PROMPT.SUBTITLE_RESET,
    '': '',
  };

  return (
    <MantineModal centered opened={opened} onClose={onCancel} withCloseButton={false} padding="xl" size="lg">
      <Group spacing={0} style={{ flexDirection: 'column', textAlign: 'center' }}>
        <Warning fill={colors.red} styles={{ width: 40, height: 40 }} />
        <Title color={colors.red} order={3} mt="sm">
          {TEXTS.PROMPT.title}
        </Title>
        <Text color="dimmed" mb="sm" dangerouslySetInnerHTML={{ __html: subTitle[action || ''] }} />
        <Group spacing="sm" style={{ flexDirection: 'row' }}>
          <Button onClick={onCancel} color="gray" variant="outline">
            {TEXTS.PROMPT.NO}
          </Button>
          <Button color="red" onClick={onConfirm}>
            {TEXTS.PROMPT.YES}
          </Button>
        </Group>
      </Group>
    </MantineModal>
  );
}

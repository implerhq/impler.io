import { Warning } from '@icons';
import { colors, TEXTS } from '@config';
import { Button } from '@ui/Button';
import useStyles from './Styles';
import { Group, Modal as MantineModal, Text, Title } from '@mantine/core';
import { replaceVariablesInString, numberFormatter } from '@impler/shared';

interface IConfirmModalProps {
  opened: boolean;
  wrongDataCount: number;
  onClose: () => void;
  onConfirm: (exempt: boolean) => void;
}

export function ConfirmModal(props: IConfirmModalProps) {
  const { classes } = useStyles();
  const { opened, onClose, wrongDataCount, onConfirm } = props;

  return (
    <MantineModal centered opened={opened} onClose={onClose} withCloseButton={false} padding="xl" size="lg">
      <Group spacing={0} className={classes.wrapper}>
        <Warning fill={colors.red} className={classes.warning} />
        <Title color={colors.red} order={3} mt="sm">
          {replaceVariablesInString(TEXTS.CONFIRM_MODAL.title, { count: numberFormatter(wrongDataCount) })}
        </Title>
        <Text color="dimmed" mb="sm">
          {TEXTS.CONFIRM_MODAL.subTitle}
        </Text>
        <Group spacing="xs" className={classes.actions}>
          <Button onClick={() => onConfirm(false)} variant="outline">
            {TEXTS.CONFIRM_MODAL.EXEMPT_CONTINUE}
          </Button>
          <Button onClick={() => onConfirm(true)}>{TEXTS.CONFIRM_MODAL.KEEP_CONTINUE}</Button>
        </Group>
      </Group>
    </MantineModal>
  );
}

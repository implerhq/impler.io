import { WIDGET_TEXTS } from '@impler/shared';
import { Checkbox, Flex, FocusTrap, Modal as MantineModal, Stack, TextInput } from '@mantine/core';

import { Button } from '@ui/Button';
import { Select } from '@ui/Select';

interface IFindReplaceModalProps {
  opened: boolean;
  columns: IOption[];
  cancelLabel: string;
  onClose: () => void;
  replaceLabel: string;
  texts: typeof WIDGET_TEXTS;
}

export function FindReplaceModal(props: IFindReplaceModalProps) {
  const { opened, onClose, replaceLabel, cancelLabel, columns, texts } = props;

  return (
    <MantineModal centered size="lg" padding="xl" opened={opened} onClose={onClose} title={texts.PHASE3.FIND_REPLACE}>
      <FocusTrap active>
        <Stack spacing="xs">
          <TextInput
            required
            data-autofocus
            label={texts.PHASE3.FIND_LABEL}
            placeholder={texts.PHASE3.FIND_PLACEHOLDER}
          />
          <TextInput required label={texts.PHASE3.REPLACE_LABEL} placeholder={texts.PHASE3.REPLACE_PLACEHOLDER} />
          <Select title={texts.PHASE3.ALL_COLUMNS_LABEL} defaultValue="" data={columns} />
          <Checkbox label={texts.PHASE3.CASE_SENSITIVE_LABEL} />
          <Checkbox label={texts.PHASE3.MATCH_ENTIRE_LABEL} />
          <Flex direction="row" gap="xs" justify="flex-end">
            <Button onClick={onClose} color="gray" variant="outline">
              {cancelLabel}
            </Button>
            <Button>{replaceLabel}</Button>
          </Flex>
        </Stack>
      </FocusTrap>
    </MantineModal>
  );
}

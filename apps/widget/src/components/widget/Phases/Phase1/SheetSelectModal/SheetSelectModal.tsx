import { Control, Controller } from 'react-hook-form';
import { Group, Modal as MantineModal } from '@mantine/core';

import { WIDGET_TEXTS } from '@impler/shared';
import { Button } from '@ui/Button';
import { Select } from '@ui/Select';
import { IFormvalues } from '@types';

interface IConfirmModalProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: () => void;
  excelSheetNames: string[];
  control: Control<IFormvalues>;
  texts: typeof WIDGET_TEXTS;
}

export function SheetSelectModal({ opened, onClose, onSubmit, excelSheetNames, control, texts }: IConfirmModalProps) {
  return (
    <MantineModal withCloseButton={false} centered size="lg" padding="xl" opened={opened} onClose={onClose}>
      <Group spacing="sm">
        <Controller
          control={control}
          name="selectedSheetName"
          rules={{
            required: texts.PHASE1.SELECT_TEMPLATE_REQUIRED_MSG,
          }}
          render={({ field }) => (
            <Select
              withinPortal
              ref={field.ref}
              value={field.value}
              data={excelSheetNames}
              onChange={field.onChange}
              title={texts.PHASE1.SELECT_SHEET_NAME}
              placeholder={texts.PHASE1.SELECT_SHEET_NAME_PLACEHOLDER}
            />
          )}
        />
        <Button onClick={onSubmit} fullWidth>
          {texts.PHASE1.SELECT_SHEET_CONFIRM}
        </Button>
      </Group>
    </MantineModal>
  );
}

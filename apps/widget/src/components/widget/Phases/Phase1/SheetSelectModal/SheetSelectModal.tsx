import { Control, Controller } from 'react-hook-form';
import { Group, Modal as MantineModal } from '@mantine/core';

import { TEXTS } from '@config';
import { Button } from '@ui/Button';
import { Select } from '@ui/Select';
import { IFormvalues } from '@types';

interface IConfirmModalProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: () => void;
  excelSheetNames: string[];
  control: Control<IFormvalues, any, IFormvalues>;
}

export function SheetSelectModal({ opened, onClose, onSubmit, excelSheetNames, control }: IConfirmModalProps) {
  return (
    <MantineModal
      centered
      size="lg"
      padding="xl"
      opened={opened}
      onClose={onClose}
      title={TEXTS.SELECT_SHEET_MODAL.title}
    >
      <Group spacing="sm">
        <Controller
          control={control}
          name="selectedSheetName"
          rules={{
            required: TEXTS.VALIDATION.REQUIRED_SELECT,
          }}
          render={({ field }) => (
            <Select
              withinPortal
              ref={field.ref}
              value={field.value}
              data={excelSheetNames}
              onChange={field.onChange}
              title={TEXTS.PHASE1.SELECT_EXCEL_SHEET}
              placeholder={TEXTS.PHASE1.SELECT_EXCEL_SHEET_PLACEHOLDER}
            />
          )}
        />
        <Button onClick={onSubmit} fullWidth>
          {TEXTS.SELECT_SHEET_MODAL.SELECT}
        </Button>
      </Group>
    </MantineModal>
  );
}

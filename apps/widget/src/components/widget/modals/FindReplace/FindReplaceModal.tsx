import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { WIDGET_TEXTS } from '@impler/client';
import { IReplaceData } from '@impler/shared';
import { Checkbox, Flex, FocusTrap, Modal as MantineModal, Stack, TextInput } from '@mantine/core';

import { Button } from '@ui/Button';
import { Select } from '@ui/Select';

interface IFindReplaceModalProps {
  opened: boolean;
  columns: IOption[];
  cancelLabel: string;
  onClose: () => void;
  replaceLabel: string;
  isReplaceLoading: boolean;
  texts: typeof WIDGET_TEXTS;
  onReplace: (data: IReplaceData) => void;
}

export function FindReplaceModal(props: IFindReplaceModalProps) {
  const { opened, onClose, replaceLabel, onReplace, cancelLabel, columns, texts, isReplaceLoading } = props;
  const { register, handleSubmit, control, reset } = useForm<IReplaceData>({
    defaultValues: {
      column: '',
    },
  });

  useEffect(() => {
    if (!opened)
      reset({
        column: '',
      });
  }, [opened]);

  return (
    <MantineModal
      centered
      size="lg"
      padding="xl"
      opened={opened}
      onClose={onClose}
      keepMounted={false}
      title={texts.PHASE3.FIND_REPLACE}
    >
      <FocusTrap active>
        <form onSubmit={handleSubmit(onReplace)}>
          <Stack spacing="xs">
            <TextInput
              data-autofocus
              {...register('find')}
              label={texts.PHASE3.FIND_LABEL}
              placeholder={texts.PHASE3.FIND_PLACEHOLDER}
            />
            <TextInput {...register('replace')} label={texts.PHASE3.REPLACE_LABEL} />
            <Controller
              name="column"
              control={control}
              render={({ field }) => (
                <Select
                  searchable
                  withinPortal
                  data={columns}
                  ref={field.ref}
                  value={field.value}
                  onChange={field.onChange}
                  title={texts.PHASE3.ALL_COLUMNS_LABEL}
                />
              )}
            />
            <Checkbox label={texts.PHASE3.CASE_SENSITIVE_LABEL} {...register('caseSensitive')} />
            <Checkbox label={texts.PHASE3.MATCH_ENTIRE_LABEL} {...register('matchEntireCell')} />
            <Flex direction="row" gap="xs" justify="flex-end">
              <Button onClick={onClose} color="gray" variant="outline">
                {cancelLabel}
              </Button>
              <Button loading={isReplaceLoading} type="submit">
                {replaceLabel}
              </Button>
            </Flex>
          </Stack>
        </form>
      </FocusTrap>
    </MantineModal>
  );
}

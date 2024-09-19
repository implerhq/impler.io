import { useState } from 'react';
import { WIDGET_TEXTS } from '@impler/client';
import { useMutation } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { IErrorObject, IReplaceData } from '@impler/shared';
import { Alert, Checkbox, Flex, FocusTrap, Modal as MantineModal, Stack, TextInput } from '@mantine/core';

import { CheckIcon } from '@icons';
import { Button } from '@ui/Button';
import { Select } from '@ui/Select';
import { useAPIState } from '@store/api.context';
import { useAppState } from '@store/app.context';

interface IFindReplaceModalProps {
  opened: boolean;
  columns: IOption[];
  cancelLabel: string;
  onClose: () => void;
  replaceLabel: string;
  texts: typeof WIDGET_TEXTS;
  refetchReviewData: () => void;
}

export function FindReplaceModal(props: IFindReplaceModalProps) {
  const { api } = useAPIState();
  const { uploadInfo } = useAppState();
  const [modifiedCount, setModifiedCount] = useState<number | undefined>();
  const { opened, onClose, replaceLabel, refetchReviewData, cancelLabel, columns, texts } = props;
  const { register, handleSubmit, control, reset } = useForm<IReplaceData>({
    defaultValues: {
      column: '',
    },
  });

  const { mutate: replaceData, isLoading: isReplaceDataLoading } = useMutation<
    IReplaceResponse,
    IErrorObject,
    IReplaceData,
    [string]
  >(['replace'], (data) => api.replace(uploadInfo._id, data), {
    onSuccess: (data) => {
      refetchReviewData();
      setModifiedCount(data.modifiedCount);
    },
  });

  const onCloseModal = () => {
    onClose();
    reset({
      column: '',
      find: '',
      caseSensitive: false,
      matchEntireCell: false,
      replace: '',
    });
    setModifiedCount(undefined);
  };

  return (
    <MantineModal
      centered
      size="lg"
      padding="xl"
      opened={opened}
      keepMounted={false}
      onClose={onCloseModal}
      title={texts.PHASE3.FIND_REPLACE}
    >
      <FocusTrap active>
        <form onSubmit={handleSubmit((data) => replaceData(data))}>
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
            {typeof modifiedCount === 'number' && (
              <Alert color="green" icon={<CheckIcon />}>
                {modifiedCount} cell values have been updated
              </Alert>
            )}
            <Flex direction="row" gap="xs" justify="flex-end">
              <Button onClick={onCloseModal} color="gray" variant="outline">
                {cancelLabel}
              </Button>
              <Button loading={isReplaceDataLoading} type="submit">
                {replaceLabel}
              </Button>
            </Flex>
          </Stack>
        </form>
      </FocusTrap>
    </MantineModal>
  );
}

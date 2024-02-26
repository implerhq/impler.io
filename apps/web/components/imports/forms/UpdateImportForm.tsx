import { useEffect } from 'react';
import { Stack, TextInput as Input } from '@mantine/core';
import { useForm } from 'react-hook-form';
import { useFocusTrap } from '@mantine/hooks';

import { Button } from '@ui/button';
import { ITemplate } from '@impler/shared';

interface UpdateImportFormProps {
  data: ITemplate;
  onSubmit: (data: IUpdateTemplateData) => void;
}

export function UpdateImportForm({ onSubmit, data }: UpdateImportFormProps) {
  const focusTrapRef = useFocusTrap();
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IUpdateTemplateData>();

  useEffect(() => {
    reset({
      name: data.name,
    });
  }, [data, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} ref={focusTrapRef}>
      <Stack spacing="sm">
        <Input
          autoFocus
          required
          {...register('name')}
          error={errors.name?.message}
          placeholder="I want to import..."
        />
        <Button type="submit" fullWidth>
          Update
        </Button>
      </Stack>
    </form>
  );
}

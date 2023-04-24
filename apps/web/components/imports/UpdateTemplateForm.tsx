import { Stack } from '@mantine/core';
import { useForm } from 'react-hook-form';
import { useFocusTrap } from '@mantine/hooks';

import { Input } from '@ui/input';
import { Button } from '@ui/button';
import { ITemplate } from '@impler/shared';
import { useEffect } from 'react';

interface UpdateTemplateFormProps {
  data: ITemplate;
  onSubmit: (data: IUpdateTemplateData) => void;
}

export function UpdateTemplateForm({ onSubmit, data }: UpdateTemplateFormProps) {
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
          placeholder="I want to import..."
          dataAutoFocus
          required
          register={register('name')}
          error={errors.name?.message}
        />
        <Button type="submit" fullWidth>
          Update
        </Button>
      </Stack>
    </form>
  );
}

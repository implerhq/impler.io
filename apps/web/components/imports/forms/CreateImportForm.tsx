import { Stack } from '@mantine/core';
import { useForm } from 'react-hook-form';
import { useFocusTrap } from '@mantine/hooks';

import { Input } from '@ui/input';
import { Button } from '@ui/button';

interface CreateImportFormProps {
  onSubmit: (data: ICreateTemplateData) => void;
}

export function CreateImportForm({ onSubmit }: CreateImportFormProps) {
  const focusTrapRef = useFocusTrap();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ICreateTemplateData>();

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
          Create
        </Button>
      </Stack>
    </form>
  );
}

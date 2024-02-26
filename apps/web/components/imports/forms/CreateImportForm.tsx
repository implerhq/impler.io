import { useForm } from 'react-hook-form';
import { useFocusTrap } from '@mantine/hooks';
import { Stack, TextInput as Input } from '@mantine/core';

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
        <Input placeholder="Import title" autoFocus required {...register('name')} error={errors.name?.message} />
        <Button type="submit" fullWidth>
          Create & Continue
        </Button>
      </Stack>
    </form>
  );
}

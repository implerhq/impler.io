import { useForm } from 'react-hook-form';
import { useFocusTrap } from '@mantine/hooks';
import { SimpleGrid, Stack } from '@mantine/core';

import { Input } from '@ui/input';
import { Button } from '@ui/button';
import { Select } from '@ui/select';
import { Checkbox } from '@ui/checkbox';

import { IProjectPayload } from '@impler/shared';

interface DuplicateImportFormProps {
  profile?: IProfileData;
  projects?: IProjectPayload[];
  onSubmit: (data: IDuplicateTemplateData) => void;
}

export function DuplicateImportForm({ onSubmit, profile, projects }: DuplicateImportFormProps) {
  const focusTrapRef = useFocusTrap();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IDuplicateTemplateData>({
    defaultValues: {
      _projectId: profile?._projectId,
      duplicateColumns: true,
      duplicateOutput: true,
      duplicateWebhook: true,
      duplicateValidator: true,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} ref={focusTrapRef}>
      <Stack spacing="sm">
        <Input
          autoFocus
          required
          label="Import Title"
          placeholder="Import title"
          register={register('name')}
          error={errors.name?.message}
        />
        <Select
          required
          placeholder="Project"
          label="Project"
          register={register('_projectId')}
          data={projects?.map((project) => ({ label: project.name, value: project._id })) || []}
        />
        <SimpleGrid cols={3}>
          <Checkbox label="Copy Columns?" register={register('duplicateColumns')} />
          <Checkbox label="Copy Output?" register={register('duplicateOutput')} />
          <Checkbox label="Copy Webhook?" register={register('duplicateWebhook')} />
          <Checkbox label="Copy Validator?" register={register('duplicateValidator')} />
        </SimpleGrid>
        <Button type="submit" fullWidth>
          Duplicate & Continue
        </Button>
      </Stack>
    </form>
  );
}

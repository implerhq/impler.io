import { useForm } from 'react-hook-form';
import { useFocusTrap } from '@mantine/hooks';
import { FocusTrap, SimpleGrid, Stack, TextInput as Input } from '@mantine/core';

import { Button } from '@ui/button';
import { Checkbox } from '@ui/checkbox';
import { NativeSelect } from '@ui/native-select';

import { IProjectPayload } from '@impler/shared';

interface DuplicateImportFormProps {
  originalName?: string;
  profile?: IProfileData;
  projects?: IProjectPayload[];
  onSubmit: (data: IDuplicateTemplateData) => void;
}

export function DuplicateImportForm({ onSubmit, profile, projects, originalName }: DuplicateImportFormProps) {
  const focusTrapRef = useFocusTrap();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IDuplicateTemplateData>({
    defaultValues: {
      _projectId: profile?._projectId,
      duplicateColumns: true,
      duplicateDestination: true,
      duplicateWebhook: true,
      duplicateValidator: true,
      name: originalName,
    },
  });

  return (
    <FocusTrap>
      <form onSubmit={handleSubmit(onSubmit)} ref={focusTrapRef}>
        <Stack spacing="sm">
          <Input
            autoFocus
            required
            label="Import Title"
            {...register('name')}
            placeholder="Import title"
            error={errors.name?.message}
          />
          <NativeSelect
            required
            placeholder="Project"
            label="Project"
            register={register('_projectId')}
            data={projects?.map((project) => ({ label: project.name, value: project._id })) || []}
          />
          <SimpleGrid cols={3}>
            <Checkbox label="Copy Columns?" register={register('duplicateColumns')} />
            <Checkbox label="Copy Destination?" register={register('duplicateDestination')} />
            <Checkbox label="Copy Webhook?" register={register('duplicateWebhook')} />
            <Checkbox label="Copy Validator?" register={register('duplicateValidator')} />
          </SimpleGrid>
          <Button type="submit" fullWidth>
            Duplicate & Continue
          </Button>
        </Stack>
      </form>
    </FocusTrap>
  );
}

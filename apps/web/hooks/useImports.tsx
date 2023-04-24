import { Stack } from '@mantine/core';
import { modals } from '@mantine/modals';
import { useForm } from 'react-hook-form';
import { useFocusTrap, useLocalStorage } from '@mantine/hooks';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { Input } from '@ui/input';
import { Button } from '@ui/button';
import { commonApi } from '@libs/api';
import { IErrorObject, ITemplate } from '@impler/shared';
import { API_KEYS, CONSTANTS, MODAL_KEYS, MODAL_TITLES } from '@config';

interface CreateImportFormProps {
  onSubmit: (data: ICreateTemplateData) => void;
}

function CreateImportForm({ onSubmit }: CreateImportFormProps) {
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

export function useImports() {
  const queryClient = useQueryClient();
  const [profile] = useLocalStorage<IProfileData>({ key: CONSTANTS.PROFILE_STORAGE_NAME });
  const { mutate: createImport } = useMutation<ITemplate, IErrorObject, ICreateTemplateData, (string | undefined)[]>(
    [API_KEYS.TEMPLATES_CREATE, profile?._projectId],
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    (data) => commonApi<ITemplate>(API_KEYS.TEMPLATES_CREATE as any, { body: data, parameters: [profile._projectId!] }),
    {
      onSuccess: (data) => {
        modals.closeAll();
        queryClient.setQueryData<ITemplate[]>([API_KEYS.TEMPLATES_LIST, profile?._projectId], (oldData) => [
          ...(oldData || []),
          data,
        ]);
      },
    }
  );
  const { data: templates, isLoading: isTemplatesLoading } = useQuery<
    unknown,
    IErrorObject,
    ITemplate[],
    (string | undefined)[]
  >(
    [API_KEYS.TEMPLATES_LIST, profile?._projectId],
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    () => commonApi<ITemplate[]>(API_KEYS.TEMPLATES_LIST as any, { parameters: [profile._projectId!] }),
    {
      enabled: !!profile,
    }
  );
  function onCreateClick() {
    modals.open({
      id: MODAL_KEYS.IMPORT_CREATE,
      title: MODAL_TITLES.IMPORT_CREATE,
      children: <CreateImportForm onSubmit={createImport} />,
    });
  }

  return {
    templates,
    onCreateClick,
    isTemplatesLoading,
  };
}

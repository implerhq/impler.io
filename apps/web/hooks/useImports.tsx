import { modals } from '@mantine/modals';
import { useLocalStorage } from '@mantine/hooks';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { commonApi } from '@libs/api';
import { IErrorObject, ITemplate } from '@impler/shared';
import { API_KEYS, CONSTANTS, MODAL_KEYS, MODAL_TITLES, NOTIFICATION_KEYS } from '@config';
import { CreateImportForm } from '@components/imports/forms/CreateImportForm';
import { useRouter } from 'next/router';
import { notify } from '@libs/notify';

export function useImports() {
  const { push } = useRouter();
  const queryClient = useQueryClient();
  const [profile] = useLocalStorage<IProfileData>({ key: CONSTANTS.PROFILE_STORAGE_NAME });
  const { mutate: createImport } = useMutation<ITemplate, IErrorObject, ICreateTemplateData, (string | undefined)[]>(
    [API_KEYS.TEMPLATES_CREATE, profile?._projectId],
    (data) =>
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      commonApi<ITemplate>(API_KEYS.TEMPLATES_CREATE as any, { body: { ...data, _projectId: profile._projectId! } }),
    {
      onSuccess: (data) => {
        modals.close(MODAL_KEYS.IMPORT_CREATE);
        queryClient.setQueryData<ITemplate[]>([API_KEYS.TEMPLATES_LIST, profile?._projectId], (oldData) => [
          ...(oldData || []),
          data,
        ]);
        push(`/imports/${data._id}`);
        notify(NOTIFICATION_KEYS.IMPORT_CREATED);
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
      modalId: MODAL_KEYS.IMPORT_CREATE,
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

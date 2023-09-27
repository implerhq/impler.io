import { useRouter } from 'next/router';
import { modals } from '@mantine/modals';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { commonApi } from '@libs/api';
import { notify } from '@libs/notify';
import { track } from '@libs/amplitude';
import { useAppState } from 'store/app.context';
import { IErrorObject, ITemplate } from '@impler/shared';
import { CreateImportForm } from '@components/imports/forms/CreateImportForm';
import { API_KEYS, MODAL_KEYS, MODAL_TITLES, NOTIFICATION_KEYS } from '@config';

export function useImports() {
  const { profileInfo } = useAppState();
  const { push } = useRouter();
  const queryClient = useQueryClient();
  const { mutate: createImport } = useMutation<ITemplate, IErrorObject, ICreateTemplateData, (string | undefined)[]>(
    [API_KEYS.TEMPLATES_CREATE, profileInfo?._projectId],
    (data) =>
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      commonApi<ITemplate>(API_KEYS.TEMPLATES_CREATE as any, {
        body: { ...data, _projectId: profileInfo!._projectId! },
      }),
    {
      onSuccess: (data) => {
        modals.close(MODAL_KEYS.IMPORT_CREATE);
        queryClient.setQueryData<ITemplate[]>([API_KEYS.TEMPLATES_LIST, profileInfo!._projectId], (oldData) => [
          ...(oldData || []),
          data,
        ]);
        track({
          name: 'IMPORT CREATE',
          properties: {},
        });
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
    [API_KEYS.TEMPLATES_LIST, profileInfo?._projectId],
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    () => commonApi<ITemplate[]>(API_KEYS.TEMPLATES_LIST as any, { parameters: [profileInfo!._projectId] }),
    {
      enabled: !!profileInfo,
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

import { useRouter } from 'next/router';
import { modals } from '@mantine/modals';
import { useLocalStorage } from '@mantine/hooks';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { commonApi } from '@libs/api';
import { ITemplate, IErrorObject } from '@impler/shared';
import { UpdateTemplateForm } from '@components/imports/forms/UpdateTemplateForm';
import { API_KEYS, CONSTANTS, MODAL_KEYS, MODAL_TITLES, ROUTES } from '@config';

interface useImportDetailProps {
  template: ITemplate;
}

export function useImportDetails({ template }: useImportDetailProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: templateData } = useQuery(
    [API_KEYS.TEMPLATE_DETAILS, template._id],
    () => commonApi<ITemplate>(API_KEYS.TEMPLATE_DETAILS as any, { parameters: [template._id] }),
    {
      initialData: template,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );
  const [profile] = useLocalStorage<IProfileData>({ key: CONSTANTS.PROFILE_STORAGE_NAME });

  const { mutate: updateImport } = useMutation<ITemplate, IErrorObject, IUpdateTemplateData, (string | undefined)[]>(
    [API_KEYS.TEMPLATE_UPDATE, template._id],
    (data) =>
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      commonApi<ITemplate>(API_KEYS.TEMPLATE_UPDATE as any, { parameters: [template._id], body: { ...data } }),
    {
      onSuccess: (data) => {
        modals.close(MODAL_KEYS.IMPORT_UPDATE);
        queryClient.setQueryData<ITemplate[]>([API_KEYS.TEMPLATES_LIST, profile?._projectId], (oldData) =>
          oldData?.map((item) => (item._id === data._id ? data : item))
        );
        queryClient.setQueryData<ITemplate>([API_KEYS.TEMPLATE_DETAILS, template._id], data);
      },
    }
  );
  const { mutate: deleteImport } = useMutation<ITemplate, IErrorObject, void, (string | undefined)[]>(
    [API_KEYS.TEMPLATE_DELETE, template._id],
    () => commonApi<ITemplate>(API_KEYS.TEMPLATE_DELETE as any, { parameters: [template._id] }),
    {
      onSuccess: () => {
        queryClient.setQueryData<ITemplate[]>([API_KEYS.TEMPLATES_LIST, profile?._projectId], (oldData) =>
          oldData?.filter((item) => item._id !== template._id)
        );
        queryClient.removeQueries([API_KEYS.TEMPLATE_DETAILS, template._id]);
        router.replace(ROUTES.IMPORTS);
      },
    }
  );

  const onDeleteClick = () => {
    modals.openConfirmModal({
      title: MODAL_TITLES.IMPORT_DELETE,
      children: 'Are you sure you want to delete this import?',
      onConfirm: deleteImport,
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
    });
  };

  const onUpdateClick = () => {
    modals.open({
      modalId: MODAL_KEYS.IMPORT_UPDATE,
      title: MODAL_TITLES.IMPORT_UPDATE,

      children: <UpdateTemplateForm onSubmit={updateImport} data={template} />,
    });
  };

  return { profile, onUpdateClick, onDeleteClick, templateData };
}

import { useRouter } from 'next/router';
import { modals } from '@mantine/modals';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { commonApi } from '@libs/api';
import { notify } from '@libs/notify';
import { track } from '@libs/amplitude';
import { useAppState } from 'store/app.context';
import { ITemplate, IErrorObject, IColumn } from '@impler/shared';
import { UpdateImportForm } from '@components/imports/forms/UpdateImportForm';
import { API_KEYS, MODAL_KEYS, MODAL_TITLES, NOTIFICATION_KEYS, ROUTES } from '@config';

interface useImportDetailProps {
  template: ITemplate;
}

export function useImportDetails({ template }: useImportDetailProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { profileInfo } = useAppState();
  const { refetch: refetchTemplateData, data: templateData } = useQuery(
    [API_KEYS.TEMPLATE_DETAILS, template._id],
    () => commonApi<ITemplate>(API_KEYS.TEMPLATE_DETAILS as any, { parameters: [template._id] }),
    {
      initialData: template,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );
  const { data: columns, isLoading: isColumnListLoading } = useQuery<unknown, IErrorObject, IColumn[], string[]>(
    [API_KEYS.TEMPLATE_COLUMNS_LIST, template._id],
    () => commonApi<IColumn[]>(API_KEYS.TEMPLATE_COLUMNS_LIST as any, { parameters: [template._id] })
  );

  const { mutate: updateImport } = useMutation<ITemplate, IErrorObject, IUpdateTemplateData, (string | undefined)[]>(
    [API_KEYS.TEMPLATE_UPDATE, template._id],
    (data) =>
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      commonApi<ITemplate>(API_KEYS.TEMPLATE_UPDATE as any, { parameters: [template._id], body: { ...data } }),
    {
      onSuccess: (data) => {
        modals.close(MODAL_KEYS.IMPORT_UPDATE);
        queryClient.setQueryData<ITemplate[]>([API_KEYS.TEMPLATES_LIST, profileInfo!._projectId], (oldData) =>
          oldData?.map((item) => (item._id === data._id ? data : item))
        );
        queryClient.setQueryData<ITemplate>([API_KEYS.TEMPLATE_DETAILS, template._id], data);
        notify(NOTIFICATION_KEYS.IMPORT_UPDATED);
      },
    }
  );
  const { mutate: deleteImport } = useMutation<ITemplate, IErrorObject, void, (string | undefined)[]>(
    [API_KEYS.TEMPLATE_DELETE, template._id],
    () => commonApi<ITemplate>(API_KEYS.TEMPLATE_DELETE as any, { parameters: [template._id] }),
    {
      onSuccess: () => {
        queryClient.setQueryData<ITemplate[]>([API_KEYS.TEMPLATES_LIST, profileInfo!._projectId], (oldData) =>
          oldData?.filter((item) => item._id !== template._id)
        );
        queryClient.removeQueries([API_KEYS.TEMPLATE_DETAILS, template._id]);
        notify(NOTIFICATION_KEYS.IMPORT_DELETED);
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
      confirmProps: { color: 'red' },
    });
  };

  const onUpdateClick = () => {
    modals.open({
      modalId: MODAL_KEYS.IMPORT_UPDATE,
      title: MODAL_TITLES.IMPORT_UPDATE,

      children: <UpdateImportForm onSubmit={updateImport} data={templateData} />,
    });
  };

  const onSpreadsheetImported = () => {
    refetchTemplateData();
    track({
      name: 'WEB IMPORT',
      properties: {},
    });
  };

  return {
    columns,
    profileInfo,
    templateData,
    onUpdateClick,
    onDeleteClick,
    isColumnListLoading,
    onSpreadsheetImported,
  };
}

import { useRouter } from 'next/router';
import { modals } from '@mantine/modals';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { commonApi } from '@libs/api';
import { notify } from '@libs/notify';
import { track } from '@libs/amplitude';
import { useAppState } from 'store/app.context';
import { usePlanMetaData } from 'store/planmeta.store.context';
import { ITemplate, IErrorObject, IColumn } from '@impler/shared';
import { UpdateImportForm } from '@components/imports/forms/UpdateImportForm';
import { API_KEYS, MODAL_KEYS, MODAL_TITLES, NOTIFICATION_KEYS, ROUTES } from '@config';
import { IntegrationModal } from '@components/Integration/IntegrationModal';

interface useImportDetailProps {
  templateId: string;
}

export function useImportDetails({ templateId }: useImportDetailProps) {
  const router = useRouter();
  const { meta } = usePlanMetaData();
  const queryClient = useQueryClient();
  const { profileInfo } = useAppState();
  const {
    data: templateData,
    refetch: refetchTemplateData,
    isLoading: isTemplateDataLoading,
  } = useQuery(
    [API_KEYS.TEMPLATE_DETAILS, templateId],
    () => commonApi<ITemplate>(API_KEYS.TEMPLATE_DETAILS as any, { parameters: [templateId] }),
    {
      onError() {
        router.push(ROUTES.IMPORTS);
      },
    }
  );
  const { data: columns, isLoading: isColumnListLoading } = useQuery<unknown, IErrorObject, IColumn[], string[]>(
    [API_KEYS.TEMPLATE_COLUMNS_LIST, templateId],
    () => commonApi<IColumn[]>(API_KEYS.TEMPLATE_COLUMNS_LIST as any, { parameters: [templateId] })
  );

  const { mutate: updateImport } = useMutation<ITemplate, IErrorObject, IUpdateTemplateData, (string | undefined)[]>(
    [API_KEYS.TEMPLATE_UPDATE, templateId],
    (data) =>
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      commonApi<ITemplate>(API_KEYS.TEMPLATE_UPDATE as any, { parameters: [templateId], body: { ...data } }),
    {
      onSuccess: (data) => {
        modals.close(MODAL_KEYS.IMPORT_UPDATE);
        queryClient.setQueryData<ITemplate[]>(
          [API_KEYS.TEMPLATES_LIST, profileInfo!._projectId],
          (oldData) => oldData?.map((item) => (item._id === data._id ? data : item))
        );
        queryClient.setQueryData<ITemplate>([API_KEYS.TEMPLATE_DETAILS, templateId], data);
        notify(NOTIFICATION_KEYS.IMPORT_UPDATED);
      },
    }
  );
  const { mutate: deleteImport } = useMutation<ITemplate, IErrorObject, void, (string | undefined)[]>(
    [API_KEYS.TEMPLATE_DELETE, templateId],
    () => commonApi<ITemplate>(API_KEYS.TEMPLATE_DELETE as any, { parameters: [templateId] }),
    {
      onSuccess: () => {
        queryClient.setQueryData<ITemplate[]>(
          [API_KEYS.TEMPLATES_LIST, profileInfo!._projectId],
          (oldData) => oldData?.filter((item) => item._id !== templateId)
        );
        queryClient.removeQueries([API_KEYS.TEMPLATE_DETAILS, templateId]);
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

  const onIntegrationClick = () => {
    if (templateData && profileInfo) {
      modals.open({
        modalId: MODAL_KEYS.INTEGRATION_DETAILS,
        centered: true,
        size: 'calc(70vw - 3rem)',
        children: (
          <IntegrationModal
            templateId={templateData?._id}
            projectId={templateData?._projectId}
            accessToken={profileInfo?.accessToken}
            integrations={templateData.integration}
          />
        ),
        withCloseButton: true,
      });
    }
  };

  const onUpdateClick = () => {
    if (templateData)
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
    onIntegrationClick,
    isColumnListLoading,
    isTemplateDataLoading,
    onSpreadsheetImported,
    updateImport,
    meta,
  };
}

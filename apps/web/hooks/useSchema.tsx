import { modals } from '@mantine/modals';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { commonApi } from '@libs/api';
import { IColumn, IErrorObject } from '@impler/shared';
import { API_KEYS, MODAL_KEYS, MODAL_TITLES } from '@config';

import { AddColumnForm } from '@components/imports/forms/AddColumnForm';
import { UpdateColumnForm } from '@components/imports/forms/UpdateColumnForm';
import { ConfirmDelete } from '@components/imports/forms/ConfirmDelete';

interface UseSchemaProps {
  templateId: string;
}

export function useSchema({ templateId }: UseSchemaProps) {
  const queryClient = useQueryClient();
  const { data: columns, isLoading: isColumnListLoading } = useQuery<unknown, IErrorObject, IColumn[], string[]>(
    [API_KEYS.TEMPLATE_COLUMNS_LIST, templateId],
    () => commonApi<IColumn[]>(API_KEYS.TEMPLATE_COLUMNS_LIST as any, { parameters: [templateId] })
  );
  const { mutate: onDelete } = useMutation<unknown, IErrorObject, string, string[]>(
    [API_KEYS.COLUMN_DELETE, templateId],
    (columnId) => commonApi(API_KEYS.COLUMN_DELETE as any, { parameters: [columnId] }),
    {
      onSuccess: (_data, columnIdVariable) => {
        queryClient.setQueryData<IColumn[]>([API_KEYS.TEMPLATE_COLUMNS_LIST, templateId], (oldData) => {
          return oldData?.filter((item) => item._id !== columnIdVariable);
        });
      },
    }
  );

  function onAddColumnClick() {
    modals.open({
      modalId: MODAL_KEYS.COLUMN_CREATE,
      title: MODAL_TITLES.COLUMN_CREATE,
      children: <AddColumnForm templateId={templateId} queryClient={queryClient} />,
    });
  }

  function onEditColumnClick(columnId: string) {
    const columnData = columns?.find((item) => item._id === columnId);
    if (columnData) {
      modals.open({
        modalId: MODAL_KEYS.COLUMN_UPDATE,
        title: MODAL_TITLES.COLUMN_UPDATE,
        children: <UpdateColumnForm data={columnData} templateId={templateId} queryClient={queryClient} />,
      });
    }
  }

  function onConfirmDelete(columnId: string) {
    modals.close(MODAL_KEYS.COLUMN_DELETE);
    onDelete(columnId);
  }

  function onDeleteColumnClick(columnId: string) {
    modals.open({
      modalId: MODAL_KEYS.COLUMN_DELETE,
      title: MODAL_TITLES.COLUMN_DELETE,
      children: <ConfirmDelete onConfirm={() => onConfirmDelete(columnId)} />,
    });
  }

  return {
    columns,
    isLoading: isColumnListLoading,
    onAddColumnClick,
    onEditColumnClick,
    onDeleteColumnClick,
  };
}

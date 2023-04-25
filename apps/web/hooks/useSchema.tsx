import { modals } from '@mantine/modals';

import { commonApi } from '@libs/api';
import { IColumn, IErrorObject } from '@impler/shared';
import { API_KEYS, MODAL_KEYS, MODAL_TITLES } from '@config';
import { AddColumnForm } from '@components/imports/AddColumnForm';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

interface UseSchemaProps {
  templateId: string;
}

export function useSchema({ templateId }: UseSchemaProps) {
  const queryClients = useQueryClient();
  const { data: columns, isLoading: isColumnListLoading } = useQuery<unknown, IErrorObject, IColumn[], string[]>(
    [API_KEYS.COLUMNS_LIST, templateId],
    () => commonApi<IColumn[]>(API_KEYS.COLUMNS_LIST as any, { parameters: [templateId] })
  );
  const { mutate: createColumn, isLoading: isColumnCreateLoading } = useMutation<
    IColumn,
    IErrorObject,
    IColumn,
    string[]
  >(
    [API_KEYS.COLUMN_CREATE, templateId],
    (data) => commonApi(API_KEYS.COLUMN_CREATE as any, { parameters: [templateId], body: data }),
    {
      onSuccess: (data) => {
        queryClients.setQueryData<IColumn[]>([API_KEYS.COLUMNS_LIST, templateId], (oldData) => [
          ...(oldData || []),
          data,
        ]);
        modals.close(MODAL_KEYS.COLUMN_CREATE);
      },
    }
  );

  function onAddColumnClick() {
    modals.open({
      modalId: MODAL_KEYS.COLUMN_CREATE,
      title: MODAL_TITLES.COLUMN_CREATE,
      children: <AddColumnForm onSubmit={createColumn} />,
    });
  }

  function onEditColumnClick(columnId: string) {
    const columnData = columns?.find((item) => item._id === columnId);
    if (columnData) {
      modals.open({
        modalId: MODAL_KEYS.COLUMN_UPDATE,
        title: MODAL_TITLES.COLUMN_UPDATE,
        children: <AddColumnForm onSubmit={createColumn} data={columnData} />,
      });
    }
  }

  return {
    columns,
    isLoading: isColumnListLoading || isColumnCreateLoading,
    onAddColumnClick,
    onEditColumnClick,
  };
}

import { modals } from '@mantine/modals';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { commonApi } from '@libs/api';
import { track } from '@libs/amplitude';
import { IColumn, IErrorObject } from '@impler/shared';
import { API_KEYS, MODAL_KEYS, MODAL_TITLES } from '@config';

import { ConfirmDelete } from '@components/imports/forms/ConfirmDelete';
import { UpdateColumnForm } from '@components/imports/forms/UpdateColumnForm';

interface UseSchemaProps {
  templateId: string;
}

export function useSchema({ templateId }: UseSchemaProps) {
  const queryClient = useQueryClient();
  const { register, control, watch, reset, setFocus, handleSubmit, formState } = useForm<IColumn>({
    defaultValues: {
      type: 'String',
    },
  });
  const { data: columns, isLoading: isColumnListLoading } = useQuery<unknown, IErrorObject, IColumn[], string[]>(
    [API_KEYS.TEMPLATE_COLUMNS_LIST, templateId],
    () => commonApi<IColumn[]>(API_KEYS.TEMPLATE_COLUMNS_LIST as any, { parameters: [templateId] })
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
        queryClient.invalidateQueries([API_KEYS.TEMPLATE_COLUMNS_LIST, templateId]);
        track({
          name: 'COLUMN CREATE',
          properties: {
            columnType: data.type as string,
            hasExtraColumnKeys: false,
            isRequired: data.isRequired,
            isUnique: data.isUnique,
          } as {
            columnType: string;
            isRequired: boolean;
            isUnique: boolean;
            hasExtraColumnKeys: boolean;
          },
        });
        reset();
        setFocus('name');
      },
    }
  );
  const { mutate: onDelete } = useMutation<unknown, IErrorObject, string, string[]>(
    [API_KEYS.COLUMN_DELETE, templateId],
    (columnId) => commonApi(API_KEYS.COLUMN_DELETE as any, { parameters: [columnId] }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([API_KEYS.TEMPLATE_COLUMNS_LIST, templateId]);
      },
    }
  );

  function onEditColumnClick(columnId: string) {
    const columnData = columns?.find((item) => item._id === columnId);
    if (columnData) {
      modals.open({
        modalId: MODAL_KEYS.COLUMN_UPDATE,
        title: MODAL_TITLES.COLUMN_UPDATE,
        children: (
          <UpdateColumnForm
            data={columnData}
            refetchColumns={() => queryClient.invalidateQueries([API_KEYS.TEMPLATE_COLUMNS_LIST, templateId])}
          />
        ),
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
  function onAddColumnSubmit(data: IColumn) {
    createColumn(data);
  }

  return {
    control,
    columns,
    register,
    watch,
    formState,
    onEditColumnClick,
    onDeleteColumnClick,
    isColumnCreateLoading,
    isLoading: isColumnListLoading,
    handleSubmit: handleSubmit(onAddColumnSubmit),
  };
}

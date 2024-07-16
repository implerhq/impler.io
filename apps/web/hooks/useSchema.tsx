import dynamic from 'next/dynamic';
import { modals } from '@mantine/modals';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { commonApi } from '@libs/api';
import { notify } from '@libs/notify';
import { track } from '@libs/amplitude';
import { IColumn, IErrorObject } from '@impler/shared';
import { API_KEYS, MODAL_KEYS, MODAL_TITLES, NOTIFICATION_KEYS } from '@config';

import { useUpdateBulkColumns } from './useUpdateBulkColumns';
import { ConfirmDelete } from '@components/imports/forms/ConfirmDelete';

const ColumnForm = dynamic(() => import('@components/imports/forms/ColumnForm').then((mod) => mod.ColumnForm), {
  ssr: false,
});

interface UseSchemaProps {
  templateId: string;
}

export function useSchema({ templateId }: UseSchemaProps) {
  const queryClient = useQueryClient();
  const [showAddRow, setShowAddRow] = useState(false);
  const { register, control, watch, reset, setFocus, handleSubmit, formState, getValues } = useForm<IColumn>({
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
        queryClient.refetchQueries([API_KEYS.TEMPLATE_COLUMNS_LIST, templateId]);
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
        reset({});
        setFocus('name');
      },
      onError: (error: IErrorObject) => {
        notify(NOTIFICATION_KEYS.COLUMN_ERRROR, {
          message: error.message,
        });
      },
    }
  );
  const { mutate: updateColumn } = useMutation<IColumn, IErrorObject, { id: string; data: IColumn }, string[]>(
    [API_KEYS.COLUMN_UPDATE],
    ({ id, data }) => commonApi(API_KEYS.COLUMN_UPDATE as any, { parameters: [id], body: data }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([API_KEYS.TEMPLATE_COLUMNS_LIST, templateId]);
        modals.close(MODAL_KEYS.COLUMN_UPDATE);
      },
      onError: (error: IErrorObject) => {
        notify(NOTIFICATION_KEYS.COLUMN_ERRROR, {
          message: error.message,
        });
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
  const { updateColumns } = useUpdateBulkColumns({ templateId });

  function onEditColumnClick(columnId: string) {
    const columnData = columns?.find((item) => item._id === columnId);
    if (columnData) {
      modals.open({
        size: '70%',
        trapFocus: true,
        withCloseButton: false,
        modalId: MODAL_KEYS.COLUMN_UPDATE,
        children: <ColumnForm data={columnData} onSubmit={(data) => updateColumn({ id: columnId, data })} />,
      });
    }
  }

  function onValidationsClick(columnData: Partial<IColumn>) {
    if (columnData) {
      modals.open({
        size: '70%',
        trapFocus: true,
        withCloseButton: false,
        modalId: MODAL_KEYS.COLUMN_UPDATE,
        children: (
          <ColumnForm
            data={columnData}
            onSubmit={(data) => {
              reset(data);
              modals.close(MODAL_KEYS.COLUMN_UPDATE);
            }}
          />
        ),
      });
    }
  }

  function onConfirmDelete(columnId: string) {
    modals.close(MODAL_KEYS.COLUMN_DELETE);
    onDelete(columnId);
  }
  function onMoveColumns(itemIndex: number, dropIndex: number) {
    if (columns) {
      const newColumns = [...columns];
      const moveItem = newColumns.splice(itemIndex, 1)[0];
      newColumns.splice(dropIndex, 0, moveItem);
      updateColumns(newColumns);
    }
  }
  function onDeleteColumnClick(columnId: string) {
    modals.open({
      modalId: MODAL_KEYS.COLUMN_DELETE,
      title: MODAL_TITLES.COLUMN_DELETE,
      children: <ConfirmDelete onConfirm={() => onConfirmDelete(columnId)} />,
    });
  }
  function onAddColumnSubmit(data: IColumn) {
    if (!data.key) data.key = data.name;
    createColumn(data);
  }

  useEffect(() => {
    if (showAddRow) setFocus('name');
  }, [setFocus, showAddRow]);

  return {
    watch,
    control,
    columns,
    register,
    formState,
    getValues,
    showAddRow,
    onMoveColumns,
    setShowAddRow,
    onEditColumnClick,
    onValidationsClick,
    onDeleteColumnClick,
    isColumnCreateLoading,
    isLoading: isColumnListLoading,
    handleSubmit: handleSubmit(onAddColumnSubmit),
  };
}

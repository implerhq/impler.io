import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';

import { API_KEYS } from '@config';
import { commonApi } from '@libs/api';
import { IColumn, IErrorObject } from '@impler/shared';
import { useUpdateBulkColumns } from './useUpdateBulkColumns';

interface UseSchemaProps {
  templateId: string;
}

interface ColumnsData {
  columns: string;
}

export function useColumnsEditor({ templateId }: UseSchemaProps) {
  const [columnErrors, setColumnErrors] = useState<Record<number, string[]>>();
  const {
    control,
    setError,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<ColumnsData>();
  const { data: columns, isLoading: isColumnListLoading } = useQuery<unknown, IErrorObject, IColumn[], string[]>(
    [API_KEYS.TEMPLATE_COLUMNS_LIST, templateId],
    () => commonApi<IColumn[]>(API_KEYS.TEMPLATE_COLUMNS_LIST as any, { parameters: [templateId] }),
    {
      onSuccess(data) {
        const formattedColumns = data.map(
          ({
            key,
            name,
            type,
            alternateKeys,
            isRequired,
            isUnique,
            regex,
            dateFormats,
            regexDescription,
            selectValues,
            sequence,
            defaultValue,
            allowMultiSelect,
          }) => ({
            key,
            name,
            type,
            alternateKeys,
            isRequired,
            isUnique,
            regex,
            dateFormats,
            defaultValue,
            regexDescription,
            selectValues,
            sequence,
            allowMultiSelect,
          })
        );
        setValue('columns', JSON.stringify(formattedColumns, null, 2));
      },
    }
  );
  const onSaveColumnsClick = (data: ColumnsData) => {
    setColumnErrors(undefined);
    try {
      JSON.parse(data.columns);
    } catch (error) {
      return setError('columns', { type: 'JSON', message: 'Provided JSON is invalid!' });
    }

    updateColumns(JSON.parse(data.columns));
  };
  const onColumnUpdateError = (error: IErrorObject) => {
    if (error.error && Array.isArray(error.message)) {
      setColumnErrors(
        error.message.reduce((acc, message) => {
          const columnIndex = Number(message[1]) + 1;
          const trimmedMessage = String(message).substring(4);
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          if (Array.isArray[acc[columnIndex]]) {
            acc[columnIndex].errors.push(trimmedMessage);
          } else {
            acc[columnIndex] = [trimmedMessage];
          }

          return acc;
        }, {})
      );
      setError('columns', { type: 'API', message: 'Columns are not valid!' });
    } else {
      setError('columns', { type: 'API', message: error.message });
    }
  };
  const { isUpdateColumsLoading, updateColumns } = useUpdateBulkColumns({ templateId, onError: onColumnUpdateError });

  return {
    errors,
    control,
    columns,
    columnErrors,
    isColumnListLoading,
    isUpdateColumsLoading,
    onSaveColumnsClick: handleSubmit(onSaveColumnsClick),
  };
}

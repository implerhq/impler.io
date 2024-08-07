import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';

import { API_KEYS } from '@config';
import { commonApi } from '@libs/api';
import { IColumn, IErrorObject } from '@impler/shared';
import { useUpdateBulkColumns } from './useUpdateBulkColumns';
import { usePlanMetaData } from 'store/planmeta.store.context';

interface UseSchemaProps {
  templateId: string;
}

interface ColumnsData {
  columns: string;
}

export function useColumnsEditor({ templateId }: UseSchemaProps) {
  const { meta } = usePlanMetaData();
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
            isFrozen,
            regex,
            delimiter,
            dateFormats,
            regexDescription,
            selectValues,
            defaultValue,
            description,
            allowMultiSelect,
          }) => ({
            key,
            name,
            type,
            description,
            alternateKeys,
            isRequired,
            isUnique,
            isFrozen,
            regex,
            delimiter,
            dateFormats,
            defaultValue,
            regexDescription,
            selectValues,
            allowMultiSelect,
          })
        );
        setValue('columns', JSON.stringify(formattedColumns, null, 2));
      },
    }
  );
  const onSaveColumnsClick = (data: ColumnsData) => {
    setColumnErrors(undefined);
    let parsedColumns;

    try {
      parsedColumns = JSON.parse(data.columns);
    } catch (error) {
      return setError('columns', { type: 'JSON', message: 'Provided JSON is invalid!' });
    }

    if (!meta?.IMAGE_UPLOAD) {
      const imageColumnExists = parsedColumns.some((column: IColumn) => column.type === 'Image');

      if (imageColumnExists) {
        return setError('columns', {
          type: 'Object',
          message: 'Image column type is not allowed in your current plan.',
        });
      }
    }

    updateColumns(parsedColumns);
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

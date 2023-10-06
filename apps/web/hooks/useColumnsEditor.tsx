import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { API_KEYS } from '@config';
import { commonApi } from '@libs/api';
import { notify } from '@libs/notify';
import { track } from '@libs/amplitude';
import { IColumn, IErrorObject } from '@impler/shared';

interface UseSchemaProps {
  templateId: string;
}

interface ColumnsData {
  columns: string;
}

export function useColumnsEditor({ templateId }: UseSchemaProps) {
  const queryClient = useQueryClient();
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
          }) => ({
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
          })
        );
        setValue('columns', JSON.stringify(formattedColumns, null, 2));
      },
    }
  );
  const { mutate: updateColumns, isLoading: isUpdateColumsLoading } = useMutation<
    IColumn[],
    IErrorObject,
    Partial<IColumn>[],
    string[]
  >(
    [API_KEYS.TEMPLATE_COLUMNS_UPDATE, templateId],
    (data) => commonApi(API_KEYS.TEMPLATE_COLUMNS_UPDATE as any, { parameters: [templateId], body: data }),
    {
      onSuccess: (data) => {
        queryClient.setQueryData<IColumn[]>([API_KEYS.TEMPLATE_COLUMNS_LIST, templateId], () => data);
        queryClient.invalidateQueries({ queryKey: [API_KEYS.TEMPLATE_CUSTOMIZATION_GET, templateId] });
        track({ name: 'BULK COLUMN UPDATE', properties: {} });
        notify('COLUMNS_UPDATED');
      },
      onError: (error) => {
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

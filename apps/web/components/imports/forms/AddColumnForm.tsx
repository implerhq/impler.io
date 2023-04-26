import { modals } from '@mantine/modals';
import { API_KEYS, MODAL_KEYS } from '@config';
import { IColumn, IErrorObject } from '@impler/shared';
import { QueryClient, useMutation } from '@tanstack/react-query';

import { commonApi } from '@libs/api';
import { ColumnForm } from './ColumnForm';

interface AddColumnFormProps {
  templateId: string;
  queryClient: QueryClient;
}

export function AddColumnForm({ templateId, queryClient }: AddColumnFormProps) {
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
        queryClient.setQueryData<IColumn[]>([API_KEYS.TEMPLATE_COLUMNS_LIST, templateId], (oldData) => [
          ...(oldData || []),
          data,
        ]);
        modals.close(MODAL_KEYS.COLUMN_CREATE);
      },
    }
  );

  return <ColumnForm onSubmit={createColumn} isLoading={isColumnCreateLoading} />;
}

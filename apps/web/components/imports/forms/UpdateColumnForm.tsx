import { modals } from '@mantine/modals';
import { API_KEYS, MODAL_KEYS } from '@config';
import { IColumn, IErrorObject } from '@impler/shared';
import { QueryClient, useMutation } from '@tanstack/react-query';

import { commonApi } from '@libs/api';
import { ColumnForm } from './ColumnForm';

interface UpdateColumnFormProps {
  data: IColumn;
  templateId: string;
  queryClient: QueryClient;
}

export function UpdateColumnForm({ data, templateId, queryClient }: UpdateColumnFormProps) {
  const { mutate: updateColumn, isLoading: isColumnUpdateLoading } = useMutation<
    IColumn,
    IErrorObject,
    IColumn,
    string[]
  >(
    [API_KEYS.COLUMN_UPDATE, data._id],
    (newData) => commonApi(API_KEYS.COLUMN_UPDATE as any, { parameters: [data._id], body: newData }),
    {
      onSuccess: (updatedData) => {
        queryClient.setQueryData<IColumn[]>(
          [API_KEYS.TEMPLATE_COLUMNS_LIST, templateId],
          (oldData) =>
            oldData?.map((item) => {
              if (item._id === data._id) {
                return updatedData;
              }

              return item;
            }) || []
        );
        queryClient.invalidateQueries({ queryKey: [API_KEYS.TEMPLATE_CUSTOMIZATION_GET, templateId] });
        modals.close(MODAL_KEYS.COLUMN_UPDATE);
      },
    }
  );

  return <ColumnForm onSubmit={updateColumn} data={data} isLoading={isColumnUpdateLoading} />;
}

import { modals } from '@mantine/modals';
import { API_KEYS, MODAL_KEYS } from '@config';
import { IColumn, IErrorObject } from '@impler/shared';
import { useMutation } from '@tanstack/react-query';

import { commonApi } from '@libs/api';
import { ColumnForm } from './ColumnForm';

interface UpdateColumnFormProps {
  data: IColumn;
  refetchColumns: () => void;
}

export function UpdateColumnForm({ data, refetchColumns }: UpdateColumnFormProps) {
  const { mutate: updateColumn, isLoading: isColumnUpdateLoading } = useMutation<
    IColumn,
    IErrorObject,
    IColumn,
    string[]
  >(
    [API_KEYS.COLUMN_UPDATE, data._id],
    (newData) => commonApi(API_KEYS.COLUMN_UPDATE as any, { parameters: [data._id], body: newData }),
    {
      onSuccess: () => {
        refetchColumns();
        modals.close(MODAL_KEYS.COLUMN_UPDATE);
      },
    }
  );

  return <ColumnForm onSubmit={updateColumn} data={data} isLoading={isColumnUpdateLoading} />;
}

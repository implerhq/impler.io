import { modals } from '@mantine/modals';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { commonApi } from '@libs/api';
import { IColumn, IErrorObject } from '@impler/shared';
import { API_KEYS, MODAL_KEYS, MODAL_TITLES } from '@config';
import { AddColumnForm } from '@components/imports/forms/AddColumnForm';
import { UpdateColumnForm } from '@components/imports/forms/UpdateColumnForm';

interface UseSchemaProps {
  templateId: string;
}

export function useSchema({ templateId }: UseSchemaProps) {
  const queryClient = useQueryClient();
  const { data: columns, isLoading: isColumnListLoading } = useQuery<unknown, IErrorObject, IColumn[], string[]>(
    [API_KEYS.COLUMNS_LIST, templateId],
    () => commonApi<IColumn[]>(API_KEYS.COLUMNS_LIST as any, { parameters: [templateId] })
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

  return {
    columns,
    isLoading: isColumnListLoading,
    onAddColumnClick,
    onEditColumnClick,
  };
}

import { useState } from 'react';
import { useRouter } from 'next/router';
import { modals } from '@mantine/modals';
import { useDebouncedState } from '@mantine/hooks';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { commonApi } from '@libs/api';
import { notify } from '@libs/notify';
import { track } from '@libs/amplitude';
import { useAppState } from 'store/app.context';
import { CreateImportForm } from '@components/imports/forms/CreateImportForm';
import { IErrorObject, ITemplate, IImport, IPaginationData } from '@impler/shared';
import { API_KEYS, MODAL_KEYS, MODAL_TITLES, NOTIFICATION_KEYS, VARIABLES } from '@config';

export function useImports() {
  const { push } = useRouter();
  const queryClient = useQueryClient();
  const { profileInfo } = useAppState();
  const [page, setPage] = useState<number>();
  const [limit, setLimit] = useState<number>(VARIABLES.TEN);
  const [search, setSearch] = useDebouncedState('', 500);
  const { mutate: createImport, isLoading: isCreateImportLoading } = useMutation<
    ITemplate,
    IErrorObject,
    ICreateTemplateData,
    (string | undefined)[]
  >(
    [API_KEYS.TEMPLATES_CREATE, profileInfo?._projectId],
    (data) =>
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      commonApi<ITemplate>(API_KEYS.TEMPLATES_CREATE as any, {
        body: { ...data, _projectId: profileInfo!._projectId! },
      }),
    {
      onSuccess: (data) => {
        modals.close(MODAL_KEYS.IMPORT_CREATE);
        queryClient.setQueryData<ITemplate[]>([API_KEYS.TEMPLATES_LIST, profileInfo!._projectId], (oldData) => [
          ...(oldData || []),
          data,
        ]);
        track({
          name: 'IMPORT CREATE',
          properties: {},
        });
        push(`/imports/${data._id}`);
        notify(NOTIFICATION_KEYS.IMPORT_CREATED);
      },
    }
  );
  const { data: importsData, isLoading: isImportsLoading } = useQuery<
    unknown,
    IErrorObject,
    IPaginationData<IImport>,
    (string | number | undefined)[]
  >(
    [API_KEYS.IMPORTS_LIST, profileInfo?._projectId, page, limit, search],
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    () =>
      commonApi<IPaginationData<IImport>>(API_KEYS.IMPORTS_LIST as any, {
        parameters: [profileInfo!._projectId],
        query: {
          limit,
          page,
          search,
        },
      }),
    {
      enabled: !!profileInfo,
      keepPreviousData: true,
    }
  );
  function onLimitChange(newLimit: number) {
    setLimit(newLimit);
    track({
      name: 'IMPORTS PAGINATION',
      properties: {
        limit: newLimit,
      },
    });
  }
  function onSearchChange(searchText: string) {
    setSearch(searchText);
    if (searchText) {
      track({
        name: 'IMPORTS PAGINATION',
        properties: {
          text: searchText,
        },
      });
    }
  }
  function onCreateClick() {
    modals.open({
      modalId: MODAL_KEYS.IMPORT_CREATE,
      title: MODAL_TITLES.IMPORT_CREATE,
      children: <CreateImportForm onSubmit={createImport} />,
    });
  }

  return {
    page,
    limit,
    search,
    importsData,
    onSearchChange,
    onCreateClick,
    onLimitChange,
    isImportsLoading,
    onPageChange: setPage,
    isCreateImportLoading,
  };
}

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { modals } from '@mantine/modals';
import { useDebouncedState, useLocalStorage } from '@mantine/hooks';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { commonApi } from '@libs/api';
import { notify } from '@libs/notify';
import { track } from '@libs/amplitude';
import { useAppState } from 'store/app.context';
import { API_KEYS, MODAL_KEYS, MODAL_TITLES, NOTIFICATION_KEYS, VARIABLES } from '@config';
import { IErrorObject, ITemplate, IImport, IPaginationData, IProjectPayload } from '@impler/shared';

import { CreateImportForm } from '@components/imports/forms/CreateImportForm';
import { DuplicateImportForm } from '@components/imports/forms/DuplicateImportForm';

export function useImports() {
  const { push } = useRouter();
  const queryClient = useQueryClient();
  const { profileInfo } = useAppState();
  const [page, setPage] = useState<number>();
  const [search, setSearch] = useDebouncedState('', 500);
  const [limit, setLimit] = useLocalStorage<number>({ key: 'limit', defaultValue: VARIABLES.TEN });
  const { data: projects } = useQuery<unknown, IErrorObject, IProjectPayload[], string[]>(
    [API_KEYS.PROJECTS_LIST],
    () => commonApi(API_KEYS.PROJECTS_LIST as any, {})
  );
  const { mutate: createImport, isLoading: isCreateImportLoading } = useMutation<
    ITemplate,
    IErrorObject,
    ICreateTemplateData,
    (string | undefined)[]
  >(
    [API_KEYS.TEMPLATES_CREATE, profileInfo?._projectId],
    (data) =>
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
  const { mutate: duplicateImport } = useMutation<
    ITemplate,
    IErrorObject,
    [string, IDuplicateTemplateData],
    (string | undefined)[]
  >(
    [API_KEYS.TEMPLATES_DUPLICATE, profileInfo?._projectId],
    ([templateId, data]) =>
      commonApi<ITemplate>(API_KEYS.TEMPLATES_DUPLICATE as any, {
        body: { ...data },
        parameters: [templateId],
      }),
    {
      onSuccess: (data) => {
        modals.close(MODAL_KEYS.IMPORT_DUPLICATE);
        queryClient.setQueryData<ITemplate[]>([API_KEYS.TEMPLATES_LIST, data._projectId], (oldData) => [
          ...(oldData || []),
          data,
        ]);
        track({
          name: 'IMPORT DUPLICATE',
          properties: {},
        });
        push(`/imports/${data._id}`);
        notify(NOTIFICATION_KEYS.IMPORT_DUPLICATED);
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
  function onDuplicateClick(importId: string) {
    const itemToDuplicate = importsData?.data.find((importItem) => importItem._id === importId);
    modals.open({
      modalId: MODAL_KEYS.IMPORT_DUPLICATE,
      title: MODAL_TITLES.IMPORT_DUPLICATE,
      children: (
        <DuplicateImportForm
          profile={profileInfo}
          projects={projects}
          originalName={itemToDuplicate?.name}
          onSubmit={(data) => duplicateImport([importId, data])}
        />
      ),
    });
  }

  useEffect(() => {
    if (importsData && page && importsData.data.length < page) {
      setPage(importsData.totalPages);
    }
  }, [importsData, page]);

  return {
    page,
    limit,
    search,
    importsData,
    onSearchChange,
    onCreateClick,
    onLimitChange,
    onDuplicateClick,
    isImportsLoading,
    onPageChange: setPage,
    isCreateImportLoading,
  };
}

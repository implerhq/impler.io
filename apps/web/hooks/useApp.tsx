import { useEffect, useState } from 'react';
import { useLocalStorage } from '@mantine/hooks';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { commonApi } from '@libs/api';
import { API_KEYS, CONSTANTS, ROUTES } from '@config';
import { IErrorObject, IProjectPayload } from '@impler/shared';
import { useRouter } from 'next/router';

export function useApp() {
  const queryClient = useQueryClient();
  const { replace } = useRouter();
  const [profile, setProfile, removeProfile] = useLocalStorage<IProfileData>({ key: CONSTANTS.PROFILE_STORAGE_NAME });
  const [projectId, setProjectId] = useState<string | undefined>();
  const { data: projects, isLoading: isProjectsLoading } = useQuery<null, IErrorObject, IProjectPayload[], string[]>(
    [API_KEYS.GET_PROJECTS],
    () => commonApi(API_KEYS.GET_PROJECTS as any, {})
  );
  const { mutate: logout } = useMutation([API_KEYS.LOGOUT], () => commonApi(API_KEYS.LOGOUT as any, {}), {
    onSuccess: () => {
      removeProfile();
      replace(ROUTES.SIGNIN);
    },
  });
  const { mutate: createProject, isLoading: isCreateProjectLoading } = useMutation<
    IProjectPayload,
    IErrorObject,
    ICreateProjectData,
    string[]
  >([API_KEYS.CREATE_PROJECT], (data) => commonApi(API_KEYS.CREATE_PROJECT as any, { body: data }), {
    onSuccess: (data) => {
      queryClient.setQueryData<IProjectPayload[]>([API_KEYS.GET_PROJECTS], (oldData) => [...(oldData || []), data]);
      setProfile({ ...profile, _projectId: data._id });
    },
  });

  useEffect(() => {
    if (profile) {
      setProjectId(profile._projectId);
    }
  }, [profile]);

  return {
    logout,
    profile,
    projects,
    projectId,
    setProjectId,
    createProject,
    isProjectsLoading: isProjectsLoading || isCreateProjectLoading,
  };
}

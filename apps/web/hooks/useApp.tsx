import { useLocalStorage } from '@mantine/hooks';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { commonApi } from '@libs/api';
import { API_KEYS, CONSTANTS, ROUTES, VARIABLES } from '@config';
import { IErrorObject, IProjectPayload, IEnvironmentData } from '@impler/shared';
import { useRouter } from 'next/router';

export function useApp() {
  const queryClient = useQueryClient();
  const { replace } = useRouter();
  const [profile, setProfile, removeProfile] = useLocalStorage<IProfileData>({ key: CONSTANTS.PROFILE_STORAGE_NAME });
  const { data: projects, isLoading: isProjectsLoading } = useQuery<unknown, IErrorObject, IProjectPayload[], string[]>(
    [API_KEYS.PROJECTS_LIST],
    () => commonApi(API_KEYS.PROJECTS_LIST as any, {})
  );
  const { refetch: fetchEnvironment } = useQuery<string, IErrorObject, IEnvironmentData, (string | undefined)[]>(
    [API_KEYS.PROJECT_ENVIRONMENT, profile?._projectId],
    () => commonApi(API_KEYS.PROJECT_ENVIRONMENT as any, { parameters: [profile._projectId!] }),
    {
      enabled: false,
      onSuccess(data) {
        setProfile((oldProfile) => ({
          ...oldProfile,
          accessToken: data.apiKeys[VARIABLES.ZERO].key,
        }));
      },
    }
  );
  const { mutate: logout } = useMutation([API_KEYS.LOGOUT], () => commonApi(API_KEYS.LOGOUT as any, {}), {
    onSuccess: () => {
      removeProfile();
      replace(ROUTES.SIGNIN);
    },
  });
  const { mutate: createProject, isLoading: isCreateProjectLoading } = useMutation<
    { project: IProjectPayload; environement: IEnvironmentData },
    IErrorObject,
    ICreateProjectData,
    string[]
  >([API_KEYS.PROJECT_CREATE], (data) => commonApi(API_KEYS.PROJECT_CREATE as any, { body: data }), {
    onSuccess: (data) => {
      queryClient.setQueryData<IProjectPayload[]>([API_KEYS.PROJECTS_LIST], (oldData) => [
        ...(oldData || []),
        data.project,
      ]);
      setProfile({
        ...profile,
        _projectId: data.project._id,
        accessToken: data.environement.apiKeys[VARIABLES.ZERO].key,
      });
    },
  });

  function selectProject(_projectId: string) {
    setProfile((oldProfile) => ({
      ...oldProfile,
      _projectId,
    }));
    fetchEnvironment();
  }

  return {
    logout,
    profile,
    projects,
    setProjectId: selectProject,
    createProject,
    isProjectsLoading: isProjectsLoading || isCreateProjectLoading,
  };
}

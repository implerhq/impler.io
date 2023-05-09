import { useLocalStorage } from '@mantine/hooks';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { commonApi } from '@libs/api';
import { API_KEYS, CONSTANTS, NOTIFICATION_KEYS, ROUTES, VARIABLES } from '@config';
import { IErrorObject, IProjectPayload, IEnvironmentData } from '@impler/shared';
import { useRouter } from 'next/router';
import { notify } from '@libs/notify';

export function useApp() {
  const queryClient = useQueryClient();
  const { replace } = useRouter();
  const [profile, setProfile, removeProfile] = useLocalStorage<IProfileData>({ key: CONSTANTS.PROFILE_STORAGE_NAME });
  const { data: projects, isLoading: isProjectsLoading } = useQuery<unknown, IErrorObject, IProjectPayload[], string[]>(
    [API_KEYS.PROJECTS_LIST],
    () => commonApi(API_KEYS.PROJECTS_LIST as any, {})
  );
  const { mutate: setEnvironment } = useMutation<IEnvironmentData, IErrorObject, string, (string | undefined)[]>(
    [API_KEYS.PROJECT_ENVIRONMENT],
    (id: string) => commonApi(API_KEYS.PROJECT_ENVIRONMENT as any, { parameters: [id] }),
    {
      onSuccess(data, projectId) {
        setProfile((oldProfile) => ({
          ...oldProfile,
          accessToken: data.apiKeys[VARIABLES.ZERO].key,
          _projectId: projectId,
        }));
        replace(ROUTES.IMPORTS);
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
    { project: IProjectPayload; environment: IEnvironmentData },
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
        accessToken: data.environment.apiKeys[VARIABLES.ZERO].key,
      });
      notify(NOTIFICATION_KEYS.PROJECT_CREATED, {
        title: 'Project created',
        message: `Project ${data.project.name} created successfully`,
      });
    },
  });
  const onProjectIdChange = (id: string) => {
    const project = projects?.find((projectItem) => projectItem._id === id);
    if (project) {
      setEnvironment(project._id);
    }
  };

  return {
    logout,
    profile,
    projects,
    setProjectId: onProjectIdChange,
    createProject,
    isProjectsLoading: isProjectsLoading || isCreateProjectLoading,
  };
}

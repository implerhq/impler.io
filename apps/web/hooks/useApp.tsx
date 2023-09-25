import { useRouter } from 'next/router';
import HyperDX from '@hyperdx/browser';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { commonApi } from '@libs/api';
import { notify } from '@libs/notify';
import { track } from '@libs/amplitude';
import { useAppState } from 'store/app.context';
import { API_KEYS, NOTIFICATION_KEYS, ROUTES } from '@config';
import { IErrorObject, IProjectPayload, IEnvironmentData } from '@impler/shared';

export function useApp() {
  const { replace } = useRouter();
  const queryClient = useQueryClient();
  const { profileInfo, setProfileInfo } = useAppState();
  const { isFetching: isProfileLoading } = useQuery<unknown, IErrorObject, IProfileData, [string]>(
    [API_KEYS.ME],
    () => commonApi<IProfileData>(API_KEYS.ME as any, {}),
    {
      onSuccess(profileData) {
        setProfileInfo(profileData);
        HyperDX.setGlobalAttributes({
          userId: profileData._id,
          userEmail: profileData.email,
          userName: profileData.firstName + profileData.lastName,
        });
      },
    }
  );
  const { data: projects, isLoading: isProjectsLoading } = useQuery<unknown, IErrorObject, IProjectPayload[], string[]>(
    [API_KEYS.PROJECTS_LIST],
    () => commonApi(API_KEYS.PROJECTS_LIST as any, {})
  );
  const { mutate: logout } = useMutation([API_KEYS.LOGOUT], () => commonApi(API_KEYS.LOGOUT as any, {}), {
    onSuccess: () => {
      track({
        name: 'LOGOUT',
        properties: {},
      });
      replace(ROUTES.SIGNIN);
    },
  });
  const { mutate: createProject, isLoading: isCreateProjectLoading } = useMutation<
    { project: IProjectPayload; environment: IEnvironmentData },
    IErrorObject,
    ICreateProjectData,
    string[]
  >([API_KEYS.PROJECT_CREATE], (data) => commonApi(API_KEYS.PROJECT_CREATE as any, { body: data }), {
    onSuccess: ({ project }) => {
      if (project) {
        queryClient.setQueryData<IProjectPayload[]>([API_KEYS.PROJECTS_LIST], (oldData) => [
          ...(oldData || []),
          project,
        ]);
        track({
          name: 'PROJECT CREATE',
          properties: {
            duringOnboard: false,
          },
        });
        if (profileInfo) {
          setProfileInfo({
            ...profileInfo,
            _projectId: project._id,
          });
        }
        notify(NOTIFICATION_KEYS.PROJECT_CREATED, {
          title: 'Project created',
          message: `Project ${project.name} created successfully`,
        });
      }
    },
  });
  const onProjectIdChange = (id: string) => {
    const project = projects?.find((projectItem) => projectItem._id === id);
    if (project && profileInfo) {
      setProfileInfo({
        ...profileInfo,
        _projectId: id,
      });
      replace(ROUTES.IMPORTS);
      track({
        name: 'PROJECT SWITCH',
        properties: {},
      });
    }
  };

  return {
    logout,
    projects,
    createProject,
    isProfileLoading,
    profile: profileInfo,
    setProjectId: onProjectIdChange,
    isProjectsLoading: isProjectsLoading || isCreateProjectLoading,
  };
}

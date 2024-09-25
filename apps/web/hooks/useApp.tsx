import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { commonApi } from '@libs/api';
import { notify } from '@libs/notify';
import { track } from '@libs/amplitude';
import { useLogout } from './auth/useLogout';
import { useAppState } from 'store/app.context';
import { defineAbilitiesFor } from 'config/defineAbilities';
import { API_KEYS, NOTIFICATION_KEYS, ROUTES } from '@config';
import { IErrorObject, IProjectPayload, IEnvironmentData } from '@impler/shared';

export function useApp() {
  const queryClient = useQueryClient();
  const { replace, pathname } = useRouter();
  const { logout } = useLogout({
    onLogout: () => replace(ROUTES.SIGNIN),
  });
  const { profileInfo, setProfileInfo, setAbility } = useAppState();

  const {
    data: profileData,
    isFetching: isProfileLoading,
    refetch: refetchMeData,
  } = useQuery<IProfileData, IErrorObject>([API_KEYS.ME], () => commonApi<IProfileData>(API_KEYS.ME as any, {}), {
    onSuccess(profile) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      window.usetifulTags = { userId: profile?._id };
    },
  });

  const { data: projects, isLoading: isProjectsLoading } = useQuery<IProjectPayload[], IErrorObject>(
    [API_KEYS.PROJECTS_LIST],
    () => commonApi<IProjectPayload[]>(API_KEYS.PROJECTS_LIST as any, {})
  );
  const { mutate: switchProject } = useMutation<string, IErrorObject, string, string[]>(
    [API_KEYS.PROJECT_SWITCH],
    (projectId) => commonApi(API_KEYS.PROJECT_SWITCH as any, { parameters: [projectId] }),
    {
      onSuccess() {
        refetchMeData();
      },
    }
  );

  const { mutate: createProject, isLoading: isCreateProjectLoading } = useMutation<
    { project: IProjectPayload; environment: IEnvironmentData },
    IErrorObject,
    ICreateProjectData
  >([API_KEYS.PROJECT_CREATE], (data) => commonApi(API_KEYS.PROJECT_CREATE as any, { body: data }), {
    onSuccess: ({ project }) => {
      queryClient.setQueryData<IProjectPayload[]>([API_KEYS.PROJECTS_LIST], () => {
        return [...(projects || []), project];
      });
      track({ name: 'PROJECT CREATE', properties: { duringOnboard: false } });
      if (profileInfo) {
        refetchMeData();
      }
      if (![ROUTES.SETTINGS, ROUTES.ACTIVITIES, ROUTES.IMPORTS].includes(pathname)) {
        replace(ROUTES.IMPORTS);
      }
      notify(NOTIFICATION_KEYS.PROJECT_CREATED, {
        title: 'Project created',
        message: `Project ${project.name} created successfully`,
      });
    },
  });

  const onProjectIdChange = async (id: string) => {
    const project = projects?.find((projectItem) => projectItem._id === id);
    if (project && profileInfo) {
      setProfileInfo({
        ...profileInfo,
        _projectId: project._id,
        projectName: project?.name,
      });
      setAbility(defineAbilitiesFor(profileInfo.role));
      switchProject(id);

      if (![ROUTES.SETTINGS, ROUTES.ACTIVITIES, ROUTES.IMPORTS].includes(pathname)) {
        replace(ROUTES.HOME);
      }

      track({ name: 'PROJECT SWITCH', properties: {} });
    }
  };

  useEffect(() => {
    if (profileData && projects) {
      const project = projects?.length ? projects?.find((item) => profileData._projectId === item._id) : undefined;
      setProfileInfo({
        ...profileData,
        projectName: project?.name || '',
      });
      setAbility(defineAbilitiesFor(profileData.role));
    }
  }, [profileData, projects, setAbility, setProfileInfo]);

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

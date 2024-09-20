import { useRouter } from 'next/router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { commonApi } from '@libs/api';
import { notify } from '@libs/notify';
import { track } from '@libs/amplitude';
import { useAppState } from 'store/app.context';
import { API_KEYS, NOTIFICATION_KEYS, ROUTES } from '@config';
import { IErrorObject, IProjectPayload, IEnvironmentData } from '@impler/shared';
import { defineAbilitiesFor } from 'config/defineAbilities';

export function useApp() {
  const { replace, pathname } = useRouter();
  const queryClient = useQueryClient();
  const { profileInfo, setProfileInfo, setAbility } = useAppState();
  const { isFetching: isProfileLoading } = useQuery<IProfileData, IErrorObject>(
    [API_KEYS.ME],
    () => commonApi<IProfileData>(API_KEYS.ME as any, {}),
    {
      onSuccess(profileData) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        window.usetifulTags = { userId: profileData?._id };
        setProfileInfo(profileData);
        setAbility(defineAbilitiesFor(profileData.role));
      },
    }
  );

  const { data: projects, isLoading: isProjectsLoading } = useQuery<IProjectPayload[], IErrorObject>(
    [API_KEYS.PROJECTS_LIST],
    () => commonApi<IProjectPayload[]>(API_KEYS.PROJECTS_LIST as any, {}),
    {
      onSuccess(data) {
        if (profileInfo && data.length) {
          setProfileInfo({
            ...profileInfo,
            _projectId: data[0]._id,
            projectName: data[0].name,
          });
          setAbility(defineAbilitiesFor(profileInfo.role));
        }
      },
    }
  );

  const { mutate: logout } = useMutation(() => commonApi(API_KEYS.LOGOUT as any, {}), {
    onSuccess: () => {
      track({ name: 'LOGOUT', properties: {} });
      replace(ROUTES.SIGNIN);
    },
  });
  const { mutate: switchProject } = useMutation<unknown, IErrorObject, string, string[]>(
    [API_KEYS.PROJECT_SWITCH],
    (projectId) => commonApi(API_KEYS.PROJECT_SWITCH as any, { parameters: [projectId] })
  );

  const { mutate: createProject, isLoading: isCreateProjectLoading } = useMutation<
    { project: IProjectPayload; environment: IEnvironmentData },
    IErrorObject,
    ICreateProjectData
  >([API_KEYS.PROJECT_CREATE], (data) => commonApi(API_KEYS.PROJECT_CREATE as any, { body: data }), {
    onSuccess: ({ project, environment }) => {
      queryClient.setQueryData<IProjectPayload[]>([API_KEYS.PROJECTS_LIST], () => {
        return [...(projects || []), project];
      });
      track({ name: 'PROJECT CREATE', properties: { duringOnboard: false } });
      if (profileInfo) {
        setProfileInfo({
          ...profileInfo,
          _projectId: project._id,
          projectName: project.name,
          accessToken: environment.key,
        });
        setAbility(defineAbilitiesFor(profileInfo.role));
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
        replace(ROUTES.IMPORTS);
      }

      track({ name: 'PROJECT SWITCH', properties: {} });
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

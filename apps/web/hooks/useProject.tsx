import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { modals } from '@mantine/modals';
import { useForm } from 'react-hook-form';
import { Flex, Title } from '@mantine/core';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { commonApi } from '@libs/api';
import { notify } from '@libs/notify';
import { track } from '@libs/amplitude';
import { useAppState } from 'store/app.context';
import { defineAbilitiesFor } from 'config/defineAbilities';
import { API_KEYS, MODAL_KEYS, NOTIFICATION_KEYS, ROUTES } from '@config';
import { IEnvironmentData, IErrorObject, IProjectPayload } from '@impler/shared';
import { ConfirmDeleteProjectModal, ManageProjectModal } from '@components/ManageProject';

export function useProject() {
  const queryClient = useQueryClient();
  const { replace } = useRouter();

  const { setAbility, setProfileInfo, profileInfo } = useAppState();

  const {
    data: profileData,
    isFetching: isProfileLoading,
    refetch: refetchMeData,
  } = useQuery<IProfileData, IErrorObject>([API_KEYS.ME], () => commonApi<IProfileData>(API_KEYS.ME as any, {}), {
    onSuccess(data) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      window.usetifulTags = { userId: data?._id };
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<ICreateProjectData>({
    defaultValues: {
      name: '',
    },
  });

  const onSubmit = (data: ICreateProjectData) => {
    if (data.name.trim()) {
      createProject(
        { name: data.name.trim() },
        {
          onSuccess: () => {
            queryClient.invalidateQueries([API_KEYS.PROJECTS_LIST]);
            reset();
          },
          onError: () => {},
        }
      );
    } else {
      setError('name', { type: 'manual', message: 'Project name is required' });
    }
  };

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
        queryClient.invalidateQueries([API_KEYS.LIST_TEAM_MEMBERS]);
        modals.close(MODAL_KEYS.MANAGE_PROJECT_MODAL);
      },
    }
  );

  const { mutate: createProject, isLoading: isCreateProjectLoading } = useMutation<
    { project: IProjectPayload; environment: IEnvironmentData },
    IErrorObject,
    ICreateProjectData
  >([API_KEYS.PROJECT_CREATE], (data) => commonApi(API_KEYS.PROJECT_CREATE as any, { body: data }), {
    onSuccess: ({ project }) => {
      queryClient.setQueryData<IProjectPayload[]>([API_KEYS.PROJECTS_LIST], () => [...(projects || []), project]);
      track({ name: 'PROJECT CREATE', properties: { duringOnboard: false } });
      replace(ROUTES.HOME);
      refetchMeData();
      notify(NOTIFICATION_KEYS.PROJECT_CREATED, {
        title: 'Project created',
        message: `Project ${project.name} created successfully`,
      });
    },
  });

  const { mutate: deleteProject } = useMutation<void, IErrorObject, string>(
    [API_KEYS.PROJECT_DELETE],
    (projectId) => commonApi(API_KEYS.PROJECT_DELETE as any, { parameters: [projectId] }),
    {
      onSuccess: (_, deletedProjectId) => {
        queryClient.setQueryData<IProjectPayload[]>(
          [API_KEYS.PROJECTS_LIST],
          (oldProjects) => oldProjects?.filter((project) => project._id !== deletedProjectId)
        );
        notify(NOTIFICATION_KEYS.PROJECT_DELETED, {
          title: 'Project deleted',
          message: 'Project deleted successfully',
        });
        if (profileInfo?._projectId === deletedProjectId) {
          const remainingProjects = projects?.filter((project) => project._id !== deletedProjectId);
          if (remainingProjects?.length) {
            switchProject(remainingProjects[0]._id);
          } else {
            replace(ROUTES.HOME);
          }
        }
        modals.close(MODAL_KEYS.CONFIRM_PROJECT_DELETE);
        refetchMeData();
      },
    }
  );

  const onProjectIdChange = (id: string) => {
    const project = projects?.find((item) => item._id === id);
    if (project) {
      switchProject(id);
      track({ name: 'PROJECT SWITCH', properties: {} });
      notify(NOTIFICATION_KEYS.PROJECT_SWITCHED, {
        title: 'Project switched',
        message: (
          <>
            You&apos;re switched to <b>{project.name}</b> project.
          </>
        ),
        color: 'green',
      });
    }
  };

  const sortedProjects = projects ? projects.sort((a) => (a._id === profileData?._projectId ? -1 : 1)) : [];

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

  function onEditImportClick() {
    modals.open({
      modalId: MODAL_KEYS.MANAGE_PROJECT_MODAL,
      centered: true,
      size: 'calc(60vw - 3rem)',
      children: <ManageProjectModal />,
      withCloseButton: true,
      title: (
        <>
          <Flex justify="space-between">
            <Title order={3}>Manage Project</Title>
          </Flex>
        </>
      ),
    });
  }

  const handleDeleteProject = (projectId: string) => {
    const projectToDelete = projects?.find((project) => project._id === projectId);
    if (projectToDelete && projectToDelete.isOwner) {
      modals.open({
        title: 'Confirm Project Deletion',
        children: (
          <ConfirmDeleteProjectModal
            projectName={projectToDelete.name}
            onDeleteConfirm={() => {
              deleteProject(projectId);
              modals.closeAll();
            }}
            onCancel={() => modals.closeAll()}
          />
        ),
      });
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
    isProjectsLoading,
    isCreateProjectLoading,
    projects: sortedProjects,
    currentProjectId: profileData?._projectId,
    isProfileLoading,
    deleteProject,
    onProjectIdChange,
    onEditImportClick,
    handleDeleteProject,
  };
}

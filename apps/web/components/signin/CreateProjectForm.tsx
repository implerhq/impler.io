import Image from 'next/image';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { Title, Stack } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { useMutation } from '@tanstack/react-query';

import { Input } from '@ui/input';
import { Button } from '@ui/button';

import { commonApi } from '@libs/api';
import { API_KEYS, CONSTANTS } from '@config';
import DarkLogo from '@assets/images/logo-dark.png';
import { IProjectPayload, IErrorObject } from '@impler/shared';

export default function CreateProjectForm() {
  const { push } = useRouter();
  const [, setProfile] = useLocalStorage<IProfileData>({ key: CONSTANTS.PROFILE_STORAGE_NAME });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ICreateProjectData>();
  const { mutate: createProject, isLoading: isCreateProjectLoading } = useMutation<
    IProjectPayload,
    IErrorObject,
    ICreateProjectData,
    string[]
  >([API_KEYS.CREATE_PROJECT], (data) => commonApi(API_KEYS.CREATE_PROJECT as any, { body: data }), {
    onSuccess: (data) => {
      setProfile((profileData) => ({
        ...profileData,
        _projectId: data._id,
      }));
      push('/');
    },
  });

  const onProjectFormSubmit = (data: ICreateProjectData) => {
    createProject(data);
  };

  return (
    <>
      <Image src={DarkLogo} alt="Impler Logo" />
      <Title order={2} color="white" mt="sm">
        Let&apos;s Create your first project
      </Title>
      <form onSubmit={handleSubmit(onProjectFormSubmit)} style={{ width: '100%' }}>
        <Stack spacing="sm" pt="sm">
          <Input placeholder="First Project" error={errors.name?.message} required register={register('name')} />
          <Button type="submit" fullWidth loading={isCreateProjectLoading}>
            Create
          </Button>
        </Stack>
      </form>
    </>
  );
}

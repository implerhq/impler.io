import { MODAL_KEYS } from '@config';
import { modals } from '@mantine/modals';
import { validateEmails } from '@shared/utils';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { commonApi } from '@libs/api';
import { API_KEYS } from '@config';
import { IErrorObject } from '@impler/shared';
import { useAppState } from 'store/app.context';

interface ProjectInvitationData {
  invitationEmailsTo: string[];
  role: string;
  projectName?: string;
  projectId?: string;
}

export function useProjectInvitationForm() {
  const { profileInfo } = useAppState();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectInvitationData>();

  const { mutate: projectInvitation, isLoading: isProjectInvitationLoading } = useMutation<
    { projectInvitationData: ProjectInvitationData },
    IErrorObject,
    ProjectInvitationData
  >(
    [API_KEYS.PROJECT_INVITATION],
    (apiData) =>
      commonApi(API_KEYS.PROJECT_INVITATION as any, {
        body: {
          ...apiData,
        },
      }),
    {
      onSuccess: () => {
        modals.close(MODAL_KEYS.INVITE_MEMBERS);
      },
      onError: (err) => {
        console.log(err);
      },
    }
  );

  const onSubmit = (data: ProjectInvitationData) => {
    const isValid = validateEmails(data.invitationEmailsTo);
    if (isValid) {
      projectInvitation({
        invitationEmailsTo: data.invitationEmailsTo,
        role: data.role,
        projectName: profileInfo?.projectName,
        projectId: profileInfo?._projectId,
      });
    }
  };

  return {
    control,
    handleSubmit,
    errors,
    onSubmit,
    isProjectInvitationLoading,
  };
}

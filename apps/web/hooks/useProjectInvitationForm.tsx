import { MODAL_KEYS } from '@config';
import { modals } from '@mantine/modals';
import { validateEmails } from '@shared/utils';
import { useMutation, useQuery } from '@tanstack/react-query';
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

interface UseProjectInvitationFormProps {
  refetchInvitations: () => void;
}

export function useProjectInvitationForm({ refetchInvitations }: UseProjectInvitationFormProps) {
  const { profileInfo } = useAppState();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
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
        refetchInvitations();
      },
      onError: (error: IErrorObject) => {
        setError('invitationEmailsTo', {
          type: 'manual',
          message: error.message,
        });
      },
    }
  );

  const onSubmit = (data: ProjectInvitationData) => {
    const emailValidationResult = validateEmails(data.invitationEmailsTo);

    if (!emailValidationResult) {
      setError('invitationEmailsTo', { type: 'manual', message: emailValidationResult });

      return;
    }

    clearErrors('invitationEmailsTo');

    projectInvitation({
      invitationEmailsTo: data.invitationEmailsTo,
      role: data.role,
      projectName: profileInfo?.projectName,
      projectId: profileInfo?._projectId,
    });
  };

  const {
    data: teamTeamMemberMeta,
    refetch: refetchTeamMemberMeta,
    isLoading: isTeamMemberMetaLoading,
  } = useQuery<unknown, IErrorObject, { available: number; total: number }, (string | undefined)[]>(
    [API_KEYS.TEAM_MEMBER_META, profileInfo?._projectId],
    () =>
      commonApi(API_KEYS.TEAM_MEMBER_META as any, {
        parameters: [profileInfo!._projectId],
      }),
    {
      enabled: !!profileInfo?._projectId,
    }
  );

  return {
    control,
    handleSubmit,
    errors,
    onSubmit,
    setError,
    clearErrors,
    isProjectInvitationLoading,
    isTeamMemberMetaLoading,
    teamTeamMemberMeta,
    refetchTeamMemberMeta,
  };
}

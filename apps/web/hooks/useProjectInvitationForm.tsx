import { MODAL_KEYS, NOTIFICATION_KEYS } from '@config';
import { modals } from '@mantine/modals';
import { validateEmails } from '@shared/utils';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { commonApi } from '@libs/api';
import { API_KEYS } from '@config';
import { IErrorObject } from '@impler/shared';
import { useAppState } from 'store/app.context';
import { notify } from '@libs/notify';

interface ProjectInvitationData {
  invitationEmailsTo: string[];
  role: string;
  projectName?: string;
  projectId?: string;
}

interface UseProjectInvitationFormProps {
  refetchInvitations: () => void;
}

const MAX_INVITATION_EMAILS = 4;

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
        notify(NOTIFICATION_KEYS.ERROR_INVITING_TEAM_MEMBER, {
          title: 'Error while Inviting Team Member',
          message: error.message || 'An Error Occurred While Inviting Team Member',
          color: 'red',
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

    if (data.invitationEmailsTo.length > MAX_INVITATION_EMAILS) {
      setError('invitationEmailsTo', {
        type: 'manual',
        message: `You can invite a maximum of ${MAX_INVITATION_EMAILS} email addresses.`,
      });

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

  return {
    control,
    handleSubmit,
    errors,
    onSubmit,
    isProjectInvitationLoading,
    MAX_INVITATION_EMAILS,
  };
}

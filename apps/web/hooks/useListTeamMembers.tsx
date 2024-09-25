import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { API_KEYS, NOTIFICATION_KEYS, MODAL_KEYS } from '@config';
import { IErrorObject } from '@impler/shared';
import { commonApi } from '@libs/api';
import { notify } from '@libs/notify';
import { useAppState } from 'store/app.context';
import { modals } from '@mantine/modals';
import { DeleteTeamMemberModal } from '@components/TeamMembers/DeleteTeamMemberModal';

interface UpdateRoleParams {
  projectId: string;
  userId: string;
  role: string;
}

export function useListTeamMembers() {
  const { profileInfo } = useAppState();
  const queryClient = useQueryClient();
  const [teamMembersList, setTeamMembersList] = useState<TeamMemberList[]>([]);

  const { isLoading: isMembersDataLoading } = useQuery<TeamMemberList[], IErrorObject>(
    [API_KEYS.LIST_TEAM_MEMBERS],
    () => commonApi(API_KEYS.LIST_TEAM_MEMBERS as any, {}),
    {
      onSuccess: (teamMember) => {
        const transformedData = teamMember.flatMap((member: any) =>
          member.apiKeys.map((apiKey: any) => ({
            _id: apiKey._userId._id,
            user: {
              name: `${apiKey._userId.firstName} ${apiKey._userId.lastName}`,
              email: apiKey._userId.email,
              profilePicture: apiKey._userId.profilePicture || null,
            },
            joinedDate: apiKey.joinedOn,
            role: apiKey.role,
            projectId: member._projectId,
            isCurrentUser: apiKey._userId.email === profileInfo?.email,
          }))
        );
        const sortedData = transformedData.sort((a, b) => b.isCurrentUser - a.isCurrentUser);
        setTeamMembersList(sortedData);
      },
      onError: (error: IErrorObject) => {
        notify(NOTIFICATION_KEYS.ERROR_LISTING_TEAM_MEMBERS, {
          title: 'Error Listing Team Members',
          message: error.message || 'An Error Occurred while listing Team Members',
          color: 'red',
        });
      },
    }
  );

  const { mutate: deleteTeamMember, isLoading: isTeamMemberDeleting } = useMutation<IProfileData, IErrorObject, string>(
    (teamMemberId) =>
      commonApi(API_KEYS.DELETE_TEAM_MEMBER as any, {
        parameters: [teamMemberId],
      }),
    {
      onSuccess: (_, teamMemberId) => {
        queryClient.setQueryData<TeamMemberList[]>(
          [API_KEYS.LIST_TEAM_MEMBERS],
          (oldData) => oldData?.filter((member) => member._id !== teamMemberId)
        );

        notify(NOTIFICATION_KEYS.TEAM_MEMBER_DELETED, {
          title: 'Team Member Deleted Successfully',
          message: 'Team Member Deleted Successfully',
          color: 'green',
        });
      },
      onError: (error: IErrorObject) => {
        notify(NOTIFICATION_KEYS.ERROR_DELETING_TEAM_MEMBER, {
          title: 'Error while Deleting Team Member',
          message: error.message || 'An Error Occurred While Deleting Team Member',
          color: 'red',
        });
      },
    }
  );

  const { mutate: updateTeamMemberRole, isLoading: isTeamMemberRoleUpdating } = useMutation<
    IProfileData,
    IErrorObject,
    UpdateRoleParams
  >(
    ({ projectId, userId, role }) =>
      commonApi(API_KEYS.UPDATE_TEAM_MEMBER_ROLE as any, {
        body: { projectId, userId, role },
      }),
    {
      onSuccess: (_, { userId, role }) => {
        queryClient.setQueryData<TeamMemberList[]>(
          [API_KEYS.LIST_TEAM_MEMBERS],
          (oldData) => oldData?.map((member) => (member._id === userId ? { ...member, role } : member)) || []
        );

        notify(NOTIFICATION_KEYS.TEAM_MEMBER_ROLE_UPDATED, {
          title: 'Role Updated',
          message: 'Team Member Role Updated Successfully',
          color: 'green',
        });
      },
      onError: (error: IErrorObject) => {
        notify(NOTIFICATION_KEYS.ERROR_CHANGING_MEMBER_ROLE, {
          title: 'Error while Changing Team Member Role',
          message: error.message || 'An Error Occurred While Changing Team Member Role',
          color: 'red',
        });
      },
    }
  );

  const openDeleteModal = (projectId: string, userId: string, userName: string) => {
    modals.open({
      title: 'Confirm Team Member Deletion',
      id: MODAL_KEYS.CONFIRM_DELETE_TEAM_MEMBER,
      children: (
        <DeleteTeamMemberModal
          projectId={projectId}
          userId={userId}
          userName={userName}
          onDeleteConfirm={() => {
            deleteTeamMember(projectId);
            modals.closeAll();
          }}
          onCancel={() => modals.closeAll()}
        />
      ),
    });
  };

  return {
    teamMembersList,
    isMembersDataLoading,
    teamMembersCount: teamMembersList.length || 0,
    openDeleteModal,
    isTeamMemberDeleting,
    updateTeamMemberRole,
    isTeamMemberRoleUpdating,
  };
}

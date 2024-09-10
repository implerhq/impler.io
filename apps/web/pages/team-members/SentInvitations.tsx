import { LoadingOverlay, Stack, Text } from '@mantine/core';
import { Table } from '@ui/table';
import { AppLayout } from '@layouts/AppLayout';
import { ExitIcon } from '@assets/icons/Exit.icon';
import { useSentProjectInvitations } from '@hooks/useSentProjectInvitations';

export function SentInvitations() {
  const { invitations, isInvitationsLoading, isInvitationsFetched, isError } = useSentProjectInvitations();

  return (
    <Stack spacing="xs">
      <Stack spacing="sm" style={{ position: 'relative' }}>
        <LoadingOverlay visible={isInvitationsLoading} />
        {isError && <Text color="red">Error fetching invitations</Text>}
        {!isInvitationsLoading && isInvitationsFetched && invitations && (
          <Table<SentProjectInvitation>
            headings={[
              {
                title: 'User',
                key: 'user',
                Cell: (invitation) => <Text>{invitation.invitationToEmail}</Text>,
              },
              {
                title: 'Invited On',
                key: 'invitedOn',
                Cell: (invitation) => <Text size="sm">{invitation.invitedOn || 'N/A'}</Text>,
              },
              {
                title: 'Role',
                key: 'role',
                Cell: (invitation) => <Text size="sm">{invitation.role}</Text>,
              },
              {
                title: 'Action',
                key: 'action',
                Cell: () => <ExitIcon size="xl" />,
              },
            ]}
            data={invitations || []}
          />
        )}
        {!isInvitationsLoading && !isError && !isInvitationsFetched && <Text>No data available</Text>}
      </Stack>
    </Stack>
  );
}

SentInvitations.Layout = AppLayout;

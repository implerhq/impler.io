import { LoadingOverlay, Stack, Text } from '@mantine/core';
import { Table } from '@ui/table';
import { AppLayout } from '@layouts/AppLayout';
import dayjs from 'dayjs';
import { useSentProjectInvitations } from '@hooks/useSentProjectInvitations';
import { SentInvitationActions } from './SentInvitationActions';
import { DATE_FORMATS } from '@config';
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
                Cell: (invitation) => (
                  <Text size="sm">{dayjs(invitation.invitedOn).format(DATE_FORMATS.LONG) || 'N/A'}</Text>
                ),
              },
              {
                title: 'Role',
                key: 'role',
                Cell: (invitation) => <Text size="sm">{invitation.role}</Text>,
              },
              {
                title: 'Actions',
                key: 'action',
                Cell: () => (
                  <>
                    <SentInvitationActions />
                  </>
                ),
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

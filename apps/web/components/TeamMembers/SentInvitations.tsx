import dayjs from 'dayjs';
import { LoadingOverlay, Stack, Text } from '@mantine/core';

import { Table } from '@ui/table';
import { DATE_FORMATS } from '@config';
import { AppLayout } from '@layouts/AppLayout';
import { SentInvitationActions } from './SentInvitationActions';
import { useSentProjectInvitations } from '@hooks/useSentProjectInvitations';

export function SentInvitations() {
  const { invitations, isInvitationsLoading } = useSentProjectInvitations();

  return (
    <Stack spacing="xs">
      <Stack spacing="sm" style={{ position: 'relative' }}>
        <LoadingOverlay visible={isInvitationsLoading} />
        {!isInvitationsLoading && invitations && (
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
                Cell: (item) => <SentInvitationActions invitationId={item._id} />,
              },
            ]}
            data={invitations || []}
          />
        )}
        {!isInvitationsLoading && invitations?.length === 0 && <Text>No data available</Text>}
      </Stack>
    </Stack>
  );
}

SentInvitations.Layout = AppLayout;

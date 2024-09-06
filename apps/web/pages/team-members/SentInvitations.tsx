import { Group, Stack, Text } from '@mantine/core';
import { Table } from '@ui/table';
import { AppLayout } from '@layouts/AppLayout';
import { ExitIcon } from '@assets/icons/Exit.icon';

interface SentInvitation {
  _id?: string;
  userName: string;
  invitedOn?: string;
  role: string;
}

const membersData: SentInvitation[] = [
  {
    userName: 'john@doe.com',
    invitedOn: '2023-01-01',
    role: 'Admin',
  },
  {
    userName: 'jane@doe.com',
    invitedOn: '2023-01-01',
    role: 'Admin',
  },
];

export function SentInvitations() {
  return (
    <Stack spacing="xs">
      <Stack spacing="sm">
        <Table<SentInvitation>
          headings={[
            {
              title: 'User',
              key: 'user',
              Cell: (member: SentInvitation) => (
                <Group spacing="sm">
                  <Text>{member.userName || 'No Name'}</Text>
                </Group>
              ),
            },
            {
              title: 'Invited',
              key: 'invitedOn',
              Cell: (member: SentInvitation) => <Text size="sm">{member.invitedOn || 'N/A'}</Text>,
            },
            {
              title: 'Role',
              key: 'role',
              Cell: (member: SentInvitation) => <Text size="sm">{member.role}</Text>,
            },
            {
              title: 'Action',
              key: 'action',
              Cell: () => <ExitIcon style={{ fontWeight: 'bolder' }} size="xl" />,
            },
          ]}
          data={membersData}
        />
      </Stack>
    </Stack>
  );
}

SentInvitations.Layout = AppLayout;

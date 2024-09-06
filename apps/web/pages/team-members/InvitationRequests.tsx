import { ActionIcon, Flex, Group, Stack, Text } from '@mantine/core';
import { Table } from '@ui/table';
import { AppLayout } from '@layouts/AppLayout';
import { ReactNode } from 'react';
import { CheckIcon } from '@assets/icons/Check.icon';
import { CloseIcon } from '@assets/icons/Close.icon';
import { colors } from '@config';

interface SentInvitation {
  _id?: string;
  projectName: string;
  invitedOn?: string;
  role: string;
  action?: ReactNode;
}

const membersData: SentInvitation[] = [
  {
    projectName: 'Artha',
    invitedOn: '2023-01-01',
    role: 'Admin',
  },
  {
    projectName: 'Omniva',
    role: 'Admin',
  },
  {
    projectName: 'Impiler',
    invitedOn: '2023-03-10',
    role: 'Tech',
  },
  {
    projectName: 'Digimatics',
    invitedOn: '2023-04-22',
    role: 'Finance',
  },
];

export function InvitationRequests() {
  return (
    <Stack spacing="xs">
      <Stack spacing="sm">
        <Table<SentInvitation>
          headings={[
            {
              title: 'Project Name',
              key: 'projectName',
              Cell: (member: SentInvitation) => (
                <Group spacing="sm">
                  <Text>{member.projectName || 'No Name'}</Text>
                </Group>
              ),
            },
            {
              title: 'Invited By',
              key: 'invitedOn',
              Cell: (member: SentInvitation) => <Text size="sm">{member.invitedOn || 'N/A'}</Text>,
            },
            {
              title: 'Inited On',
              key: 'role',
              Cell: (member: SentInvitation) => <Text size="sm">{member.role}</Text>,
            },
            {
              title: 'Action',
              key: 'action',
              Cell: () => (
                <Flex justify="start">
                  <ActionIcon color="green" type="submit">
                    <CheckIcon color={colors.green} />
                  </ActionIcon>
                  <ActionIcon color="red">
                    <CloseIcon color={colors.dangerDark} />
                  </ActionIcon>
                </Flex>
              ),
            },
          ]}
          data={membersData}
        />
      </Stack>
    </Stack>
  );
}

InvitationRequests.Layout = AppLayout;

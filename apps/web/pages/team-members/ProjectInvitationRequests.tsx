import { ActionIcon, Flex, Group, Stack, Text } from '@mantine/core';
import { Table } from '@ui/table';
import { AppLayout } from '@layouts/AppLayout';
import { CheckIcon } from '@assets/icons/Check.icon';
import { CloseIcon } from '@assets/icons/Close.icon';
import { colors } from '@config';

interface SentInvitation {
  _id?: string;
  projectName: string;
  invitedBy: string;
  invitedOn: string;
}

const membersData: SentInvitation[] = [
  {
    projectName: 'Artha',
    invitedBy: 'Jane Doe',
    invitedOn: '13-05-2024',
  },
];

export function ProjectInvitationRequests() {
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
              Cell: (member: SentInvitation) => <Text size="sm">{member.invitedBy || 'N/A'}</Text>,
            },
            {
              title: 'Inited On',
              key: 'invitedOn',
              Cell: (member: SentInvitation) => <Text size="sm">{member.invitedOn}</Text>,
            },
            {
              title: 'Action',
              key: 'action',
              Cell: () => (
                <Flex gap="xs" justify="start">
                  <ActionIcon color="green" type="submit">
                    <CheckIcon size="lg" color={colors.green} />
                  </ActionIcon>
                  <ActionIcon color="red">
                    <CloseIcon size="lg" color={colors.dangerDark} />
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

ProjectInvitationRequests.Layout = AppLayout;

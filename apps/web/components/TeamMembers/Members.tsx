import { Group, Stack, Avatar, Text, Select, Badge, UnstyledButton } from '@mantine/core';
import { Table } from '@ui/table';
import { AppLayout } from '@layouts/AppLayout';
import { DeleteIcon } from '@assets/icons/Delete.icon';
import dayjs from 'dayjs';
import { DATE_FORMATS, MEMBER_ROLE } from '@config';
import { useListTeamMembers } from '@hooks/useListTeamMembers';
import { UserRolesEnum } from '@impler/shared';

export function Members() {
  const { teamMembersList, openDeleteModal, updateTeamMemberRole } = useListTeamMembers();

  return (
    <Stack spacing="xs">
      <Stack spacing="sm">
        <Table<TeamMemberList>
          headings={[
            {
              title: 'User',
              key: 'user',
              Cell: (item) => (
                <Group spacing="sm">
                  <Avatar style={{ border: '1px solid white', borderRadius: 0 }} size="md" />
                  <div>
                    <Text>
                      {item.user.name}
                      {item.isCurrentUser && (
                        <Badge radius="lg" size="lg" p={5} color="gray">
                          You
                        </Badge>
                      )}
                    </Text>
                    <Text size="xs" color="dimmed">
                      {item.user.email}
                    </Text>
                  </div>
                </Group>
              ),
            },
            {
              title: 'Joined Date',
              key: 'joinedDate',
              Cell: (item) => dayjs(item.joinedDate).format(DATE_FORMATS.LONG),
            },
            {
              title: 'Role',
              key: 'role',
              Cell: (item) => (
                <Select
                  disabled={item.isCurrentUser && item.role === UserRolesEnum.ADMIN ? true : false}
                  data={MEMBER_ROLE}
                  value={item.role}
                  maw={150}
                  onChange={(role) => {
                    if (role)
                      updateTeamMemberRole({
                        role,
                        userId: item._id,
                        projectId: item.projectId,
                      });
                  }}
                />
              ),
            },
            {
              title: 'Actions',
              key: 'action',
              Cell: (item) => (
                <UnstyledButton
                  disabled={item.isCurrentUser ? true : false}
                  onClick={() => openDeleteModal(item.projectId, item._id, item.user.name)}
                >
                  <DeleteIcon color={item.isCurrentUser ? 'lightblue' : 'red'} />
                </UnstyledButton>
              ),
            },
          ]}
          data={teamMembersList || []}
        />
      </Stack>
    </Stack>
  );
}

Members.Layout = AppLayout;

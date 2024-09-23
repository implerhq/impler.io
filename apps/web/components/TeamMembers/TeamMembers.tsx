import { useApp } from '@hooks/useApp';
import { Group, Stack, Avatar, Text, Select, Badge, UnstyledButton } from '@mantine/core';
import { Table } from '@ui/table';
import { AppLayout } from '@layouts/AppLayout';
import { DeleteIcon } from '@assets/icons/Delete.icon';
import dayjs from 'dayjs';
import { ActionsEnum, DATE_FORMATS, MEMBER_ROLE, SubjectsEnum } from '@config';
import { useListTeamMembers } from '@hooks/useListTeamMembers';
import { defineAbilitiesFor } from 'config/defineAbilities';
import { UserRolesEnum } from '@impler/shared';

export function TeamMembers() {
  const { profile } = useApp();
  const ability = defineAbilitiesFor(profile?.role);
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
                  <Avatar
                    src={item.user.profilePicture || null}
                    style={{ border: '1px solid white', borderRadius: 0 }}
                    size="md"
                  />
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
              Cell: (item) =>
                ability.can(ActionsEnum.UPDATE, SubjectsEnum.ROLE) ? (
                  <Select
                    disabled={item.isCurrentUser ? true : false}
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
                ) : (
                  <Text>{item.role}</Text>
                ),
            },
            {
              title: 'Actions',
              key: 'action',
              Cell: (item) => {
                const isCurrentUserAdmin = profile?.role === UserRolesEnum.ADMIN;
                const isTargetUserAdmin = item.role === UserRolesEnum.ADMIN;

                return ability.can(ActionsEnum.UPDATE, SubjectsEnum.ROLE) &&
                  !item.isCurrentUser &&
                  (isCurrentUserAdmin || !isTargetUserAdmin) ? (
                  <UnstyledButton
                    disabled={isTargetUserAdmin && isCurrentUserAdmin}
                    onClick={() => openDeleteModal(item.projectId, item._id, item.user.name)}
                  >
                    <DeleteIcon color={'red'} />
                  </UnstyledButton>
                ) : null;
              },
            },
          ]}
          data={teamMembersList || []}
        />
      </Stack>
    </Stack>
  );
}

TeamMembers.Layout = AppLayout;

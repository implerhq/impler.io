import { useContext } from 'react';
import dayjs from 'dayjs';
import { Group, Avatar, Text, Select, Badge, UnstyledButton } from '@mantine/core';

import { Table } from '@ui/table';
import { useApp } from '@hooks/useApp';
import { UserRolesEnum } from '@impler/shared';
import { DeleteIcon } from '@assets/icons/Delete.icon';
import { useTeamMembers } from '@hooks/useTeamMembers';
import { ActionsEnum, AppAbility, DATE_FORMATS, MEMBER_ROLE, SubjectsEnum } from '@config';
import { AbilityContext } from 'store/ability.context';

export function TeamMembers() {
  const { profile } = useApp();
  const ability = useContext<AppAbility | null>(AbilityContext);
  const { teamMembersList, openDeleteModal, updateTeamMemberRole } = useTeamMembers();

  return (
    <Table<TeamMember>
      headings={[
        {
          title: 'User',
          key: 'user',
          Cell: (item) => (
            <Group spacing="sm">
              <Avatar
                src={item._userId?.profilePicture || null}
                style={{ border: '1px solid white', borderRadius: 0 }}
                size="md"
              />
              <div>
                <Text>
                  {item._userId?.firstName} {item._userId?.lastName}
                  {item._userId.email === profile?.email ? (
                    <Badge radius="lg" size="lg" p={5} color="gray">
                      You
                    </Badge>
                  ) : null}
                </Text>
                <Text size="xs" color="dimmed">
                  {item._userId?.email}
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
            ability && ability.can(ActionsEnum.UPDATE, SubjectsEnum.ROLE) ? (
              <Select
                disabled={item.isCurrentUser ? true : false}
                data={MEMBER_ROLE}
                value={item.role}
                maw={150}
                onChange={(role) => {
                  if (role)
                    updateTeamMemberRole({
                      role,
                      memberId: item._id,
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

            return ability &&
              ability.can(ActionsEnum.UPDATE, SubjectsEnum.ROLE) &&
              (isCurrentUserAdmin || !isTargetUserAdmin) ? (
              <UnstyledButton
                disabled={isTargetUserAdmin && isCurrentUserAdmin}
                onClick={() => openDeleteModal(item._id, item._userId.firstName)}
              >
                <DeleteIcon color={'red'} />
              </UnstyledButton>
            ) : null;
          },
        },
      ]}
      data={teamMembersList || []}
    />
  );
}

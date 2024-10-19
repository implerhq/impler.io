import React from 'react';
import { Flex, Text, Stack, TextInput } from '@mantine/core';

import { Badge } from '@ui/badge';
import { Button } from '@ui/button';
import { List } from '@components/List';
import { colors, ROLE_BADGES } from '@config';
import { IconButton } from '@ui/icon-button';
import { useProject } from '@hooks/useProject';
import { SwapIcon } from '@assets/icons/Swap.icon';
import { DeleteIcon } from '@assets/icons/Delete.icon';
import { InformationIcon } from '@assets/icons/Information.icon';
import { IProjectPayload, UserRolesEnum } from '@impler/shared';

export function ManageProjectModal() {
  const {
    errors,
    onSubmit,
    projects,
    register,
    handleSubmit,
    currentProjectId,
    onProjectIdChange,
    handleDeleteProject,
    isCreateProjectLoading,
  } = useProject();

  return (
    <Stack spacing="xs">
      <List<IProjectPayload>
        headings={[
          {
            title: 'Project Name',
            key: 'name',
            width: '60%',
            Cell: (item) => (
              <Flex>
                {item.name}
                {item.isOwner && (
                  <Badge variant="filled" color={colors.darkBlue} ml="xs">
                    Owner
                  </Badge>
                )}
              </Flex>
            ),
          },
          {
            title: 'Role',
            key: 'role',
            width: '10%',
            Cell: (item) => (
              <Badge size="sm" variant="filled" color={ROLE_BADGES[item.role as UserRolesEnum]}>
                {item.role}
              </Badge>
            ),
          },
          {
            key: '',
            width: '5%',
            title: 'Actions',
            Cell: (item) => (
              <Flex justify="flex-end" gap="xs">
                <IconButton
                  label="Switch Project"
                  disabled={item._id === currentProjectId}
                  onClick={() => {
                    onProjectIdChange(item._id as string);
                  }}
                >
                  <SwapIcon size="md" />
                </IconButton>
                <IconButton
                  label="Delete Project"
                  disabled={!item.isOwner}
                  onClick={() => {
                    handleDeleteProject(item._id as string);
                  }}
                >
                  <DeleteIcon size="md" />
                </IconButton>
              </Flex>
            ),
          },
        ]}
        data={projects || []}
        selectedItemId={currentProjectId}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing="xs">
          <Flex gap="sm" justify="space-between">
            <TextInput
              style={{ width: '90%' }}
              placeholder="Enter Project Name"
              {...register('name', { required: 'Project name is required' })}
              error={errors.name?.message}
            />
            <Button type="submit" loading={isCreateProjectLoading}>
              Create
            </Button>
          </Flex>
          <Flex gap="xs">
            <InformationIcon size="md" color={colors.yellow} />
            <Text>You will be switched to the project once created.</Text>
          </Flex>
        </Stack>
      </form>
    </Stack>
  );
}

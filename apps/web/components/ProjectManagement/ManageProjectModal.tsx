import React from 'react';
import { Badge, Flex, Text, UnstyledButton, Stack, TextInput } from '@mantine/core';
import { colors, ROLE_BADGES } from '@config';
import { Button } from '@ui/button';
import { SwapIcon } from '@assets/icons/Swap.icon';
import { DeleteIcon } from '@assets/icons/Delete.icon';
import { InformationIcon } from '@assets/icons/Information.icon';
import { List } from '@components/List';
import { IProjectPayload, UserRolesEnum } from '@impler/shared';
import { useProject } from '@hooks/useProject';

export function ManageProjectModal() {
  const {
    handleSubmit,
    register,
    errors,
    onSubmit,
    projects,
    currentProjectId,
    handleDeleteProject,
    onProjectIdChange,
    isCreateProjectLoading,
  } = useProject();

  return (
    <>
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
                  <Badge size="sm" variant="filled" color={colors.darkBlue} ml="xs">
                    Owner
                  </Badge>
                )}
              </Flex>
            ),
          },
          {
            title: 'Role',
            key: 'role',
            width: '20%',
            Cell: (item) => (
              <Badge size="sm" variant="filled" color={ROLE_BADGES[item.role as UserRolesEnum]}>
                {item.role}
              </Badge>
            ),
          },
          {
            title: 'Switch',
            key: 'switch',
            width: '10%',
            Cell: (item) => (
              <UnstyledButton
                onClick={() => {
                  onProjectIdChange(item._id as string);
                }}
              >
                {item._id !== currentProjectId && <SwapIcon size="md" />}
              </UnstyledButton>
            ),
          },
          {
            title: 'Delete',
            key: 'delete',
            width: '10%',
            Cell: (item) =>
              item.isOwner ? (
                <UnstyledButton
                  onClick={() => {
                    handleDeleteProject(item._id as string);
                  }}
                >
                  <DeleteIcon size="md" />
                </UnstyledButton>
              ) : null,
          },
        ]}
        data={projects || []}
        selectedItemId={currentProjectId}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack>
          <Flex mt="sm" gap="sm" justify="space-between">
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
    </>
  );
}

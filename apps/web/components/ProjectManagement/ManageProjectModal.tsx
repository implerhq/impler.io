import React from 'react';
import { Badge, Flex, Text, UnstyledButton, Stack, TextInput } from '@mantine/core';
import { colors } from '@config';
import { Button } from '@ui/button';
import { SwapIcon } from '@assets/icons/Swap.icon';
import { DeleteIcon } from '@assets/icons/Delete.icon';
import { InformationIcon } from '@assets/icons/Information.icon';
import { useProjectManagement } from '@hooks/useProjectManagement';
import { List } from '@components/List';
import { useApp } from '@hooks/useApp';

export function ManageProjectModal() {
  const { profile } = useApp();

  const {
    handleSubmit,
    register,
    errors,
    onSubmit,
    isProjectsLoading,
    projects,
    currentProjectId,
    handleDeleteProject,
    handleSwitchProject,
  } = useProjectManagement();

  return (
    <>
      <List
        headings={[
          {
            title: 'Project Name',
            key: 'name',
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
            Cell: () => <>{profile?.role}</>,
          },
          {
            title: 'Switch',
            key: 'switch',
            Cell: (item) => (
              <UnstyledButton onClick={() => handleSwitchProject(item._id)}>
                {item._id !== currentProjectId && <SwapIcon size="md" />}
              </UnstyledButton>
            ),
          },
          {
            title: 'Delete',
            key: 'delete',
            Cell: (item) => {
              return item.isOwner ? (
                <UnstyledButton onClick={() => handleDeleteProject(item._id)}>
                  <DeleteIcon size="md" />
                </UnstyledButton>
              ) : null;
            },
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
            <Button type="submit" loading={isProjectsLoading}>
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

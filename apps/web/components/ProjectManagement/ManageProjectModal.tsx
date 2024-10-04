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
import { IProjectPayload } from '@impler/shared';

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
    deleteProject,
    switchProject,
  } = useProjectManagement();

  return (
    <>
      <List<IProjectPayload>
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
              <UnstyledButton onClick={() => switchProject(item._id as string)}>
                {item._id !== currentProjectId && <SwapIcon size="md" />}
              </UnstyledButton>
            ),
          },
          {
            title: 'Delete',
            key: 'delete',
            Cell: (item) => {
              return item.isOwner ? (
                <UnstyledButton onClick={() => deleteProject(item._id as string)}>
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

import { CheckIcon } from '@assets/icons/Check.icon';
import { DeleteIcon } from '@assets/icons/Delete.icon';
import { EditIcon } from '@assets/icons/Edit.icon';
import { colors } from '@config';
import { useSchema } from '@hooks/useSchema';
import { Flex, UnstyledButton } from '@mantine/core';
import { Button } from '@ui/button';
import { Table } from '@ui/table';

export function Schema() {
  const { onAddColumnClick } = useSchema();

  return (
    <Flex gap="sm" direction="column">
      <Flex justify="flex-end">
        <Button onClick={onAddColumnClick}>Add Column</Button>
      </Flex>
      <Table
        headings={[
          {
            title: 'Name',
            key: 'name',
            width: '25%',
          },
          {
            title: 'Type',
            key: 'type',
            width: '25%',
          },
          {
            title: 'Is required?',
            key: 'isRequired',
            width: '10%',
            Cell: (item) => item.isRequired && <CheckIcon color={colors.success} />,
          },
          {
            title: 'Is unique?',
            key: 'isUnique',
            width: '10%',
            Cell: (item) => item.isUnique && <CheckIcon color={colors.success} />,
          },
          {
            title: '',
            key: 'actions',
            Cell: () => (
              <Flex justify="flex-end" gap="xs">
                <UnstyledButton>
                  <EditIcon color={colors.blue} />
                </UnstyledButton>
                <UnstyledButton>
                  <DeleteIcon color={colors.danger} />
                </UnstyledButton>
              </Flex>
            ),
          },
        ]}
        data={[
          {
            name: 'Name',
            type: 'String',
            isRequired: true,
            isUnique: false,
          },
          {
            name: 'Name',
            type: 'String',
            isRequired: true,
            isUnique: false,
          },
        ]}
      />
    </Flex>
  );
}

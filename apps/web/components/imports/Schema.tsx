import { CheckIcon } from '@assets/icons/Check.icon';
import { DeleteIcon } from '@assets/icons/Delete.icon';
import { EditIcon } from '@assets/icons/Edit.icon';
import { colors } from '@config';
import { useSchema } from '@hooks/useSchema';
import { IColumn } from '@impler/shared';
import { Flex, UnstyledButton } from '@mantine/core';
import { Button } from '@ui/button';
import { Table } from '@ui/table';

interface SchemaProps {
  templateId: string;
}

export function Schema({ templateId }: SchemaProps) {
  const { onAddColumnClick, onEditColumnClick, columns } = useSchema({ templateId });

  return (
    <Flex gap="sm" direction="column">
      <Flex justify="flex-end">
        <Button onClick={onAddColumnClick}>Add Column</Button>
      </Flex>
      <Table<IColumn>
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
            Cell: (item) => (
              <Flex justify="flex-end" gap="xs">
                <UnstyledButton onClick={() => onEditColumnClick(item._id)}>
                  <EditIcon color={colors.blue} />
                </UnstyledButton>
                <UnstyledButton>
                  <DeleteIcon color={colors.danger} />
                </UnstyledButton>
              </Flex>
            ),
          },
        ]}
        data={columns}
      />
    </Flex>
  );
}

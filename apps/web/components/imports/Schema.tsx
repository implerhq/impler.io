import { Flex } from '@mantine/core';

import { colors } from '@config';
import { Table } from '@ui/table';
import { Button } from '@ui/button';
import { IColumn } from '@impler/shared';
import { useSchema } from '@hooks/useSchema';
import { IconButton } from '@ui/icon-button';

import { EditIcon } from '@assets/icons/Edit.icon';
import { CheckIcon } from '@assets/icons/Check.icon';
import { DeleteIcon } from '@assets/icons/Delete.icon';

interface SchemaProps {
  templateId: string;
}

export function Schema({ templateId }: SchemaProps) {
  const { onAddColumnClick, onEditColumnClick, onDeleteColumnClick, columns } = useSchema({ templateId });

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
                <IconButton label="Edit" onClick={() => onEditColumnClick(item._id)}>
                  <EditIcon color={colors.blue} />
                </IconButton>
                <IconButton label="Delete" onClick={() => onDeleteColumnClick(item._id)}>
                  <DeleteIcon color={colors.danger} />
                </IconButton>
              </Flex>
            ),
          },
        ]}
        data={columns}
      />
    </Flex>
  );
}

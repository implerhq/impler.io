import { useState } from 'react';
import { ActionIcon, Checkbox, Flex, Input, Select } from '@mantine/core';

import { colors } from '@config';
import { Table } from '@ui/table';
import { IColumn } from '@impler/shared';
import { useSchema } from '@hooks/useSchema';
import { IconButton } from '@ui/icon-button';

import { AddIcon } from '@assets/icons/Add.icon';
import { EditIcon } from '@assets/icons/Edit.icon';
import { CloseIcon } from '@assets/icons/Close.icon';
import { CheckIcon } from '@assets/icons/Check.icon';
import { DeleteIcon } from '@assets/icons/Delete.icon';
import { COLUMN_TYPES } from '@shared/constants';
import { Controller } from 'react-hook-form';
import { BracesIcon } from '@assets/icons/Braces.icon';

interface SchemaProps {
  templateId: string;
}

export function Schema({ templateId }: SchemaProps) {
  const [showAddRow, setShowAddRow] = useState(false);
  const { register, onEditColumnClick, onDeleteColumnClick, columns, control, handleSubmit, isColumnCreateLoading } =
    useSchema({
      templateId,
    });

  return (
    <Flex gap="sm" direction="column">
      <Flex justify="flex-end">
        <ActionIcon title="Edit JSON" variant="light">
          <BracesIcon size="md" color={colors.yellow} />
        </ActionIcon>
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
        extraContent={
          <tr>
            {showAddRow ? (
              <>
                <td>
                  <Flex gap="xs">
                    <Input autoFocus variant="default" placeholder="Column Name" {...register('name')} />
                    <Input placeholder="Column Key" {...register('key')} />
                  </Flex>
                </td>
                <td>
                  <Controller
                    control={control}
                    name="type"
                    render={({ field }) => (
                      <Select data={COLUMN_TYPES} placeholder="Select Type" variant="default" {...field} />
                    )}
                  />
                </td>
                <td>
                  <Checkbox title="Is Required?" {...register('isRequired')} />
                </td>
                <td>
                  <Checkbox title="Is Unique?" {...register('isUnique')} />
                </td>
                <td>
                  <Flex gap="xs" justify="flex-end">
                    <ActionIcon color="blue" onClick={handleSubmit} loading={isColumnCreateLoading}>
                      <CheckIcon color={colors.blue} />
                    </ActionIcon>
                    <ActionIcon color="red" onClick={() => setShowAddRow(false)}>
                      <CloseIcon />
                    </ActionIcon>
                  </Flex>
                </td>
              </>
            ) : (
              <td colSpan={5}>
                <ActionIcon variant="light" onClick={() => setShowAddRow(true)}>
                  <AddIcon color={colors.yellow} />
                </ActionIcon>
              </td>
            )}
          </tr>
        }
        data={columns}
      />
    </Flex>
  );
}

import { useRef } from 'react';
import { Controller } from 'react-hook-form';
import { ActionIcon, Flex, Tooltip, TextInput as Input, Group, Badge } from '@mantine/core';

import { useSchema } from '@hooks/useSchema';
import { colors, COLUMN_TYPES } from '@config';
import { ColumnTypesEnum, IColumn } from '@impler/shared';

import { Button } from '@ui/button';
import { DraggableTable } from '@ui/table';
import { IconButton } from '@ui/icon-button';
import { NativeSelect } from '@ui/native-select';

import { AddIcon } from '@assets/icons/Add.icon';
import { EditIcon } from '@assets/icons/Edit.icon';
import { GripIcon } from '@assets/icons/Grip.icon';
import { CloseIcon } from '@assets/icons/Close.icon';
import { CheckIcon } from '@assets/icons/Check.icon';
import { DeleteIcon } from '@assets/icons/Delete.icon';

interface ColumnsTableProps {
  templateId: string;
}

export function ColumnsTable({ templateId }: ColumnsTableProps) {
  const SelectRef = useRef(false);

  const {
    columns,
    control,
    register,
    getValues,
    showAddRow,
    handleSubmit,
    onMoveColumns,
    setShowAddRow,
    onEditColumnClick,
    onValidationsClick,
    onDeleteColumnClick,
    isColumnCreateLoading,
  } = useSchema({
    templateId,
  });

  const onValidationsButtonClick = () => {
    const values = getValues();
    onValidationsClick({ ...values, key: values.key || values.name });
  };

  return (
    <form
      onSubmit={(e) => {
        handleSubmit();
        e.preventDefault();
        SelectRef.current = false;
      }}
      id="columns"
    >
      <DraggableTable<IColumn>
        emptyDataText='No columns found click on "+" to add new column'
        headings={[
          {
            title: 'Name',
            key: 'name',
            width: '35%',
          },
          {
            title: 'Type',
            key: 'type',
            width: '15%',
          },
          {
            title: 'Frozen?',
            key: 'isFrozen',
            width: '10%',
            Cell: (item) => item.isFrozen && <CheckIcon color={colors.success} />,
          },
          {
            title: 'Validations',
            key: 'validations',
            width: '30%',
            Cell: (item) => (
              <Group spacing="xs">
                {item.isRequired && <Badge variant="outline">Required</Badge>}
                {item.type !== ColumnTypesEnum.SELECT && item.isUnique && (
                  <Badge color="cyan" variant="outline">
                    Unique
                  </Badge>
                )}
                {item.type === ColumnTypesEnum.SELECT && item.allowMultiSelect && (
                  <Badge color="green" variant="outline">
                    Multi Select
                  </Badge>
                )}
              </Group>
            ),
          },
          {
            title: 'Actions',
            key: 'actions',
            Cell: (item) => (
              <Flex gap="xs">
                <IconButton label="Edit" onClick={() => onEditColumnClick(item._id)}>
                  <EditIcon color={colors.blue} />
                </IconButton>
                <IconButton label="Delete" onClick={() => onDeleteColumnClick(item._id)}>
                  <DeleteIcon color={colors.danger} />
                </IconButton>
                <GripIcon color={colors.yellow} style={{ cursor: 'grab' }} />
              </Flex>
            ),
            width: '15%',
          },
        ]}
        extraContent={
          <tr>
            {showAddRow ? (
              <>
                <td colSpan={4} style={{ borderRight: 'none' }}>
                  <Flex gap="xs" align={'center'}>
                    <Input autoFocus required placeholder="Column Name" {...register('name')} />
                    <Controller
                      control={control}
                      name="type"
                      render={({ field }) => (
                        <NativeSelect
                          data={COLUMN_TYPES}
                          placeholder="Select Type"
                          variant="default"
                          register={field}
                          autoFocus={SelectRef.current}
                          onFocus={() => (SelectRef.current = true)}
                        />
                      )}
                    />
                    <Button size="xs" color="green" onClick={onValidationsButtonClick}>
                      Validations
                    </Button>
                  </Flex>
                </td>
                <td style={{ borderLeft: 'none' }}>
                  <Flex justify={'end'}>
                    <ActionIcon color="blue" type="submit" loading={isColumnCreateLoading}>
                      <CheckIcon color={colors.blue} />
                    </ActionIcon>
                    <ActionIcon color="red" onClick={() => setShowAddRow(false)}>
                      <CloseIcon />
                    </ActionIcon>
                  </Flex>
                </td>
              </>
            ) : (
              <td colSpan={6}>
                <Tooltip label="Add new column" withArrow position="top-start">
                  <ActionIcon
                    id="add-column"
                    bg={colors.yellow}
                    variant="transparent"
                    onClick={() => setShowAddRow(true)}
                  >
                    <AddIcon color={colors.white} />
                  </ActionIcon>
                </Tooltip>
              </td>
            )}
          </tr>
        }
        data={columns}
        moveItem={onMoveColumns}
      />
    </form>
  );
}

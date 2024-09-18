import { useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';
import {
  ActionIcon,
  Flex,
  Tooltip,
  TextInput as Input,
  Group,
  SelectItem,
  Text,
  useMantineTheme,
  LoadingOverlay,
} from '@mantine/core';

import { colors as appColors } from '@config';
import { useSchema } from '@hooks/useSchema';
import { IColumn } from '@impler/shared';

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
import { ValidationsGroup } from './ValidationsGroup';

interface ColumnsTableProps {
  templateId: string;
}

export function ColumnsTable({ templateId }: ColumnsTableProps) {
  const { colors: themeColors } = useMantineTheme();
  const { getColumnTypes } = useSchema({ templateId });
  const [columnTypes, setColumnType] = useState<SelectItem[]>(getColumnTypes());

  const {
    columns,
    control,
    register,
    getValues,
    showAddRow,
    onMoveColumns,
    validationRef,
    setShowAddRow,
    onCancelAddColumn,
    onEditColumnClick,
    onAddColumnSubmit,
    onValidationsClick,
    onDeleteColumnClick,
    isColumnCreateLoading,
  } = useSchema({
    templateId,
  });

  const onValidationsButtonClick = () => {
    validationRef.current = true;
    const values = getValues();
    onValidationsClick({ ...values, key: values.key || values.name });
  };

  useEffect(() => {
    setColumnType(getColumnTypes());
  }, []);

  return (
    <form id="columns" onSubmit={onAddColumnSubmit}>
      <DraggableTable<IColumn>
        emptyDataText='No columns found click on "+" to add a new column'
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
            Cell: (item) => item.isFrozen && <CheckIcon color={appColors.success} />,
          },
          {
            title: 'Validations',
            key: 'validations',
            width: '30%',
            Cell: (item) => <ValidationsGroup item={item} />,
          },
          {
            title: 'Actions',
            key: 'actions',
            Cell: (item) => (
              <Flex gap="xs">
                <IconButton label="Edit" onClick={() => onEditColumnClick(item._id)}>
                  <EditIcon color={appColors.blue} />
                </IconButton>
                <IconButton label="Delete" onClick={() => onDeleteColumnClick(item._id)}>
                  <DeleteIcon color={appColors.danger} />
                </IconButton>
                <GripIcon color={appColors.yellow} style={{ cursor: 'grab' }} />
              </Flex>
            ),
            width: '15%',
          },
        ]}
        extraContent={
          <tr>
            {showAddRow ? (
              <>
                <td colSpan={5} style={{ borderRight: 'none', position: 'relative' }}>
                  <LoadingOverlay visible={isColumnCreateLoading} />
                  <Flex gap="xs" align={'center'} justify="space-between">
                    <Group>
                      <Input autoFocus required placeholder="Column Name" {...register('name')} />
                      <Controller
                        control={control}
                        name="type"
                        render={({ field }) => (
                          <NativeSelect
                            data={columnTypes}
                            placeholder="Select Type"
                            variant="default"
                            register={field}
                          />
                        )}
                      />
                      <Button color="blue" onClick={onValidationsButtonClick}>
                        Validations
                      </Button>
                    </Group>

                    <ActionIcon
                      radius={0}
                      id="add-column"
                      bg={appColors.danger}
                      variant="transparent"
                      onClick={onCancelAddColumn}
                    >
                      <CloseIcon color={appColors.white} />
                    </ActionIcon>
                  </Flex>
                  <Text size="xs" mt="xs" color={themeColors.gray[6]}>
                    * Press{' '}
                    <Text size="sm" span>
                      ENTER
                    </Text>{' '}
                    to save,{' '}
                    <Text size="sm" span>
                      ESC
                    </Text>{' '}
                    to cancel or click on{' '}
                    <Text size="sm" span>
                      VALIDATIONS
                    </Text>{' '}
                    to configure column behavior
                  </Text>
                </td>
              </>
            ) : (
              <td colSpan={6}>
                <Tooltip label="Add new column" withArrow position="top-start">
                  <ActionIcon
                    radius={0}
                    id="add-column"
                    bg={appColors.yellow}
                    variant="transparent"
                    onClick={() => setShowAddRow(true)}
                  >
                    <AddIcon color={appColors.white} />
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

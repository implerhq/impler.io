import { Controller } from 'react-hook-form';
import {
  Flex,
  Text,
  Group,
  Tooltip,
  ActionIcon,
  LoadingOverlay,
  useMantineTheme,
  TextInput as Input,
} from '@mantine/core';

import { IColumn } from '@impler/shared';
import { useSchema } from '@hooks/useSchema';
import { colors as appColors } from '@config';

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
import { useSubscriptionMetaDataInformation } from '@hooks/useSubscriptionMetaDataInformation';

import { ValidationsGroup } from './ValidationsGroup';
interface ColumnsTableProps {
  templateId: string;
}

export function ColumnsTable({ templateId }: ColumnsTableProps) {
  const { columnTypes } = useSubscriptionMetaDataInformation();
  const { colors: themeColors } = useMantineTheme();
  const {
    columns,
    control,
    register,
    showAddRow,
    onMoveColumns,
    setShowAddRow,
    onCancelAddColumn,
    onEditColumnClick,
    onOpenAddColumnModal,
    onDeleteColumnClick,
    isColumnCreateLoading,
  } = useSchema({
    templateId,
  });

  return (
    <form
      id="columns"
      onSubmit={(event) => {
        event.preventDefault();
        onOpenAddColumnModal();
      }}
    >
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
                      <Button color="blue" onClick={onOpenAddColumnModal}>
                        Add Column
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
                    or click{' '}
                    <Text size="sm" span>
                      ADD COLUMN
                    </Text>{' '}
                    to configure validations and save, or{' '}
                    <Text size="sm" span>
                      ESC
                    </Text>{' '}
                    to cancel
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

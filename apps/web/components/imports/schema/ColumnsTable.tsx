import { useState } from 'react';
import { Controller } from 'react-hook-form';
import { ActionIcon, Checkbox, Flex, Input, Select, Tooltip } from '@mantine/core';

import { colors } from '@config';
import { Table } from '@ui/table';
import { IColumn } from '@impler/shared';
import { useSchema } from '@hooks/useSchema';
import { IconButton } from '@ui/icon-button';

import { COLUMN_TYPES } from '@shared/constants';
import { AddIcon } from '@assets/icons/Add.icon';
import { EditIcon } from '@assets/icons/Edit.icon';
import { CloseIcon } from '@assets/icons/Close.icon';
import { CheckIcon } from '@assets/icons/Check.icon';
import { DeleteIcon } from '@assets/icons/Delete.icon';
import { MultiSelect } from '@ui/multi-select';

interface ColumnsTableProps {
  templateId: string;
}

export function ColumnsTable({ templateId }: ColumnsTableProps) {
  const [showAddRow, setShowAddRow] = useState(false);
  const {
    register,
    watch,
    columns,
    control,
    handleSubmit,
    onEditColumnClick,
    onDeleteColumnClick,
    isColumnCreateLoading,
    formState: { errors },
  } = useSchema({
    templateId,
  });
  const typeValue = watch('type');

  return (
    <form onSubmit={handleSubmit}>
      <Table<IColumn>
        emptyDataText='No columns found click on "+" to add new column'
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
          <tr style={{ borderTop: '0.0625rem solid #373A40' }}>
            {showAddRow ? (
              <>
                <Flex gap="xs" align={'center'} m={'sm'} style={{ width: '60vw' }}>
                  <Input autoFocus required placeholder="Column Name" {...register('name')} />
                  <Input required placeholder="Column Key" {...register('key')} />
                  <Controller
                    control={control}
                    name="type"
                    render={({ field }) => {
                      return (
                        <>
                          <Select data={COLUMN_TYPES} placeholder="Select Type" variant="default" {...field} />
                          {typeValue === 'Regex' && (
                            <>
                              <Input
                                placeholder="Regular expression"
                                {...register('regex')}
                                required
                                error={errors.regex?.message}
                              />
                            </>
                          )}
                          {typeValue === 'Select' ? (
                            <Controller
                              name="selectValues"
                              control={control}
                              render={({ field: { value, onChange } }) => (
                                <MultiSelect
                                  placeholder="Select Values"
                                  creatable
                                  clearable
                                  searchable
                                  getCreateLabel={(query) => `+ Add ${query}`}
                                  data={Array.isArray(value) ? value : []}
                                  value={value}
                                  onCreate={(newItem) => {
                                    onChange([...(Array.isArray(value) ? value : []), newItem]);

                                    return newItem;
                                  }}
                                  onChange={onChange}
                                />
                              )}
                            />
                          ) : null}
                          {typeValue === 'Date' ? (
                            <Controller
                              name="dateFormats"
                              control={control}
                              render={({ field: { value, onChange } }) => (
                                <MultiSelect
                                  creatable
                                  clearable
                                  searchable
                                  value={value}
                                  placeholder="Valid Date Formats, i.e. DD/MM/YYYY, DD/MM/YY"
                                  data={[
                                    'DD/MM/YYYY',
                                    'DD/MM/YY',
                                    'MM/DD/YYYY',
                                    'MM/DD/YY',
                                    ...(Array.isArray(value) ? value : []),
                                  ]}
                                  getCreateLabel={(query) => `Add "${query}"`}
                                  onCreate={(newItem) => {
                                    onChange([...(Array.isArray(value) ? value : []), newItem]);

                                    return newItem;
                                  }}
                                  onChange={onChange}
                                />
                              )}
                            />
                          ) : null}
                        </>
                      );
                    }}
                  />

                  <label htmlFor="isRequired">
                    <Flex gap={'xs'}>
                      isRequired
                      <Checkbox title="Is Required?" {...register('isRequired')} id="isRequired" />
                    </Flex>
                  </label>
                  <label htmlFor="isUnique">
                    <Flex gap={'xs'}>
                      isUnique
                      <Checkbox title="Is Unique?" {...register('isUnique')} id="isUnique" />
                    </Flex>
                  </label>

                  <ActionIcon color="blue" type="submit" loading={isColumnCreateLoading}>
                    <CheckIcon color={colors.blue} />
                  </ActionIcon>
                  <ActionIcon color="red" onClick={() => setShowAddRow(false)}>
                    <CloseIcon />
                  </ActionIcon>
                </Flex>
                {/* <Flex gap="xs"></Flex> */}
              </>
            ) : (
              <td colSpan={5}>
                <Tooltip label="Add new column" withArrow position="top-start">
                  <ActionIcon bg={colors.yellow} variant="transparent" onClick={() => setShowAddRow(true)}>
                    <AddIcon color={colors.white} />
                  </ActionIcon>
                </Tooltip>
              </td>
            )}
          </tr>
        }
        data={columns}
      />
    </form>
  );
}

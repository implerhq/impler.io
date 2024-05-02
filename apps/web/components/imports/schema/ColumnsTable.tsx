import { useRef } from 'react';
import { Controller } from 'react-hook-form';
import { ActionIcon, Checkbox, Flex, Tooltip, TextInput as Input } from '@mantine/core';

import { colors } from '@config';
import { DraggableTable } from '@ui/table';
import { useSchema } from '@hooks/useSchema';
import { COLUMN_TYPES } from '@shared/constants';
import { DEFAULT_VALUES, IColumn } from '@impler/shared';

import { Select } from '@ui/select';
import { IconButton } from '@ui/icon-button';
import { MultiSelect } from '@ui/multi-select';
import { CustomSelect } from '@ui/custom-select';

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
    register,
    watch,
    columns,
    control,
    showAddRow,
    handleSubmit,
    onMoveColumns,
    setShowAddRow,
    onEditColumnClick,
    onDeleteColumnClick,
    isColumnCreateLoading,
    formState: { errors },
  } = useSchema({
    templateId,
  });

  const typeValue = watch('type');

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
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
            width: '50%',
          },
          {
            title: 'Type',
            key: 'type',
            width: '15%',
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
                    <Input required placeholder="Column Key" {...register('key')} />
                    <Controller
                      control={control}
                      name="type"
                      render={({ field }) => (
                        <Select
                          data={COLUMN_TYPES}
                          placeholder="Select Type"
                          variant="default"
                          register={field}
                          autoFocus={SelectRef.current}
                          onFocus={() => (SelectRef.current = true)}
                        />
                      )}
                    />
                    {typeValue === 'Regex' && (
                      <Input
                        required
                        error={errors.regex?.message}
                        placeholder="Regular expression"
                        {...register('regex')}
                      />
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
                    <Controller
                      name="defaultValue"
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <CustomSelect
                          value={value}
                          onChange={onChange}
                          placeholder="Default Value"
                          data={DEFAULT_VALUES}
                        />
                      )}
                    />
                    <Checkbox label="Required?" title="Required?" {...register('isRequired')} id="isRequired" />
                    <Checkbox label="Unique?" title="Unique?" {...register('isUnique')} id="isUnique" />
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
              <td colSpan={5}>
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

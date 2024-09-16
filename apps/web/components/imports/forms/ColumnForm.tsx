import { useEffect, useState } from 'react';
import { modals } from '@mantine/modals';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import {
  Stack,
  TextInput as Input,
  Text,
  Divider,
  SimpleGrid,
  Title,
  Group,
  Select,
  SelectItem,
  CloseButton,
  useMantineColorScheme,
} from '@mantine/core';

import { ColumnTypesEnum, DEFAULT_VALUES, IColumn, ValidatorTypesEnum } from '@impler/shared';
import { colors, DELIMITERS, MODAL_KEYS, MODAL_TITLES, DOCUMENTATION_REFERENCE_LINKS } from '@config';

import { Button } from '@ui/button';
import { Textarea } from '@ui/textarea';
import { Checkbox } from '@ui/checkbox';
import { Validator } from '@ui/validator';
import { useSchema } from '@hooks/useSchema';
import { MultiSelect } from '@ui/multi-select';
import { CustomSelect } from '@ui/custom-select';
import { TooltipLabel } from '@components/guide-point';
import { AutoHeightComponent } from '@ui/auto-height-component';

interface ColumnFormProps {
  isLoading?: boolean;
  data?: Partial<IColumn>;
  onSubmit: (data: IColumn) => void;
}

export function ColumnForm({ onSubmit, data, isLoading }: ColumnFormProps) {
  const { getColumnTypes } = useSchema({ templateId: data?._templateId as string });
  const [columnTypes, setColumnType] = useState<SelectItem[]>(getColumnTypes());
  const { colorScheme } = useMantineColorScheme();
  const {
    watch,
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IColumn>({
    defaultValues: data,
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'validators',
  });
  const typeValue = watch('type');
  const multiSelectValue = watch('allowMultiSelect');

  const onClose = () => {
    modals.close(MODAL_KEYS.COLUMN_UPDATE);
  };

  useEffect(() => {
    setColumnType(getColumnTypes());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const rangeValidatorIndex = fields.findIndex((field) => field.validate === ValidatorTypesEnum.RANGE);
    const lengthValidatorIndex = fields.findIndex((field) => field.validate === ValidatorTypesEnum.LENGTH);
    switch (typeValue) {
      case ColumnTypesEnum.STRING:
        if (rangeValidatorIndex > -1) {
          remove(rangeValidatorIndex);
        }
        break;
      case ColumnTypesEnum.DOUBLE:
      case ColumnTypesEnum.NUMBER:
        if (lengthValidatorIndex > -1) {
          remove(lengthValidatorIndex);
        }
        break;
      default:
        if (rangeValidatorIndex > -1) {
          remove(rangeValidatorIndex);
        }
        if (lengthValidatorIndex > -1) {
          remove(lengthValidatorIndex);
        }
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing="xs">
        <Group style={{ alignItems: 'flex-start' }}>
          <Stack spacing={0} style={{ flexGrow: 1 }}>
            <Title order={4}>{MODAL_TITLES.COLUMN_UPDATE}</Title>
            <Text size="sm">Specify column details and how validations will be performed</Text>
          </Stack>
          <CloseButton onClick={onClose} />
        </Group>
        <div>
          <Divider size="xs" />
          <SimpleGrid cols={2} spacing={0} breakpoints={[{ maxWidth: 'lg', cols: 1 }]}>
            <Stack spacing="sm" p="xs">
              <Title order={5}>Column Details</Title>
              <Input
                required
                label="Column Name"
                {...register('name')}
                error={errors.name?.message}
                placeholder="Name of the column"
                description="Name of the column, visible in mapping step"
              />
              <Input
                required
                label="Column Key"
                {...register('key')}
                placeholder="Column Key"
                error={errors.key?.message}
                description="Primary key and key to use while generating a sample file"
              />
              <Input
                label={
                  <TooltipLabel label="Column Description" link={DOCUMENTATION_REFERENCE_LINKS.columnDescription} />
                }
                {...register('description')}
                placeholder="Enter a description for this column"
                description="This description will be shown as a tooltip in the review table"
              />
              <Controller
                name="alternateKeys"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <MultiSelect
                    creatable
                    clearable
                    searchable
                    value={value}
                    onChange={onChange}
                    label="Alternative column keys"
                    placeholder="Alternative column keys"
                    description="Suggested keys to find appropriate column from the file"
                    getCreateLabel={(query) => `+ ${query}`}
                    data={Array.isArray(value) ? value : []}
                    onCreate={(newItem) => {
                      onChange([...(Array.isArray(value) ? value : []), newItem]);

                      return newItem;
                    }}
                  />
                )}
              />
              <Controller
                name="type"
                control={control}
                render={({ field: { value, onChange, onBlur } }) => (
                  <Select
                    label="Column Type"
                    data={columnTypes}
                    placeholder="Type"
                    value={value}
                    data-autofocus
                    onChange={onChange}
                    onBlur={onBlur}
                    description={'Primary validation to apply on column.'}
                  />
                )}
              />
              <AutoHeightComponent isVisible={typeValue === ColumnTypesEnum.SELECT}>
                <Controller
                  name="selectValues"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <MultiSelect
                      creatable
                      clearable
                      searchable
                      label="Select Values"
                      placeholder="Select Values"
                      description="User can only select value from the provided list"
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
              </AutoHeightComponent>
              <AutoHeightComponent isVisible={typeValue === ColumnTypesEnum.DATE}>
                <Controller
                  name="dateFormats"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <MultiSelect
                      creatable
                      clearable
                      searchable
                      value={value}
                      label="Date Formats"
                      placeholder="Date Formats"
                      description="User can provide date in any of the list formats"
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
              </AutoHeightComponent>
              <AutoHeightComponent isVisible={typeValue === ColumnTypesEnum.REGEX}>
                <Input
                  required
                  {...register('regex')}
                  label="Regular expression"
                  error={errors.regex?.message}
                  placeholder="Regular expression"
                />
                <Textarea
                  autosize
                  minRows={2}
                  label="Regular expression description"
                  placeholder="Regular expression description"
                  register={register('regexDescription')}
                />
              </AutoHeightComponent>
              <Controller
                name="defaultValue"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <CustomSelect
                    value={value}
                    onChange={onChange}
                    label="Default Value"
                    placeholder="Default Value"
                    description="Value used in response when cell is empty"
                    data={DEFAULT_VALUES}
                    link={DOCUMENTATION_REFERENCE_LINKS.defaultValue}
                  />
                )}
              />
            </Stack>
            <Stack spacing="sm" p="xs" bg={colorScheme === 'dark' ? colors.BGSecondaryDark : colors.BGSecondaryLight}>
              <Title order={5}>Column Validations</Title>
              <Checkbox
                label="Required Values"
                register={register('isRequired')}
                description="User have to map this column with uploaded column during map column step and value must be filled during review step."
              />
              <AutoHeightComponent isVisible={typeValue === ColumnTypesEnum.SELECT}>
                <Checkbox
                  label={
                    <TooltipLabel
                      label="Multi Select Values"
                      link={DOCUMENTATION_REFERENCE_LINKS.multiSelectDropDown}
                    />
                  }
                  register={register('allowMultiSelect')}
                  description="Users can pick multiple values from the list. Sample will also allow selecting multiple values."
                />
              </AutoHeightComponent>
              <AutoHeightComponent isVisible={typeValue !== ColumnTypesEnum.SELECT}>
                <Checkbox
                  label="Unique Values Only"
                  register={register('isUnique')}
                  description="Users will be required to resolve any duplicated values inside of this column prior to import."
                />
              </AutoHeightComponent>
              <AutoHeightComponent isVisible={!!(multiSelectValue && typeValue === ColumnTypesEnum.SELECT)}>
                <Controller
                  name="delimiter"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Select
                      ml={35}
                      label="Delimiter"
                      data={DELIMITERS}
                      placeholder="Comma (,)"
                      value={value}
                      data-autofocus
                      defaultValue=","
                      onChange={onChange}
                      description="Delimiter used to separate multiple select values"
                    />
                  )}
                />
              </AutoHeightComponent>

              <Checkbox
                label={<TooltipLabel label="Freeze Column" link={DOCUMENTATION_REFERENCE_LINKS.freezeColumns} />}
                register={register('isFrozen')}
                description="Will freeze column left side in generated sample and in Review section."
              />
              <AutoHeightComponent
                isVisible={typeValue === ColumnTypesEnum.DOUBLE || typeValue === ColumnTypesEnum.NUMBER}
              >
                <Validator
                  errors={errors}
                  control={control}
                  minPlaceholder="Min"
                  maxPlaceholder="Max"
                  label="Range Validation"
                  type={ValidatorTypesEnum.RANGE}
                  description="Specify the range the value should be in"
                  errorMessagePlaceholder='Value must be between "Min" and "Max"'
                  index={fields.findIndex((field) => field.validate === ValidatorTypesEnum.RANGE)}
                  onCheckToggle={(status, index) => {
                    if (status) {
                      append({ validate: ValidatorTypesEnum.RANGE });
                    } else {
                      remove(index);
                    }
                  }}
                />
              </AutoHeightComponent>
              <AutoHeightComponent isVisible={typeValue === ColumnTypesEnum.STRING}>
                <Validator
                  min={0}
                  errors={errors}
                  control={control}
                  label="Length Validation"
                  minPlaceholder="Min characters"
                  maxPlaceholder="Max characters"
                  type={ValidatorTypesEnum.LENGTH}
                  description="Specify the range the string length should be in"
                  errorMessagePlaceholder='Value must be between "Min" and "Max"'
                  index={fields.findIndex((field) => field.validate === ValidatorTypesEnum.LENGTH)}
                  onCheckToggle={(status, index) => {
                    if (status) {
                      append({ validate: ValidatorTypesEnum.LENGTH });
                    } else {
                      remove(index);
                    }
                  }}
                />
              </AutoHeightComponent>
              <Validator
                errors={errors}
                control={control}
                label="Unique With Validation"
                type={ValidatorTypesEnum.UNIQUE_WITH}
                description="Create unique combination of multiple columns"
                errorMessagePlaceholder='Value should be unique with "Unique Key"'
                index={fields.findIndex((field) => field.validate === ValidatorTypesEnum.UNIQUE_WITH)}
                onCheckToggle={(status, index) => {
                  if (status) {
                    append({ validate: ValidatorTypesEnum.UNIQUE_WITH });
                  } else {
                    remove(index);
                  }
                }}
              />
            </Stack>
          </SimpleGrid>
        </div>
        <Stack align="flex-end">
          <Button type="submit" loading={isLoading}>
            Save
          </Button>
        </Stack>
      </Stack>
    </form>
  );
}

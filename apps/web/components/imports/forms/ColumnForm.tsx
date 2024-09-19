import { useEffect } from 'react';
import { modals } from '@mantine/modals';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import {
  Stack,
  Text,
  Title,
  Group,
  Select,
  Divider,
  SimpleGrid,
  CloseButton,
  TextInput as Input,
  useMantineColorScheme,
} from '@mantine/core';

import { ColumnTypesEnum, DEFAULT_VALUES, IColumn, ValidatorTypesEnum } from '@impler/shared';
import { colors, DELIMITERS, MODAL_KEYS, MODAL_TITLES, DOCUMENTATION_REFERENCE_LINKS } from '@config';

import { Button } from '@ui/button';
import { Textarea } from '@ui/textarea';
import { Checkbox } from '@ui/checkbox';
import { Validator } from '@ui/validator';
import { MultiSelect } from '@ui/multi-select';
import { CustomSelect } from '@ui/custom-select';
import { TooltipLabel } from '@components/guide-point';
import { AutoHeightComponent } from '@ui/auto-height-component';
import { useSubscriptionInfo } from '@hooks/useSubscriptionInfo';

interface ColumnFormProps {
  isLoading?: boolean;
  data?: Partial<IColumn>;
  onSubmit: (data: IColumn) => void;
}

export function ColumnForm({ onSubmit, data, isLoading }: ColumnFormProps) {
  const { colorScheme } = useMantineColorScheme();
  const { columnTypes, advancedValidatorsUnavailable } = useSubscriptionInfo();
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
                description="Display name for column in mapping interface"
              />
              <Input
                required
                label="Column Key"
                {...register('key')}
                placeholder="Column Key"
                error={errors.key?.message}
                description="Unique identifier for column; used in sample generation and data retrival"
              />
              <Input
                label={
                  <TooltipLabel label="Column Description" link={DOCUMENTATION_REFERENCE_LINKS.columnDescription} />
                }
                {...register('description')}
                placeholder="Enter a description for this column"
                description="Tooltip text for column in review table"
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
                    description="Fallback identifiers for column matching"
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
                    description="Base validation rule applied to column data"
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
                      description="Predefined list of allowable values for selection"
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
                      description="Accepted date input formats for this field"
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
                  description="Custom pattern for advanced string validation"
                />
              </AutoHeightComponent>
              <AutoHeightComponent isVisible={typeValue === ColumnTypesEnum.REGEX}>
                <Textarea
                  autosize
                  minRows={2}
                  label="Regular expression description"
                  placeholder="Regular expression description"
                  register={register('regexDescription')}
                  description="Human-readable explanation of regex pattern"
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
                    data={DEFAULT_VALUES}
                    placeholder="Default Value"
                    link={DOCUMENTATION_REFERENCE_LINKS.defaultValue}
                    description="Fallback value for empty cells in response"
                  />
                )}
              />
            </Stack>
            <Stack spacing="sm" p="xs" bg={colorScheme === 'dark' ? colors.BGSecondaryDark : colors.BGSecondaryLight}>
              <Title order={5}>Column Validations</Title>
              <Checkbox
                label={<TooltipLabel label="Required Values" />}
                register={register('isRequired')}
                description="Mandatory column mapping and data entry during import"
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
                  description="Enable multiple value selection from predefined list"
                />
              </AutoHeightComponent>
              <AutoHeightComponent isVisible={typeValue !== ColumnTypesEnum.SELECT}>
                <Checkbox
                  label={<TooltipLabel label="Unique Values Only" />}
                  register={register('isUnique')}
                  description="Enforce unique entries; users have to resolve duplicates before import"
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
                      description="Character used to separate multiple selected values"
                    />
                  )}
                />
              </AutoHeightComponent>

              <Checkbox
                label={<TooltipLabel label="Freeze Column" link={DOCUMENTATION_REFERENCE_LINKS.freezeColumns} />}
                register={register('isFrozen')}
                description="Pin column to left side in sample file and review views"
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
                  unavailable={advancedValidatorsUnavailable}
                  link={DOCUMENTATION_REFERENCE_LINKS.rangeValidator}
                  description="Set min/max bounds for valid input values"
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
                  unavailable={advancedValidatorsUnavailable}
                  link={DOCUMENTATION_REFERENCE_LINKS.lengthValidator}
                  description="Set min/max character count for valid strings"
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
                unavailable={advancedValidatorsUnavailable}
                link={DOCUMENTATION_REFERENCE_LINKS.uniqueWithValidator}
                description="Enforce unique combinations across specified columns"
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

import { useEffect, useRef } from 'react';
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
  NumberInput,
} from '@mantine/core';

import { ValidationTypesEnum } from '@impler/client';
import {
  ColumnTypesEnum,
  DEFAULT_MAX_IMAGE_SIZE_MB,
  MAX_IMAGE_SIZE_MB_LIMIT,
  DEFAULT_VALUES,
  IColumn,
} from '@impler/shared';
import { colors, DELIMITERS, MODAL_KEYS, MODAL_TITLES, DOCUMENTATION_REFERENCE_LINKS } from '@config';

import { Button } from '@ui/button';
import { Textarea } from '@ui/textarea';
import { Checkbox } from '@ui/checkbox';
import { Validation } from '@ui/validation';
import { MultiSelect } from '@ui/multi-select';
import { CustomSelect } from '@ui/custom-select';
import { TooltipLabel } from '@components/guide-point';
import { AutoHeightComponent } from '@ui/auto-height-component';
import { useSubscriptionMetaDataInformation } from '@hooks/useSubscriptionMetaDataInformation';
import { GatedField } from './GatedField';

const TYPE_VALIDATIONS: Partial<Record<ColumnTypesEnum, ValidationTypesEnum[]>> = {
  [ColumnTypesEnum.STRING]: [ValidationTypesEnum.LENGTH],
  [ColumnTypesEnum.NUMBER]: [ValidationTypesEnum.RANGE, ValidationTypesEnum.DIGITS],
  [ColumnTypesEnum.DOUBLE]: [ValidationTypesEnum.RANGE],
};

interface ColumnFormProps {
  isLoading?: boolean;
  data?: Partial<IColumn>;
  onSubmit: (data: IColumn) => void;
  existingColumns?: IColumn[];
}

export function ColumnForm({ onSubmit, data, isLoading, existingColumns }: ColumnFormProps) {
  const {
    columnTypes,
    advancedValidationsUnavailable,
    freezeColumnsUnavailable,
    requiredValidationUnavailable,
    uniqueValidationUnavailable,
    defaultValueUnavailable,
    dateFormatUnavailable,
    rangeValidationUnavailable,
    // alternateColumnKeysUnavailable,
    multiSelectValuesUnavailable,
    lengthValidationUnavailable,
    digitsValidationUnavailable,
    multipleColumnsCombinationUniqueValidationUnavailable,
  } = useSubscriptionMetaDataInformation();
  const {
    watch,
    control,
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<IColumn>({
    defaultValues: data,
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'validations',
  });
  const typeValue = watch('type');
  const multiSelectValue = watch('allowMultiSelect');
  const keyManuallyEditedRef = useRef(!!data?.key && data.key !== data?.name);

  const onClose = () => {
    modals.close(MODAL_KEYS.COLUMN_UPDATE);
  };

  function removeValidationsIncompatibleWith(nextType: string) {
    const allowed = TYPE_VALIDATIONS[nextType as ColumnTypesEnum] || [];
    [ValidationTypesEnum.RANGE, ValidationTypesEnum.LENGTH, ValidationTypesEnum.DIGITS].forEach((validationType) => {
      if (!allowed.includes(validationType)) {
        const index = fields.findIndex((field) => field.validate === validationType);
        if (index > -1) remove(index);
      }
    });
  }

  function onTypeChange(nextType: ColumnTypesEnum, onFieldChange: (value: ColumnTypesEnum) => void) {
    const hasIncompatibleValidations = fields.some(
      (field) =>
        [ValidationTypesEnum.RANGE, ValidationTypesEnum.LENGTH, ValidationTypesEnum.DIGITS].includes(
          field.validate as ValidationTypesEnum
        ) && !(TYPE_VALIDATIONS[nextType] || []).includes(field.validate as ValidationTypesEnum)
    );

    if (hasIncompatibleValidations) {
      modals.openConfirmModal({
        title: 'Change column type?',
        centered: true,
        children: (
          <Text size="sm">
            Changing the column type will remove the range, length or digits validations already configured for this
            column. This cannot be undone.
          </Text>
        ),
        labels: { confirm: 'Change type', cancel: 'Keep current type' },
        confirmProps: { color: 'red' },
        onConfirm: () => onFieldChange(nextType),
      });

      return;
    }

    onFieldChange(nextType);
  }

  useEffect(() => {
    removeValidationsIncompatibleWith(typeValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeValue]);

  function isKeyTaken(key: string, currentId?: string) {
    if (!key || !Array.isArray(existingColumns)) return false;

    return existingColumns.some(
      (column) =>
        column._id !== currentId &&
        (column.key === key || (Array.isArray(column.alternateKeys) && column.alternateKeys.includes(key)))
    );
  }

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
                {...register('name', {
                  onChange: (event) => {
                    if (!keyManuallyEditedRef.current) {
                      setValue('key', event.target.value, { shouldValidate: true });
                    }
                  },
                })}
                error={errors.name?.message}
                placeholder="Name of the column"
                description="Display name for column in mapping interface"
              />
              <Input
                required
                label="Column Key"
                {...register('key', {
                  onChange: () => {
                    keyManuallyEditedRef.current = true;
                  },
                  validate: (value) =>
                    !isKeyTaken(value, data?._id) ||
                    'This key is already used by another column (or its alternate keys)',
                })}
                placeholder="Column Key"
                error={errors.key?.message}
                description="Unique identifier for column; auto-filled from name, edit to customize"
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
                name="type"
                control={control}
                render={({ field: { value, onChange, onBlur } }) => (
                  <Select
                    label="Column Type"
                    data={columnTypes}
                    placeholder="Type"
                    value={value}
                    data-autofocus
                    onChange={(nextType: ColumnTypesEnum) => onTypeChange(nextType, onChange)}
                    onBlur={onBlur}
                    description="Base validation rule applied to column data"
                  />
                )}
              />

              <AutoHeightComponent isVisible={typeValue === ColumnTypesEnum.SELECT}>
                <GatedField
                  unavailable={!!multiSelectValuesUnavailable}
                  label="Select Values"
                  link="defaultValue"
                  description="Predefined list of allowable values for selection"
                >
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
                </GatedField>
              </AutoHeightComponent>

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

              <AutoHeightComponent isVisible={typeValue === ColumnTypesEnum.DATE}>
                <GatedField
                  unavailable={!!dateFormatUnavailable}
                  label="Date Formats"
                  link="defaultValue"
                  description="Specify accepted date input formats for this field"
                >
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
                </GatedField>
              </AutoHeightComponent>
              <AutoHeightComponent isVisible={typeValue === ColumnTypesEnum.IMAGE}>
                <Controller
                  name="maxImageSize"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <NumberInput
                      min={1}
                      max={MAX_IMAGE_SIZE_MB_LIMIT}
                      label="Max Image Size (MB)"
                      placeholder="Max Image Size"
                      value={value ?? DEFAULT_MAX_IMAGE_SIZE_MB}
                      onChange={(newValue) =>
                        onChange(
                          newValue === ''
                            ? DEFAULT_MAX_IMAGE_SIZE_MB
                            : Math.min(Number(newValue), MAX_IMAGE_SIZE_MB_LIMIT)
                        )
                      }
                      description={`Maximum allowed size for images uploaded to this column (up to ${MAX_IMAGE_SIZE_MB_LIMIT} MB)`}
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
              <GatedField
                unavailable={!!defaultValueUnavailable}
                label="Default Value"
                link="defaultValue"
                description="Fallback value for empty cells in response"
              >
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
              </GatedField>
            </Stack>
            <Stack spacing="sm" p="xs" bg={colors.BGSecondaryDark}>
              <Title order={5}>Column Validations</Title>
              <GatedField
                unavailable={!!requiredValidationUnavailable}
                label="Required Values"
                link="advancedValidations"
                description="Mandatory column mapping and data entry during import"
              >
                <Checkbox
                  register={register('isRequired')}
                  label={
                    <TooltipLabel label="Required Values" link={DOCUMENTATION_REFERENCE_LINKS.advancedValidations} />
                  }
                  description="Mandatory column mapping and data entry during import"
                />
              </GatedField>
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
                <GatedField
                  unavailable={!!uniqueValidationUnavailable}
                  label="Unique Values Only"
                  link="uniqueWithValidator"
                  description="Enforce unique entries; users have to resolve duplicates before import"
                >
                  <Checkbox
                    register={register('isUnique')}
                    label={
                      <TooltipLabel
                        label="Unique Values Only"
                        link={DOCUMENTATION_REFERENCE_LINKS.uniqueWithValidator}
                      />
                    }
                    description="Enforce unique entries; users have to resolve duplicates before import"
                  />
                </GatedField>
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

              <GatedField
                unavailable={!!freezeColumnsUnavailable}
                label="Freeze Column"
                link="freezeColumns"
                description="Pin column to left side in sample file and review views"
              >
                <Checkbox
                  register={register('isFrozen')}
                  label={<TooltipLabel label="Freeze Column" link={DOCUMENTATION_REFERENCE_LINKS.freezeColumns} />}
                  description="Pin column to left side in sample file and review views"
                />
              </GatedField>

              <AutoHeightComponent
                isVisible={typeValue === ColumnTypesEnum.DOUBLE || typeValue === ColumnTypesEnum.NUMBER}
              >
                <Validation
                  errors={errors}
                  control={control}
                  minPlaceholder="Min"
                  maxPlaceholder="Max"
                  label="Range Validation"
                  type={ValidationTypesEnum.RANGE}
                  unavailable={!!(rangeValidationUnavailable || advancedValidationsUnavailable)}
                  link={DOCUMENTATION_REFERENCE_LINKS.rangeValidator}
                  description="Set min/max bounds for valid input values"
                  errorMessagePlaceholder='Value must be between "Min" and "Max"'
                  index={fields.findIndex((field) => field.validate === ValidationTypesEnum.RANGE)}
                  onCheckToggle={(status, index) => {
                    if (status) {
                      append({ validate: ValidationTypesEnum.RANGE });
                    } else {
                      remove(index);
                    }
                  }}
                />
              </AutoHeightComponent>

              <AutoHeightComponent isVisible={typeValue === ColumnTypesEnum.NUMBER}>
                <Validation
                  errors={errors}
                  control={control}
                  min={1}
                  max={10}
                  minPlaceholder="Min digits (e.g. 1)"
                  maxPlaceholder="Max digits (e.g. 10)"
                  label="Number of Digits Validation"
                  type={ValidationTypesEnum.DIGITS}
                  unavailable={digitsValidationUnavailable}
                  link={DOCUMENTATION_REFERENCE_LINKS.lengthValidator}
                  description="Set min/max digit count for valid numbers"
                  errorMessagePlaceholder='Number must have between "Min" and "Max" digits'
                  index={fields.findIndex((field) => field.validate === ValidationTypesEnum.DIGITS)}
                  onCheckToggle={(status) => {
                    if (status) {
                      // Only add DIGITS validation if it doesn't already exist
                      const exists = fields.some((field) => field.validate === ValidationTypesEnum.DIGITS);
                      if (!exists) {
                        append({
                          validate: ValidationTypesEnum.DIGITS,
                          min: 1,
                          max: 10,
                          errorMessage: 'Number must have between 1 and 10 digits',
                        });
                      }
                    } else {
                      // Remove the DIGITS validation using the correct index
                      const digitsIndex = fields.findIndex((field) => field.validate === ValidationTypesEnum.DIGITS);
                      if (digitsIndex > -1) {
                        remove(digitsIndex);
                      }
                    }
                  }}
                />
              </AutoHeightComponent>
              <AutoHeightComponent isVisible={typeValue === ColumnTypesEnum.STRING}>
                <Validation
                  min={0}
                  errors={errors}
                  control={control}
                  label="Length Validation"
                  minPlaceholder="Min characters"
                  maxPlaceholder="Max characters"
                  type={ValidationTypesEnum.LENGTH}
                  unavailable={lengthValidationUnavailable}
                  link={DOCUMENTATION_REFERENCE_LINKS.lengthValidator}
                  description="Set min/max character count for valid strings"
                  errorMessagePlaceholder='Value must be between "Min" and "Max"'
                  index={fields.findIndex((field) => field.validate === ValidationTypesEnum.LENGTH)}
                  onCheckToggle={(status, index) => {
                    if (status) {
                      append({ validate: ValidationTypesEnum.LENGTH });
                    } else {
                      remove(index);
                    }
                  }}
                />
              </AutoHeightComponent>
              <Validation
                errors={errors}
                control={control}
                label="Unique With Validation"
                type={ValidationTypesEnum.UNIQUE_WITH}
                unavailable={!!multipleColumnsCombinationUniqueValidationUnavailable}
                link={DOCUMENTATION_REFERENCE_LINKS.uniqueWithValidator}
                description="Enforce unique combinations across specified columns"
                errorMessagePlaceholder='Value should be unique with "Unique Key"'
                index={fields.findIndex((field) => field.validate === ValidationTypesEnum.UNIQUE_WITH)}
                onCheckToggle={(status, index) => {
                  if (status) {
                    append({ validate: ValidationTypesEnum.UNIQUE_WITH, uniqueKey: '' });
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

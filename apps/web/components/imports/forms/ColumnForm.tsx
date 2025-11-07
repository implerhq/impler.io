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
  Flex,
} from '@mantine/core';

import { ValidationTypesEnum } from '@impler/client';
import { ColumnTypesEnum, DEFAULT_VALUES, IColumn } from '@impler/shared';
import { colors, DELIMITERS, MODAL_KEYS, MODAL_TITLES, DOCUMENTATION_REFERENCE_LINKS, ROUTES } from '@config';

import { Button } from '@ui/button';
import { Textarea } from '@ui/textarea';
import { Checkbox } from '@ui/checkbox';
import { Validation } from '@ui/validation';
import { LockIcon } from '@assets/icons/Lock.icon';
import { MultiSelect } from '@ui/multi-select';
import { CustomSelect } from '@ui/custom-select';
import { TooltipLabel } from '@components/guide-point';
import { AutoHeightComponent } from '@ui/auto-height-component';
import { useSubscriptionMetaDataInformation } from '@hooks/useSubscriptionMetaDataInformation';
import Link from 'next/link';
import { Badge } from '@ui/badge';

interface ColumnFormProps {
  isLoading?: boolean;
  data?: Partial<IColumn>;
  onSubmit: (data: IColumn) => void;
}

export function ColumnForm({ onSubmit, data, isLoading }: ColumnFormProps) {
  const {
    columnTypes,
    advancedValidationsUnavailable,
    freezeColumnsUnavailable,
    requiredValidationUnavailable,
    uniqueValidationUnavailable,
    defaultValueUnavailable,
    dateFormatUnavailable,
    alternateColumnKeysUnavailable,
    multiSelectValuesUnavailable,
  } = useSubscriptionMetaDataInformation();
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
    name: 'validations',
  });
  const typeValue = watch('type');
  const multiSelectValue = watch('allowMultiSelect');

  const onClose = () => {
    modals.close(MODAL_KEYS.COLUMN_UPDATE);
  };

  useEffect(() => {
    const rangeValidationIndex = fields.findIndex((field) => field.validate === ValidationTypesEnum.RANGE);
    const lengthValidationIndex = fields.findIndex((field) => field.validate === ValidationTypesEnum.LENGTH);
    const digitsValidationIndex = fields.findIndex((field) => field.validate === ValidationTypesEnum.DIGITS);

    switch (typeValue) {
      case ColumnTypesEnum.STRING:
        if (rangeValidationIndex > -1) {
          remove(rangeValidationIndex);
        }
        if (digitsValidationIndex > -1) {
          remove(digitsValidationIndex);
        }
        break;
      case ColumnTypesEnum.DOUBLE:
      case ColumnTypesEnum.NUMBER:
        if (lengthValidationIndex > -1) {
          remove(lengthValidationIndex);
        }
        break;
      case ColumnTypesEnum.DOUBLE:
        if (lengthValidationIndex > -1) {
          remove(lengthValidationIndex);
        }
        if (digitsValidationIndex > -1) {
          remove(digitsValidationIndex);
        }
        break;
      default:
        if (rangeValidationIndex > -1) {
          remove(rangeValidationIndex);
        }
        if (lengthValidationIndex > -1) {
          remove(lengthValidationIndex);
        }
        if (digitsValidationIndex > -1) {
          remove(digitsValidationIndex);
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
                {multiSelectValuesUnavailable ? (
                  <Flex
                    direction="row"
                    gap="sm"
                    align="center"
                    style={{
                      padding: '7px',
                      backgroundColor: colors.BGPrimaryDark,
                      borderRadius: '4px',
                    }}
                  >
                    <LockIcon size="xl" />

                    <Stack spacing={5} w="100%" align="flex-start">
                      <Badge color="orange">Feature unavailable on current plan</Badge>
                      <div>
                        <TooltipLabel label="Select Values" link={DOCUMENTATION_REFERENCE_LINKS.defaultValue} />
                        <p style={{ fontSize: '0.75rem', color: '#868e96', margin: 0 }}>
                          Predefined list of allowable values for selection
                        </p>
                      </div>
                    </Stack>

                    <Button component={Link} size="xs" href={ROUTES.EXPLORE_PLANS} onClick={modals.closeAll}>
                      Explore Options
                    </Button>
                  </Flex>
                ) : (
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
                )}
              </AutoHeightComponent>
              {alternateColumnKeysUnavailable ? (
                <Flex
                  direction="row"
                  gap="sm"
                  align="center"
                  style={{
                    padding: '7px',
                    backgroundColor: colors.BGPrimaryDark,
                    borderRadius: '4px',
                  }}
                >
                  <LockIcon size="xl" />

                  <Stack spacing={5} w="100%" align="flex-start">
                    <Badge color="orange">Feature unavailable on current plan</Badge>
                    <div>
                      <TooltipLabel label="Alternative column keys" link={DOCUMENTATION_REFERENCE_LINKS.defaultValue} />
                      <p style={{ fontSize: '0.75rem', color: '#868e96', margin: 0 }}>
                        Fallback identifiers for column matching
                      </p>
                    </div>
                  </Stack>

                  <Button component={Link} size="xs" href={ROUTES.EXPLORE_PLANS} onClick={modals.closeAll}>
                    Explore Options
                  </Button>
                </Flex>
              ) : (
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
              )}
              <AutoHeightComponent isVisible={typeValue === ColumnTypesEnum.DATE}>
                {dateFormatUnavailable ? (
                  <Flex
                    direction="row"
                    gap="sm"
                    align="center"
                    style={{
                      padding: '7px',
                      backgroundColor: colors.BGPrimaryDark,
                      borderRadius: '4px',
                    }}
                  >
                    <LockIcon size="xl" />

                    <Stack spacing={5} w="100%" align="flex-start">
                      <Badge color="orange">Feature unavailable on current plan</Badge>
                      <div>
                        <TooltipLabel label="Date Formats" link={DOCUMENTATION_REFERENCE_LINKS.defaultValue} />
                        <p style={{ fontSize: '0.75rem', color: '#868e96', margin: 0 }}>
                          Specify accepted date input formats for this field
                        </p>
                      </div>
                    </Stack>

                    <Button component={Link} size="xs" href={ROUTES.EXPLORE_PLANS} onClick={modals.closeAll}>
                      Explore Options
                    </Button>
                  </Flex>
                ) : (
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
                )}
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
              {defaultValueUnavailable ? (
                <Flex
                  direction="row"
                  gap="sm"
                  align="center"
                  style={{
                    padding: '8px',
                    backgroundColor: colors.BGPrimaryDark,
                    borderRadius: '4px',
                  }}
                >
                  <LockIcon size="xl" />

                  <Stack spacing={5} w="100%" align="flex-start">
                    <Badge color="orange">Feature unavailable on current plan</Badge>
                    <div>
                      <TooltipLabel label="Default Value" link={DOCUMENTATION_REFERENCE_LINKS.defaultValue} />
                      <p style={{ fontSize: '0.75rem', color: '#868e96', margin: 0 }}>
                        Fallback value for empty cells in response
                      </p>
                    </div>
                  </Stack>

                  <Button component={Link} size="xs" href={ROUTES.EXPLORE_PLANS} onClick={modals.closeAll}>
                    Explore Options
                  </Button>
                </Flex>
              ) : (
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
              )}
            </Stack>
            <Stack spacing="sm" p="xs" bg={colors.BGSecondaryDark}>
              <Title order={5}>Column Validations</Title>
              <Flex
                direction="row"
                gap="sm"
                align="center"
                style={{
                  padding: requiredValidationUnavailable ? '8px' : '0',
                  backgroundColor: requiredValidationUnavailable ? colors.BGPrimaryDark : 'transparent',
                }}
              >
                {requiredValidationUnavailable ? (
                  <LockIcon size="xl" />
                ) : (
                  <Checkbox register={register('isRequired')} />
                )}
                <Stack spacing={5} w="100%" align="flex-start">
                  {requiredValidationUnavailable ? (
                    <Badge color="orange">Feature unavailable on current plan</Badge>
                  ) : null}
                  <div>
                    <TooltipLabel label="Required Values" link={DOCUMENTATION_REFERENCE_LINKS.advancedValidations} />
                    <p style={{ fontSize: '0.75rem', color: '#868e96', margin: 0 }}>
                      Mandatory column mapping and data entry during import
                    </p>
                  </div>
                </Stack>
                {requiredValidationUnavailable ? (
                  <Button component={Link} size="xs" href={ROUTES.EXPLORE_PLANS} onClick={modals.closeAll}>
                    Explore Options
                  </Button>
                ) : null}
              </Flex>
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
                <Flex
                  direction="row"
                  gap="sm"
                  align="center"
                  style={{
                    padding: uniqueValidationUnavailable ? '8px' : '0',
                    backgroundColor: uniqueValidationUnavailable ? colors.BGPrimaryDark : 'transparent',
                  }}
                >
                  {uniqueValidationUnavailable ? <LockIcon size="xl" /> : <Checkbox register={register('isUnique')} />}
                  <Stack spacing={5} w="100%" align="flex-start">
                    {uniqueValidationUnavailable ? (
                      <Badge color="orange">Feature unavailable on current plan</Badge>
                    ) : null}
                    <div>
                      <TooltipLabel
                        label="Unique Values Only"
                        link={DOCUMENTATION_REFERENCE_LINKS.uniqueWithValidator}
                      />
                      <p style={{ fontSize: '0.75rem', color: '#868e96', margin: 0 }}>
                        Enforce unique entries; users have to resolve duplicates before import
                      </p>
                    </div>
                  </Stack>
                  {uniqueValidationUnavailable ? (
                    <Button component={Link} size="xs" href={ROUTES.EXPLORE_PLANS} onClick={modals.closeAll}>
                      Explore Options
                    </Button>
                  ) : null}
                </Flex>
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

              <Flex
                direction="row"
                gap="sm"
                align="center"
                style={{
                  padding: freezeColumnsUnavailable ? '8px' : '0',
                  backgroundColor: freezeColumnsUnavailable ? colors.BGPrimaryDark : 'transparent',
                }}
              >
                {freezeColumnsUnavailable ? <LockIcon size="xl" /> : <Checkbox register={register('isFrozen')} />}

                <Stack spacing={5} w="100%" align="flex-start">
                  {freezeColumnsUnavailable ? <Badge color="orange">Feature unavailable on current plan</Badge> : null}
                  <div>
                    <TooltipLabel label="Freeze Column" link={DOCUMENTATION_REFERENCE_LINKS.freezeColumns} />
                    <p style={{ fontSize: '0.75rem', color: '#868e96', margin: 0 }}>
                      Pin column to left side in sample file and review views
                    </p>
                  </div>
                </Stack>

                {freezeColumnsUnavailable ? (
                  <Button component={Link} size="xs" href={ROUTES.EXPLORE_PLANS} onClick={modals.closeAll}>
                    Explore Options
                  </Button>
                ) : null}
              </Flex>

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
                  unavailable={advancedValidationsUnavailable}
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
                  unavailable={advancedValidationsUnavailable}
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
                  unavailable={advancedValidationsUnavailable}
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
                unavailable={advancedValidationsUnavailable}
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

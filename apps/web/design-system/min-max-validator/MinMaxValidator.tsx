import { ReactNode } from 'react';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { Flex, Group, MantineSize, Stack, TextInput, NumberInput, Collapse } from '@mantine/core';

import { Checkbox } from '@ui/checkbox';
import { IColumn } from '@impler/shared';
import useStyles from './MinMaxValidator.styles';

interface MinMaxValidatorProps {
  label?: string;
  size?: MantineSize;
  description?: ReactNode;

  index: number;
  min?: number;
  max?: number;
  minPlaceholder?: string;
  maxPlaceholder?: string;
  control: Control<IColumn>;
  errors?: FieldErrors<IColumn>;
  errorMessagePlaceholder?: string;
  onCheckToggle: (status: boolean, index: number) => void;
}

export function MinMaxValidator({
  label,
  index,
  errors,
  control,
  min,
  max,
  size = 'sm',
  description,
  onCheckToggle,
  minPlaceholder,
  maxPlaceholder,
  errorMessagePlaceholder,
}: MinMaxValidatorProps) {
  const { classes } = useStyles();

  const validateMinMax = (minValue?: number, maxValue?: number) => {
    if (typeof minValue !== 'number' && typeof maxValue !== 'number') {
      return 'Either min or max must be provided';
    }
    if (typeof minValue === 'number' && typeof maxValue === 'number' && Number(maxValue) < Number(minValue)) {
      return 'Max must be greater than or equal to min';
    }

    return true;
  };

  return (
    <Flex direction="row" gap="sm">
      <Checkbox checked={index > -1} onChange={(status) => onCheckToggle(status, index)} />
      <Stack spacing={5}>
        <div className={classes.root}>
          {label ? <label className={classes.label}>{label}</label> : null}
          {description ? <p className={classes.description}>{description}</p> : null}
        </div>
        <Collapse in={index > -1}>
          <Stack spacing={5}>
            <Group spacing={5} noWrap>
              <Controller
                control={control}
                name={`validators.${index}.min`}
                rules={{
                  validate: (value, formValues) => validateMinMax(value, formValues.validators?.[index].max),
                }}
                render={({ field }) => (
                  <NumberInput
                    size={size}
                    min={min}
                    placeholder={minPlaceholder}
                    error={errors?.validators?.[index]?.min?.message}
                    {...field}
                  />
                )}
              />
              <Controller
                control={control}
                name={`validators.${index}.max`}
                rules={{
                  validate: (value, formValues) => validateMinMax(formValues.validators?.[index].min, value),
                }}
                render={({ field }) => (
                  <NumberInput
                    size={size}
                    max={max}
                    placeholder={maxPlaceholder}
                    error={errors?.validators?.[index]?.max?.message}
                    {...field}
                  />
                )}
              />
            </Group>
            <Controller
              control={control}
              name={`validators.${index}.errorMessage`}
              render={({ field }) => (
                <TextInput
                  size={size}
                  placeholder={errorMessagePlaceholder}
                  error={errors?.validators?.[index]?.errorMessage?.message}
                  {...field}
                />
              )}
            />
          </Stack>
        </Collapse>
      </Stack>
    </Flex>
  );
}

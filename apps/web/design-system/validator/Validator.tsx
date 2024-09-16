import { ReactNode } from 'react';
import { Control, FieldErrors } from 'react-hook-form';
import { Flex, MantineSize, Stack } from '@mantine/core';

import { Checkbox } from '@ui/checkbox';
import { AutoHeightComponent } from '@ui/auto-height-component';

import useStyles from './Validator.styles';
import { MinMaxValidator } from './MinMaxValidator';
import { UniqueWithValidator } from './UniqueWithValidator';
import { IColumn, ValidatorTypesEnum } from '@impler/shared';

interface ValidatorProps {
  label?: string;
  size?: MantineSize;
  description?: ReactNode;

  index: number;
  min?: number;
  max?: number;
  minPlaceholder?: string;
  maxPlaceholder?: string;
  control: Control<IColumn>;
  type?: ValidatorTypesEnum;
  errors?: FieldErrors<IColumn>;
  errorMessagePlaceholder?: string;
  onCheckToggle: (status: boolean, index: number) => void;
}

export function Validator({
  label,
  index,
  errors,
  control,
  min,
  max,
  type,
  size = 'sm',
  description,
  onCheckToggle,
  minPlaceholder,
  maxPlaceholder,
  errorMessagePlaceholder,
}: ValidatorProps) {
  const { classes } = useStyles();

  return (
    <Flex direction="row" gap="sm">
      <Checkbox checked={index > -1} onChange={(status) => onCheckToggle(status, index)} />
      <Stack spacing={5} w="100%">
        <div className={classes.root}>
          {label ? <label className={classes.label}>{label}</label> : null}
          {description ? <p className={classes.description}>{description}</p> : null}
        </div>
        <AutoHeightComponent isVisible={index > -1 && type === ValidatorTypesEnum.UNIQUE_WITH}>
          <UniqueWithValidator
            key={index}
            size={size}
            index={index}
            errors={errors}
            control={control}
            errorMessagePlaceholder={errorMessagePlaceholder}
          />
        </AutoHeightComponent>
        <AutoHeightComponent
          isVisible={index > -1 && (type === ValidatorTypesEnum.LENGTH || type === ValidatorTypesEnum.RANGE)}
        >
          <MinMaxValidator
            max={max}
            min={min}
            key={index}
            size={size}
            index={index}
            errors={errors}
            control={control}
            maxPlaceholder={maxPlaceholder}
            minPlaceholder={minPlaceholder}
            errorMessagePlaceholder={errorMessagePlaceholder}
          />
        </AutoHeightComponent>
      </Stack>
    </Flex>
  );
}

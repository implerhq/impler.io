import Link from 'next/link';
import { ReactNode } from 'react';
import { modals } from '@mantine/modals';
import { Control, FieldErrors } from 'react-hook-form';
import { Flex, MantineSize, Stack } from '@mantine/core';

import { Checkbox } from '@ui/checkbox';
import { AutoHeightComponent } from '@ui/auto-height-component';

import { ROUTES } from '@config';
import { Badge } from '@ui/badge';
import { Button } from '@ui/button';
import { IColumn } from '@impler/shared';
import { LockIcon } from '@assets/icons/Lock.icon';
import { ValidatorTypesEnum } from '@impler/client';
import { TooltipLabel } from '@components/guide-point';

import useStyles from './Validator.styles';
import { MinMaxValidator } from './MinMaxValidator';
import { UniqueWithValidator } from './UniqueWithValidator';

interface ValidatorProps {
  link: string;
  label: string;
  size?: MantineSize;
  description?: ReactNode;

  index: number;
  min?: number;
  max?: number;
  unavailable?: boolean;
  minPlaceholder?: string;
  maxPlaceholder?: string;
  control: Control<IColumn>;
  type?: ValidatorTypesEnum;
  errors?: FieldErrors<IColumn>;
  errorMessagePlaceholder?: string;
  onCheckToggle: (status: boolean, index: number) => void;
}

export function Validator({
  link,
  label,
  index,
  errors,
  control,
  min,
  max,
  type,
  unavailable,
  size = 'sm',
  description,
  onCheckToggle,
  minPlaceholder,
  maxPlaceholder,
  errorMessagePlaceholder,
}: ValidatorProps) {
  const { classes } = useStyles({ showWrapper: unavailable });

  return (
    <Flex direction="row" gap="sm" className={classes.wrapper} align="center">
      {unavailable ? (
        <LockIcon className={classes.icon} size="xl" />
      ) : (
        <Checkbox checked={index > -1} onChange={(status) => onCheckToggle(status, index)} />
      )}

      <Stack spacing={5} w="100%" align="flex-start">
        {unavailable ? <Badge color="orange">Feature unavailable on current plan</Badge> : null}
        <div>
          <TooltipLabel link={link} label={label} />
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

      {unavailable ? (
        <Button component={Link} size="xs" href={ROUTES.EXPLORE_PLANS} onClick={modals.closeAll}>
          Explore Options
        </Button>
      ) : null}
    </Flex>
  );
}

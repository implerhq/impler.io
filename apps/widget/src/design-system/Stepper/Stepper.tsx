import { Stepper as MantineStepper, DefaultMantineColor } from '@mantine/core';
import useStyles from './Stepper.styles';
import { CheckIcon } from '../../icons/check.icon';
import { colors } from '../../config/colors.config';

interface IStep {
  label?: string;
  description?: string;
}

export interface IStepperProps {
  active: number;
  steps: IStep[];
  primaryColor?: string;
}

export function Stepper(props: IStepperProps) {
  const { active, steps, primaryColor } = props;
  const { classes } = useStyles();

  const getColor = (index: number): DefaultMantineColor => {
    if (index == active) {
      return primaryColor || colors.primary;
    } else if (index < active) {
      return colors.success;
    }

    return 'gray';
  };

  return (
    <MantineStepper active={active} size="sm" iconSize={28} classNames={classes} completedIcon={<CheckIcon />}>
      {Array.isArray(steps) &&
        steps.map((step, index) => (
          <MantineStepper.Step key={index} label={step.label} description={step.description} color={getColor(index)} />
        ))}
    </MantineStepper>
  );
}

import { CheckIcon } from '../../icons/check.icon';
import { Stepper as MantineStepper, DefaultMantineColor } from '@mantine/core';
import useStyles from './Stepper.styles';

interface IStep {
  label?: string;
  description?: string;
}

export interface IStepperProps {
  active: number;
  steps: IStep[];
}

export function Stepper(props: IStepperProps) {
  const { active, steps } = props;
  const { classes } = useStyles(props);

  const getColor = (index: number): DefaultMantineColor => {
    if (index == active - 1) {
      return 'blue';
    } else if (index < active) {
      return 'green';
    }

    return 'gray';
  };

  return (
    <MantineStepper active={active - 1} size="sm" iconSize={28} classNames={classes} completedIcon={<CheckIcon />}>
      {Array.isArray(steps) &&
        steps.map((step, index) => (
          <MantineStepper.Step key={index} label={step.label} description={step.description} color={getColor(index)} />
        ))}
    </MantineStepper>
  );
}

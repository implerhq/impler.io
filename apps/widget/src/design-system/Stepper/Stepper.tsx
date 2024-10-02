import { Stepper as MantineStepper } from '@mantine/core';
import useStyles from './Stepper.styles';
import { CheckIcon } from '../../icons/check.icon';

interface IStep {
  label?: string;
  description?: string;
}

export interface IStepperProps {
  active: number;
  steps: IStep[];
}

export function Stepper(props: IStepperProps) {
  const { steps, active, ...rest } = props;
  const { classes } = useStyles();

  return (
    <MantineStepper
      size="sm"
      iconSize={28}
      active={active}
      classNames={classes}
      completedIcon={<CheckIcon />}
      {...rest}
    >
      {Array.isArray(steps) &&
        steps.map((step, index) => (
          <MantineStepper.Step key={index} label={step.label} description={step.description} />
        ))}
    </MantineStepper>
  );
}

import { Stepper as MantineStepper, DefaultMantineColor, MantineSize } from '@mantine/core';
import useStyles from './Stepper.styles';

interface IStep {
  label?: string;
  description?: string;
}

export interface IStepperProps {
  active: number;
  steps: IStep[];
  size: MantineSize;
}

export function Stepper(props: IStepperProps) {
  const { active, steps, size } = props;
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
    <MantineStepper active={active - 1} size={size} classNames={classes}>
      {Array.isArray(steps) &&
        steps.map((step, index) => (
          <MantineStepper.Step key={index} label={step.label} description={step.description} color={getColor(index)} />
        ))}
    </MantineStepper>
  );
}

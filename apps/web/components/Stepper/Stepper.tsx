import { Box, Text, Progress } from '@mantine/core';
import { useStyles } from './Stepper.styles';

interface StepperProps {
  currentStep: number;
  totalSteps: number;
}

export const Stepper = ({ currentStep, totalSteps }: StepperProps) => {
  const { classes } = useStyles();
  const progressValue = (currentStep / totalSteps) * 100;

  return (
    <Box className={classes.stepperContainer}>
      <Text className={classes.stepText}>
        Step {currentStep} of {totalSteps}
      </Text>
      <Progress value={progressValue} className={classes.progressBar} radius="xs" />
    </Box>
  );
};

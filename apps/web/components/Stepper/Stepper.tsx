import { Box, Text } from '@mantine/core';
import { useStyles } from './Stepper.styles';

interface StepperProps {
  currentStep: number;
  totalSteps: number;
}

export const Stepper = ({ currentStep, totalSteps }: StepperProps) => {
  const { classes } = useStyles();

  return (
    <Box className={classes.stepperContainer}>
      <Text className={classes.stepText}>
        {currentStep}/{totalSteps}
      </Text>
    </Box>
  );
};

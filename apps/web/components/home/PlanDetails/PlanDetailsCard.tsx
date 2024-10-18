import { Container, Stack, Text, Title } from '@mantine/core';
import { usePlanDetailCardStyles } from './PlanDetailsCard.styles';

interface PlanDetailCardProps {
  title: string;
  value: string;
  isWarning?: boolean;
}

export function PlanDetailCard({ title, value, isWarning = false }: PlanDetailCardProps) {
  const { classes } = usePlanDetailCardStyles({ isWarning });

  return (
    <Container className={classes.container}>
      <Stack spacing={4}>
        <Text className={classes.title}>{title}</Text>
        <Title order={3} className={isWarning ? classes.warningValue : classes.value}>
          {value}
        </Title>
      </Stack>
    </Container>
  );
}

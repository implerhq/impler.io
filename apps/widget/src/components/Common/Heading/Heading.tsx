import { Group, Title, useMantineTheme } from '@mantine/core';
import { Stepper } from '@ui/Stepper';
import { TEXTS, variables } from '@config';
import { PhasesEum } from '@types';

interface IHeadingProps {
  active: PhasesEum;
  title?: string;
}

const Steps = [
  {
    label: TEXTS.STEPS.UPLOAD,
  },
  {
    label: TEXTS.STEPS.MAPPING,
  },
  {
    label: TEXTS.STEPS.REVIEW,
  },
  {
    label: TEXTS.STEPS.COMPLETE,
  },
];

export function Heading({ active, title }: IHeadingProps) {
  const theme = useMantineTheme();

  return (
    <Group style={{ justifyContent: 'space-between' }} mb="lg">
      <Title order={3}>{title}</Title>
      <Stepper active={active} steps={Steps} primaryColor={theme.colors.primary[variables.colorIndex]} />
    </Group>
  );
}

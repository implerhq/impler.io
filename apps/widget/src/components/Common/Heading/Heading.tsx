import { Group, MediaQuery, Title, useMantineTheme } from '@mantine/core';
import { Stepper } from '@ui/Stepper';
import { TEXTS, variables } from '@config';
import { PhasesEnum } from '@types';

interface IHeadingProps {
  active: PhasesEnum;
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
    <MediaQuery smallerThan="md" styles={{ display: 'none' }}>
      {active ? (
        <Group style={{ justifyContent: 'space-between' }} mb="lg">
          <Title order={3}>{title}</Title>
          <Stepper active={active - 1} steps={Steps} primaryColor={theme.colors.primary[variables.colorIndex]} />
        </Group>
      ) : (
        <></>
      )}
    </MediaQuery>
  );
}

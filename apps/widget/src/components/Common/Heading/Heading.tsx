import { Group, Title, useMantineTheme } from '@mantine/core';
import { Stepper } from '@ui/Stepper';
import { TEXTS, variables } from '@config';
import { PhasesEum } from '@types';

interface IHeadingProps {
  active: PhasesEum;
}

const Titles = {
  [PhasesEum.UPLOAD]: TEXTS.TITLES.UPLOAD,
  [PhasesEum.MAPPING]: TEXTS.TITLES.MAPPING,
  [PhasesEum.REVIEW]: TEXTS.TITLES.REVIEW,
  [PhasesEum.COMPLETE]: TEXTS.TITLES.COMPLETE,
};

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

export function Heading(props: IHeadingProps) {
  const { active } = props;
  const theme = useMantineTheme();

  return (
    <Group style={{ justifyContent: 'space-between' }} mb="lg">
      <Title order={3}>{Titles[active]}</Title>
      <Stepper active={active} steps={Steps} primaryColor={theme.colors.primary[variables.colorIndex]} />
    </Group>
  );
}

import { Group, Title } from '@mantine/core';
import { Stepper } from '@ui/Stepper';
import { TEXTS } from '@config';
import { PhasesEum } from '@types';

interface IHeadingProps {
  active: PhasesEum;
}

const Titles = {
  [PhasesEum.UPLOAD]: TEXTS.TITLES.UPLOAD,
  [PhasesEum.MAPPING]: TEXTS.TITLES.MAPPING,
  [PhasesEum.REVIEW]: TEXTS.TITLES.REVIEW,
  [PhasesEum.CONFIRMATION]: TEXTS.TITLES.COMPLETE,
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
  const stepperDiff = 1;
  const { active } = props;

  return (
    <Group style={{ justifyContent: 'space-between' }} mb="lg">
      <Title order={3}>{Titles[active]}</Title>
      <Stepper active={active + stepperDiff} steps={Steps} />
    </Group>
  );
}

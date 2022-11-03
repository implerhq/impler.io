import { Group, Title } from '@mantine/core';
import { Stepper } from '@ui/Stepper';
import { TEXTS } from '@config';

interface IHeadingProps {
  active: number;
}

const Titles = {
  1: TEXTS.TITLES.UPLOAD,
  2: TEXTS.TITLES.MAPPING,
  3: TEXTS.TITLES.REVIEW,
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
];

export function Heading(props: IHeadingProps) {
  const { active } = props;

  return (
    <Group style={{ justifyContent: 'space-between' }} mb="lg">
      <Title order={3}>{Titles[active]}</Title>
      <Stepper active={active} steps={Steps} />
    </Group>
  );
}

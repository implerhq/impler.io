/* eslint-disable no-unused-vars */
import { Group, MediaQuery, Title, useMantineTheme } from '@mantine/core';
import { Stepper } from '@ui/Stepper';
import { TEXTS, variables } from '@config';
import { PhasesEnum } from '@types';
import { TemplateModeEnum } from '@impler/shared';

interface IHeadingProps {
  active: PhasesEnum;
  title?: string;
  mode?: string;
}

const manualImportSteps = [
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

const autoImportSteps = [
  {
    label: TEXTS.AUTOIMPORTSTEPS.CONFIGURE,
  },
  {
    label: TEXTS.AUTOIMPORTSTEPS.MAPCOLUMNS,
  },
  {
    label: TEXTS.AUTOIMPORTSTEPS.SCHEDULE,
  },
  {
    label: TEXTS.AUTOIMPORTSTEPS.CONFIRM,
  },
];

export function Heading({ active, title, mode }: IHeadingProps) {
  const theme = useMantineTheme();

  return (
    <MediaQuery smallerThan="md" styles={{ display: 'none' }}>
      {active ? (
        <Group style={{ justifyContent: 'space-between' }} mb="lg">
          <Title order={3}>{title}</Title>
          <Stepper
            active={active - 1}
            steps={mode === TemplateModeEnum.MANUAL ? manualImportSteps : autoImportSteps}
            primaryColor={theme.colors.primary[variables.colorIndex]}
          />
        </Group>
      ) : (
        <></>
      )}
    </MediaQuery>
  );
}

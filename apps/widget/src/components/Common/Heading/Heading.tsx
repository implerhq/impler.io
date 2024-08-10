import { Group, MediaQuery, Title, useMantineTheme } from '@mantine/core';
import { PhasesEnum } from '@types';
import { Stepper } from '@ui/Stepper';
import { TEXTS, variables } from '@config';
import { TemplateModeEnum } from '@impler/shared';

interface IHeadingProps {
  title?: string;
  active: PhasesEnum;
  mode?: TemplateModeEnum;
  hasImageUpload?: boolean;
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

export function Heading({ active, title, mode, hasImageUpload }: IHeadingProps) {
  const theme = useMantineTheme();

  return (
    <MediaQuery smallerThan="md" styles={{ display: 'none' }}>
      {active ? (
        <Group style={{ justifyContent: 'space-between' }} mb="lg">
          <Title order={3}>{title}</Title>
          <Stepper
            active={active - (mode === TemplateModeEnum.AUTOMATIC ? 1 : hasImageUpload ? 1 : 2)}
            steps={
              mode === TemplateModeEnum.AUTOMATIC
                ? autoImportSteps
                : hasImageUpload
                ? [
                    {
                      label: TEXTS.STEPS.IMAGE_TEMPLATE,
                    },
                    ...manualImportSteps,
                  ]
                : manualImportSteps
            }
            primaryColor={theme.colors.primary[variables.colorIndex]}
          />
        </Group>
      ) : (
        <></>
      )}
    </MediaQuery>
  );
}

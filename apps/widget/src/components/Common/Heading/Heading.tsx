import { Group, MediaQuery, Title, useMantineTheme } from '@mantine/core';
import { PhasesEnum } from '@types';
import { Stepper } from '@ui/Stepper';
import { variables } from '@config';
import { WIDGET_TEXTS } from '@impler/client';
import { TemplateModeEnum } from '@impler/shared';

interface IHeadingProps {
  title?: string;
  texts: typeof WIDGET_TEXTS;
  active: PhasesEnum;
  mode?: TemplateModeEnum;
  hasImageUpload?: boolean;
}

export function Heading({ active, title, mode, hasImageUpload, texts }: IHeadingProps) {
  const theme = useMantineTheme();
  const manualImportSteps = [
    {
      label: texts.STEPPER_TITLES.UPLOAD_FILE,
    },
    {
      label: texts.STEPPER_TITLES.MAP_COLUMNS,
    },
    {
      label: texts.STEPPER_TITLES.REVIEW_DATA,
    },
    {
      label: texts.STEPPER_TITLES.COMPLETE_IMPORT,
    },
  ];

  const autoImportSteps = [
    {
      label: texts.STEPPER_TITLES.CONFIGURE_JOB,
    },
    {
      label: texts.STEPPER_TITLES.MAP_COLUMNS,
    },
    {
      label: texts.STEPPER_TITLES.SCHEDULE_JOB,
    },
    {
      label: texts.STEPPER_TITLES.CONFIRM_JOB,
    },
  ];

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
                      label: texts.STEPPER_TITLES.GENERATE_TEMPLATE,
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

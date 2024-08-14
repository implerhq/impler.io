import { Group, MediaQuery, Title, useMantineTheme } from '@mantine/core';
import { PhasesEnum } from '@types';
import { Stepper } from '@ui/Stepper';
import { variables } from '@config';
import { TemplateModeEnum, WIDGET_TEXTS } from '@impler/shared';

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
      label: texts.STEPS?.UPLOAD,
    },
    {
      label: texts.STEPS?.MAPPING,
    },
    {
      label: texts.STEPS?.REVIEW,
    },
    {
      label: texts.STEPS?.COMPLETE,
    },
  ];

  const autoImportSteps = [
    {
      label: texts.AUTOIMPORTSTEPS?.CONFIGURE,
    },
    {
      label: texts.AUTOIMPORTSTEPS?.MAPCOLUMNS,
    },
    {
      label: texts.AUTOIMPORTSTEPS?.SCHEDULE,
    },
    {
      label: texts.AUTOIMPORTSTEPS?.CONFIRM,
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
                      label: texts.STEPS?.IMAGE_TEMPLATE,
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

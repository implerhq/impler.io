import { CloseButton, Group, MediaQuery, Title } from '@mantine/core';
import { PhasesEnum } from '@types';
import { Stepper } from '@ui/Stepper';
import { WIDGET_TEXTS } from '@impler/client';
import { TemplateModeEnum } from '@impler/shared';

interface IHeadingProps {
  title?: string;
  active: PhasesEnum;
  onClose?: () => void;
  mode?: TemplateModeEnum;
  hasImageUpload?: boolean;
  texts: typeof WIDGET_TEXTS;
}

export function Heading({ active, title, mode, hasImageUpload, texts, onClose }: IHeadingProps) {
  const manualImportSteps = [
    {
      label: texts.STEPPER_TITLES.UPLOAD_FILE,
    },
    {
      label: texts.STEPPER_TITLES.SELECT_HEADER,
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

  return active ? (
    <Group style={{ justifyContent: 'space-between' }} mb="lg">
      <Title order={3}>{title}</Title>
      <MediaQuery smallerThan="md" styles={{ display: 'none' }}>
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
        />
      </MediaQuery>
      <CloseButton onClick={onClose} />
    </Group>
  ) : null;
}

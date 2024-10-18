import { CloseButton, Group, MediaQuery, Title } from '@mantine/core';
import { FlowsEnum, PhasesEnum } from '@types';
import { Stepper } from '@ui/Stepper';
import { useAppState } from '@store/app.context';

interface IHeadingProps {
  title?: string;
  active: PhasesEnum;
  onClose?: () => void;
}

export function Heading({ active, title, onClose }: IHeadingProps) {
  const { texts, flow } = useAppState();
  const straightImportSteps = [
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

  const directEntryImportSteps = [
    {
      label: texts.STEPPER_TITLES.UPLOAD_FILE,
    },
    {
      label: texts.STEPPER_TITLES.REVIEW_EDIT,
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
          active={
            active -
            ([FlowsEnum.AUTO_IMPORT, FlowsEnum.IMAGE_IMPORT].includes(flow)
              ? 1
              : flow === FlowsEnum.MANUAL_ENTRY
              ? 0
              : 2)
          }
          steps={
            flow == FlowsEnum.AUTO_IMPORT
              ? autoImportSteps
              : flow == FlowsEnum.IMAGE_IMPORT
              ? [
                  {
                    label: texts.STEPPER_TITLES.GENERATE_TEMPLATE,
                  },
                  ...straightImportSteps,
                ]
              : flow === FlowsEnum.MANUAL_ENTRY
              ? directEntryImportSteps
              : straightImportSteps
          }
        />
      </MediaQuery>
      <CloseButton onClick={onClose} />
    </Group>
  ) : null;
}

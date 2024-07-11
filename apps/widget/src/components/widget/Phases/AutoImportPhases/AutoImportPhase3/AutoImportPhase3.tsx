import { useForm } from 'react-hook-form';
import { useDisclosure } from '@mantine/hooks';
import { Group, Text, Stack } from '@mantine/core';
const parseCronExpression = require('util/helpers/cronstrue');
import { cronExampleBadges, cronExamples } from '@config';
import { PhasesEnum } from '@types';
import { AutoImportFooter } from 'components/Common/Footer';
import { CronScheduleInputTextBoxes } from './CronScheduleInputTextBoxes';
import { CollapsibleExplanationTable } from './CollapsibleExplanationTable';
import { TooltipBadges } from './TooltipBadges';

interface IAutoImportPhase3Props {
  onNextClick: () => void;
}

type ScheduleFormValues = {
  Minute: string;
  Hour: string;
  Day: string;
  Month: string;
  Days: string;
};

export function AutoImportPhase3({ onNextClick }: IAutoImportPhase3Props) {
  const [opened, { toggle }] = useDisclosure(false);

  const { control, watch, setValue } = useForm<ScheduleFormValues>({
    defaultValues: {
      Minute: '',
      Hour: '',
      Day: '',
      Month: '*',
      Days: '*',
    },
  });

  const scheduleData = watch();

  const handleBadgeClick = (cronExpression: string) => {
    const [minute, hour, day, month, days] = cronExpression.split(' ');
    setValue('Minute', minute);
    setValue('Hour', hour);
    setValue('Day', day);
    setValue('Month', month);
    setValue('Days', days);
  };

  const getCronDescriptionfromCronExpression = (cronExpression: string): string => {
    try {
      return parseCronExpression.toString(cronExpression);
    } catch (error) {
      return '';
    }
  };

  return (
    <>
      <Stack spacing="lg" style={{ flexGrow: 1 }}>
        <Group noWrap mx="auto">
          {(Object.keys(scheduleData) as Array<keyof ScheduleFormValues>).map((key) => (
            <CronScheduleInputTextBoxes key={key} name={key as keyof ScheduleFormValues} control={control} />
          ))}
        </Group>
        <Text size="xl" fw="bolder" align="center">
          {getCronDescriptionfromCronExpression(
            `${scheduleData.Minute} ${scheduleData.Hour} ${scheduleData.Day} ${scheduleData.Month} ${scheduleData.Days}`
          )}
        </Text>
        <Group spacing="xl" mx="auto">
          <TooltipBadges badges={cronExampleBadges} onBadgeClick={handleBadgeClick} />
        </Group>
        <CollapsibleExplanationTable opened={opened} toggle={toggle} cronExamples={cronExamples} />
        <AutoImportFooter active={PhasesEnum.SCHEDULE} onPrevClick={() => {}} onNextClick={onNextClick} />
      </Stack>
    </>
  );
}

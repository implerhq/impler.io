import { useForm } from 'react-hook-form';
import { useDisclosure } from '@mantine/hooks';
import { Group, Text, Stack, Flex, Container } from '@mantine/core';
const parseCronExpression = require('util/helpers/cronstrue');
import { colors, cronExampleBadges, cronExamples, ScheduleFormValues, TEXTS } from '@config';
import { PhasesEnum } from '@types';
import { AutoImportFooter } from 'components/Common/Footer';
import { CronScheduleInputTextBox } from './CronScheduleInputTextBox';
import { CollapsibleExplanationTable } from './CollapsibleExplanationTable';
import { TooltipBadge } from './TooltipBadge';

interface IAutoImportPhase3Props {
  onNextClick: () => void;
}

export function AutoImportPhase3({ onNextClick }: IAutoImportPhase3Props) {
  const [opened, { toggle }] = useDisclosure(false);
  const { control, watch, setValue } = useForm<ScheduleFormValues>();
  const scheduleData = watch();

  const handleBadgeClick = (cronExpression: string) => {
    const [minute, hour, day, month, days] = cronExpression.split(' ');
    setValue('Minute', minute);
    setValue('Hour', hour);
    setValue('Day', day);
    setValue('Month', month);
    setValue('Days', days);
  };

  const getCronDescriptionfromCronExpression = (cronExpression: string): { description: string; isError: boolean } => {
    try {
      if (!cronExpression) {
        return { description: '', isError: false };
      }
      const description: string = parseCronExpression.toString(cronExpression);
      if (description.includes('undefined')) {
        return { description: TEXTS.INVALID_CRON.MESSAGE, isError: true };
      }

      return { description, isError: false };
    } catch (error) {
      return {
        description: TEXTS.INVALID_CRON.MESSAGE,
        isError: true,
      };
    }
  };

  const cronResult = getCronDescriptionfromCronExpression(
    `${scheduleData.Minute} ${scheduleData.Hour} ${scheduleData.Day} ${scheduleData.Month} ${scheduleData.Days}`
  );

  return (
    <>
      <Container style={{ flexGrow: 1 }} px={0}>
        <Stack spacing="lg">
          <Group noWrap mx="auto">
            <CronScheduleInputTextBox name="Minute" control={control} />
            <CronScheduleInputTextBox name="Hour" control={control} />
            <CronScheduleInputTextBox name="Day" control={control} />
            <CronScheduleInputTextBox name="Month" control={control} />
            <CronScheduleInputTextBox name="Days" control={control} />
          </Group>
          <Text color={cronResult.isError ? colors.red : ''} size="xl" fw="bolder" align="center">
            {cronResult.description}
          </Text>
          <Flex gap="lg" justify="center" wrap="wrap">
            {cronExampleBadges.map((badgeInfo, index) => (
              <TooltipBadge
                tooltipLabel={parseCronExpression.toString(badgeInfo)}
                key={index}
                badge={badgeInfo}
                onBadgeClick={handleBadgeClick}
              />
            ))}
          </Flex>
          <CollapsibleExplanationTable opened={opened} toggle={toggle} cronExamples={cronExamples} />
        </Stack>
      </Container>
      <AutoImportFooter active={PhasesEnum.SCHEDULE} onPrevClick={() => {}} onNextClick={onNextClick} />
    </>
  );
}

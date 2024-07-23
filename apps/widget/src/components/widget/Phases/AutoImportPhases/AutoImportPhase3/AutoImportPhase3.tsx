import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Group, Text, Stack, Flex, Container } from '@mantine/core';
const parseCronExpression = require('util/helpers/cronstrue');
import { colors, cronExampleBadges, cronExamples, ScheduleFormValues, defaultCronValues, TEXTS } from '@config';
import { PhasesEnum } from '@types';
import { AutoImportFooter } from 'components/Common/Footer';
import { CronScheduleInputTextBox } from './CronScheduleInputTextBox';
import { CollapsibleExplanationTable } from './CollapsibleExplanationTable';
import { TooltipBadge } from './TooltipBadge';
import { useAutoImportPhase3 } from '../hooks/AutoImportPhase3/useAutoImportPhase3';

interface IAutoImportPhase3Props {
  onNextClick: () => void;
}

export function AutoImportPhase3({ onNextClick }: IAutoImportPhase3Props) {
  const [tableOpened, setTableOpened] = useState(false);
  const { control, watch, setValue } = useForm<ScheduleFormValues>({
    defaultValues: defaultCronValues,
  });
  const scheduleData = watch();
  const [cronDescription, setCronDescription] = useState({ description: '', isError: false });
  const [focusedField, setFocusedField] = useState<keyof ScheduleFormValues | null>(null);

  const { updateUserJob } = useAutoImportPhase3({ goNext: onNextClick });

  useEffect(() => {
    const cronExpression = `${scheduleData.Minute} ${scheduleData.Hour} ${scheduleData.Day} ${scheduleData.Month} ${scheduleData.Days}`;
    const result = getCronDescriptionfromCronExpression(cronExpression);
    setCronDescription(result);
  }, []);

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

  const handleNextClick = () => {
    const cronExpression = `${scheduleData.Minute} ${scheduleData.Hour} ${scheduleData.Day} ${scheduleData.Month} ${scheduleData.Days}`;
    updateUserJob({
      cron: cronExpression,
    });
  };

  const handleFocus = (fieldName: keyof ScheduleFormValues) => {
    setFocusedField(fieldName);
    setTableOpened(true);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  const toggleTable = () => {
    if (focusedField) {
      setFocusedField(null);
    }
    setTableOpened(!tableOpened);
  };

  return (
    <>
      <Container style={{ flexGrow: 1 }} px={0}>
        <Stack spacing="lg">
          <Group noWrap mx="auto">
            <CronScheduleInputTextBox
              name="Minute"
              control={control}
              onFocus={() => handleFocus('Minute')}
              onBlur={handleBlur}
            />
            <CronScheduleInputTextBox
              name="Hour"
              control={control}
              onFocus={() => handleFocus('Hour')}
              onBlur={handleBlur}
            />
            <CronScheduleInputTextBox
              name="Day"
              control={control}
              onFocus={() => handleFocus('Day')}
              onBlur={handleBlur}
            />
            <CronScheduleInputTextBox
              name="Month"
              control={control}
              onFocus={() => handleFocus('Month')}
              onBlur={handleBlur}
            />
            <CronScheduleInputTextBox
              name="Days"
              control={control}
              onFocus={() => handleFocus('Days')}
              onBlur={handleBlur}
            />
          </Group>
          <Text color={cronDescription.isError ? colors.red : ''} size="xl" fw="bolder" align="center">
            {cronDescription.description}
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
          <CollapsibleExplanationTable
            opened={tableOpened}
            toggle={toggleTable}
            cronExamples={cronExamples}
            focusedField={focusedField}
          />
        </Stack>
      </Container>
      <AutoImportFooter active={PhasesEnum.SCHEDULE} onPrevClick={() => {}} onNextClick={handleNextClick} />
    </>
  );
}

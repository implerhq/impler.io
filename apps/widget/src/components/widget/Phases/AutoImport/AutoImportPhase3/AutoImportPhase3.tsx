import { useState, useEffect } from 'react';
import { Group, Text, Stack, Tabs, Radio, Container } from '@mantine/core';
import { Controller, useForm } from 'react-hook-form';
import { PhasesEnum, RecurrenceFormData } from '@types';
import { DatePickerInput } from '@mantine/dates';
import { IUserJob } from '@impler/shared';
import { WIDGET_TEXTS } from '@impler/client';
import { Footer } from 'components/Common/Footer';
import { useAutoImportPhase3 } from '@hooks/AutoImportPhase3/useAutoImportPhase3';
const parseCronExpression = require('@impler/shared/src/utils/cronstrue');
import { autoImportSchedulerFrequency, AUTOIMPORTSCHEDULERFREQUENCY, colors } from '@config';
import { SchedulerFrequency } from './SchedularFrequency';
import useStyles from './AutoImportPhase3.Styles';

import { generateCronExpression, getFormattedFirstRunTime } from 'util/helpers/common.helpers';

interface IAutoImportPhase3Props {
  onNextClick: (importJob: IUserJob) => void;
  texts: typeof WIDGET_TEXTS;
}

const getDefaultValuesForFrequency = (frequency: AUTOIMPORTSCHEDULERFREQUENCY): Partial<RecurrenceFormData> => {
  const baseDefaults = {
    recurrenceType: frequency,
    endsNever: true,
    endsOn: undefined,
  };

  switch (frequency) {
    case AUTOIMPORTSCHEDULERFREQUENCY.DAILY:
      return {
        ...baseDefaults,
        dailyType: 'every',
        dailyFrequency: 1,
      };
    case AUTOIMPORTSCHEDULERFREQUENCY.WEEKLY:
      return {
        ...baseDefaults,
        frequency: 1,
        selectedDays: [],
      };
    case AUTOIMPORTSCHEDULERFREQUENCY.MONTHLY:
      return {
        ...baseDefaults,
        frequency: 1,
        monthlyType: 'onDay',
        monthlyDayNumber: 1,
        monthlyDayPosition: 'First',
        monthlyDayOfWeek: 'Monday',
      };
    case AUTOIMPORTSCHEDULERFREQUENCY.YEARLY:
      return {
        ...baseDefaults,
        yearlyMonth: 'January',
        yearlyType: 'onDay',
        yearlyDayNumber: 1,
        yearlyDayPosition: 'First',
        yearlyDayOfWeek: 'Monday',
      };
    default:
      return baseDefaults;
  }
};

export function AutoImportPhase3({ onNextClick }: IAutoImportPhase3Props) {
  const { classes } = useStyles();

  const [cronExpression, setCronExpression] = useState<string>();

  const { control, watch, reset } = useForm<RecurrenceFormData>({
    defaultValues: getDefaultValuesForFrequency(AUTOIMPORTSCHEDULERFREQUENCY.DAILY),
  });

  const { updateUserJob, isUpdateUserJobLoading } = useAutoImportPhase3({
    onImportJobCreate: onNextClick,
  });

  const formValues = watch();

  const handleTabChange = (newFrequency: AUTOIMPORTSCHEDULERFREQUENCY) => {
    reset(getDefaultValuesForFrequency(newFrequency));
  };

  useEffect(() => {
    const newCronExpression = generateCronExpression(formValues);
    setCronExpression(newCronExpression);
  }, [formValues]);

  const handleNextClick = () => {
    const currentCronExpression = generateCronExpression(formValues);
    updateUserJob({
      cron: currentCronExpression || cronExpression,
      endsOn: formValues.endsNever ? undefined : formValues.endsOn,
    });
  };

  return (
    <>
      <Container style={{ flexGrow: 1 }} px={0}>
        <Stack p="sm" className={classes.stack}>
          <form style={{ flexFlow: '1' }}>
            <Controller
              name="recurrenceType"
              control={control}
              render={({ field }) => (
                <Tabs
                  value={field.value}
                  onTabChange={(val) => {
                    field.onChange(val);
                    handleTabChange(val as AUTOIMPORTSCHEDULERFREQUENCY);
                  }}
                  classNames={{ tab: classes.tab }}
                >
                  <Tabs.List>
                    {autoImportSchedulerFrequency.map((type) => (
                      <Tabs.Tab key={type} value={type}>
                        <Text size="md">{type.charAt(0).toUpperCase() + type.slice(1)}</Text>
                      </Tabs.Tab>
                    ))}
                  </Tabs.List>

                  {autoImportSchedulerFrequency.map((schedularFrequency) => (
                    <Tabs.Panel key={schedularFrequency} value={schedularFrequency}>
                      <SchedulerFrequency
                        autoImportFrequency={schedularFrequency as AUTOIMPORTSCHEDULERFREQUENCY}
                        control={control}
                      />
                    </Tabs.Panel>
                  ))}
                </Tabs>
              )}
            />
            <Stack>
              <Controller
                name="endsNever"
                control={control}
                render={({ field }) => (
                  <Radio.Group value={field.value ? 'never' : 'on'} onChange={(val) => field.onChange(val === 'never')}>
                    <Stack mt="sm">
                      <Radio
                        value="never"
                        label={<span style={{ color: colors.StrokeLight, fontWeight: 400 }}>Never ends</span>}
                      />
                      <Radio
                        value="on"
                        label={
                          <Group align="center">
                            <span>Ends on</span>
                            {!field.value && (
                              <Controller
                                name="endsOn"
                                control={control}
                                render={({ field: dateField }) => (
                                  <DatePickerInput
                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                    //@ts-ignore
                                    placeholder="End Date"
                                    value={dateField.value ? new Date(dateField.value) : null}
                                    onChange={(date) => dateField.onChange(date?.toISOString())}
                                    minDate={new Date()}
                                    clearable
                                    maw={400}
                                  />
                                )}
                              />
                            )}
                          </Group>
                        }
                      />
                    </Stack>
                  </Radio.Group>
                )}
              />

              <Stack spacing="xl">
                {cronExpression && (
                  <Stack spacing="xs">
                    <Text fw="bolder" color={colors.StrokeLight}>
                      First import will run: {getFormattedFirstRunTime()}
                    </Text>
                    <Text fw="normal" color={colors.StrokeLight} size="sm">
                      Then repeats: {parseCronExpression.toString(cronExpression)}
                    </Text>
                  </Stack>
                )}
              </Stack>
            </Stack>
          </form>
        </Stack>
      </Container>
      <Footer
        active={PhasesEnum.SCHEDULE}
        onNextClick={handleNextClick}
        primaryButtonLoading={isUpdateUserJobLoading}
      />
    </>
  );
}

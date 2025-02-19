import { Stack, Group, Radio, Select, NumberInput, Checkbox, Flex, useMantineTheme } from '@mantine/core';
import { Control, Controller } from 'react-hook-form';
import {
  AUTOIMPORTSCHEDULERFREQUENCY,
  weekDays,
  months,
  colors,
  monthlyDayPositions,
  yearlyDayPositions,
} from '@config';
import { RecurrenceFormData } from 'types/component.types';

interface SchedulerFrequencyProps {
  autoImportFrequency: AUTOIMPORTSCHEDULERFREQUENCY;
  control: Control<RecurrenceFormData>;
}

export function SchedulerFrequency({ autoImportFrequency, control }: SchedulerFrequencyProps) {
  const theme = useMantineTheme();

  const renderDailyTab = () => (
    <Stack mt="lg" spacing="sm">
      <Controller
        name="dailyType"
        control={control}
        defaultValue="every"
        render={({ field }) => (
          <Radio.Group {...field} onChange={(val) => field.onChange(val)}>
            <Stack spacing="lg">
              <Radio
                value="every"
                label={
                  <Group align="center" spacing="xs">
                    <span style={{ color: colors.StrokeLight, fontWeight: 400 }}>Every</span>
                    <Controller
                      name="dailyFrequency"
                      control={control}
                      defaultValue={1}
                      render={({ field: freqField }) => (
                        <NumberInput
                          {...freqField}
                          min={0}
                          max={31}
                          style={{ width: 80 }}
                          onChange={(val) => freqField.onChange(val)}
                        />
                      )}
                    />
                    <span style={{ color: colors.StrokeLight, fontWeight: 400 }}>day(s) once</span>
                  </Group>
                }
              />
              <Radio
                value="weekdays"
                label={
                  <span style={{ color: colors.StrokeLight, fontWeight: theme.fontSizes.xl }}>Week days only</span>
                }
              />
            </Stack>
          </Radio.Group>
        )}
      />
    </Stack>
  );

  const renderWeeklyTab = () => (
    <Stack mt="lg" spacing="md">
      <Controller
        name="frequency"
        control={control}
        defaultValue={1}
        render={({ field: frequencyField }) => (
          <Controller
            name="selectedDays"
            control={control}
            defaultValue={[]}
            render={({ field: selectedDaysField }) => (
              <Group align="center">
                <span style={{ color: colors.StrokeLight, fontWeight: 400 }}>Every</span>
                <NumberInput
                  {...frequencyField}
                  min={1}
                  max={5}
                  style={{ width: 80 }}
                  onChange={(val: number | '') => {
                    const numValue = typeof val === 'number' ? val : 1;
                    frequencyField.onChange(numValue);
                    if (numValue > 1) {
                      selectedDaysField.onChange([]);
                    }
                  }}
                  disabled={(selectedDaysField.value?.length ?? 0) > 0}
                />
                <span style={{ color: colors.StrokeLight, fontWeight: 400 }}>week(s) once</span>
              </Group>
            )}
          />
        )}
      />
      <Flex gap="md" wrap="wrap">
        {weekDays.map((weekDay) => (
          <Controller
            key={weekDay.full}
            name="selectedDays"
            control={control}
            defaultValue={[]}
            render={({ field: selectedDaysField }) => (
              <Controller
                name="frequency"
                control={control}
                render={({ field: frequencyField }) => (
                  <Checkbox
                    style={{}}
                    label={weekDay.short}
                    checked={selectedDaysField.value?.includes(weekDay.full) ?? false}
                    disabled={Number(frequencyField.value) > 1}
                    onChange={(event) => {
                      const isChecked = event.currentTarget.checked;
                      const currentSelectedDays = selectedDaysField.value ?? [];
                      const updatedDays = isChecked
                        ? [...currentSelectedDays, weekDay.full]
                        : currentSelectedDays.filter((day: string) => day !== weekDay.full);

                      selectedDaysField.onChange(updatedDays);
                      if (updatedDays.length > 0) {
                        frequencyField.onChange(1);
                      }
                    }}
                  />
                )}
              />
            )}
          />
        ))}
      </Flex>
    </Stack>
  );

  const renderMonthlyTab = () => (
    <Stack mt="lg" spacing="md">
      <Controller
        name="frequency"
        control={control}
        defaultValue={1}
        render={({ field }) => (
          <Group align="center">
            <span style={{ color: colors.StrokeLight, fontWeight: 400 }}>Every</span>
            <NumberInput {...field} min={1} max={12} style={{ width: 80 }} onChange={(val) => field.onChange(val)} />
            <span style={{ color: colors.StrokeLight, fontWeight: 400 }}>month(s) once</span>
          </Group>
        )}
      />
      <Controller
        name="monthlyType"
        control={control}
        defaultValue="onDay"
        render={({ field }) => (
          <Radio.Group {...field} onChange={(val) => field.onChange(val)}>
            <Stack>
              <Radio
                value="onDay"
                label={
                  <Group align="center">
                    <span style={{ color: colors.StrokeLight, fontWeight: 400 }}>On day</span>
                    <Controller
                      name="monthlyDayNumber"
                      control={control}
                      defaultValue={1}
                      render={({ field: dayField }) => (
                        <NumberInput
                          {...dayField}
                          min={1}
                          max={31}
                          style={{ width: 80 }}
                          onChange={(val) => dayField.onChange(val)}
                        />
                      )}
                    />
                  </Group>
                }
              />
              <Radio
                value="onThe"
                label={
                  <Group align="center">
                    <span style={{ color: colors.StrokeLight, fontWeight: 400 }}>On the</span>
                    <Controller
                      name="monthlyDayPosition"
                      control={control}
                      defaultValue="First"
                      render={({ field: posField }) => (
                        <Select
                          {...posField}
                          data={monthlyDayPositions.map((monthlyDayPosition) => monthlyDayPosition)}
                          style={{ width: 120 }}
                          onChange={(val) => posField.onChange(val)}
                        />
                      )}
                    />
                    <Controller
                      name="monthlyDayOfWeek"
                      control={control}
                      defaultValue="Monday"
                      render={({ field: dayField }) => (
                        <Select
                          {...dayField}
                          data={weekDays.map((weekDay) => weekDay.full)}
                          style={{ width: 120 }}
                          onChange={(val) => dayField.onChange(val)}
                        />
                      )}
                    />
                  </Group>
                }
              />
            </Stack>
          </Radio.Group>
        )}
      />
    </Stack>
  );

  const renderYearlyTab = () => (
    <Stack mt="lg" spacing="md">
      <Controller
        name="yearlyMonth"
        control={control}
        defaultValue="January"
        render={({ field }) => (
          <Group align="center">
            <span style={{ color: colors.StrokeLight, fontWeight: 400 }}>Every</span>
            <Select {...field} data={months} style={{ width: 120 }} onChange={(val) => field.onChange(val)} />
          </Group>
        )}
      />
      <Controller
        name="yearlyType"
        control={control}
        defaultValue="onDay"
        render={({ field }) => (
          <Radio.Group {...field} onChange={(val) => field.onChange(val)}>
            <Stack>
              <Radio
                value="onDay"
                label={
                  <>
                    <Group align="center">
                      <span style={{ color: colors.StrokeLight, fontWeight: 400 }}>On day</span>
                      <Controller
                        name="yearlyDayNumber"
                        control={control}
                        defaultValue={1}
                        render={({ field: dayField }) => (
                          <NumberInput
                            {...dayField}
                            min={1}
                            max={31}
                            style={{ width: 80 }}
                            onChange={(val) => dayField.onChange(val)}
                          />
                        )}
                      />
                    </Group>
                  </>
                }
              />
              <Radio
                value="onThe"
                label={
                  <Group align="center">
                    <span>On the</span>
                    <Controller
                      name="yearlyDayPosition"
                      control={control}
                      defaultValue="First"
                      render={({ field: posField }) => (
                        <Select
                          {...posField}
                          data={yearlyDayPositions.map((yearlyDayPosition) => yearlyDayPosition)}
                          style={{ width: 120 }}
                          onChange={(val) => posField.onChange(val)}
                        />
                      )}
                    />
                    <Controller
                      name="yearlyDayOfWeek"
                      control={control}
                      defaultValue="Monday"
                      render={({ field: dayField }) => (
                        <Select
                          {...dayField}
                          data={weekDays.map((weekDay) => weekDay.full)}
                          style={{ width: 120 }}
                          onChange={(val) => dayField.onChange(val)}
                        />
                      )}
                    />
                  </Group>
                }
              />
            </Stack>
          </Radio.Group>
        )}
      />
    </Stack>
  );

  switch (autoImportFrequency) {
    case AUTOIMPORTSCHEDULERFREQUENCY.DAILY:
      return renderDailyTab();
    case AUTOIMPORTSCHEDULERFREQUENCY.WEEKLY:
      return renderWeeklyTab();
    case AUTOIMPORTSCHEDULERFREQUENCY.MONTHLY:
      return renderMonthlyTab();
    case AUTOIMPORTSCHEDULERFREQUENCY.YEARLY:
      return renderYearlyTab();
    default:
      return null;
  }
}

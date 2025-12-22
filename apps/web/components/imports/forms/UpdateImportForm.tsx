import { useEffect } from 'react';
import { Stack, TextInput as Input, Text, SegmentedControl, Box, Group, Flex } from '@mantine/core';
import { LockIcon } from '@assets/icons/Lock.icon';
import { useForm, Controller } from 'react-hook-form';
import { useFocusTrap } from '@mantine/hooks';

import { Button } from '@ui/button';
import { ITemplate, TemplateModeEnum } from '@impler/shared';
import { ImportConfigEnum } from '@types';
import { SAMPLE_DATE_FORMATS, VARIABLES } from '@config';
import { MultiSelect } from '@ui/multi-select';
import { validateDateFormatString } from '@shared/utils';

interface UpdateImportFormProps {
  data: ITemplate;
  onSubmit: (data: IUpdateTemplateData) => void;
  isAutoImportAvailable: boolean;
}

export function UpdateImportForm({ onSubmit, data, isAutoImportAvailable }: UpdateImportFormProps) {
  const focusTrapRef = useFocusTrap();
  const {
    reset,
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IUpdateTemplateData>();

  useEffect(() => {
    reset({
      name: data.name,
      mode: data.mode || TemplateModeEnum.MANUAL,
      expectedDateFormat: data.expectedDateFormat,
    });
  }, [data, reset]);

  const handleFormSubmit = (formData: IUpdateTemplateData) => {
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} ref={focusTrapRef}>
      <Stack spacing="lg">
        <Input
          autoFocus
          required
          label="Import Name"
          {...register('name')}
          error={errors.name?.message}
          placeholder="I want to import..."
          description="A descriptive name for this import"
        />

        <Box>
          <Text size="sm" weight={500} mb={4}>
            Import Mode
          </Text>
          <Text size="xs" color="dimmed" mb="xs">
            Choose whether this import is triggered manually or automatically
          </Text>
          <Controller
            name="mode"
            control={control}
            render={({ field }) => (
              <SegmentedControl
                fullWidth
                value={field.value || ImportConfigEnum.MANUAL}
                onChange={field.onChange}
                data={[
                  { label: 'Manual', value: ImportConfigEnum.MANUAL },
                  {
                    value: ImportConfigEnum.AUTOMATED,
                    disabled: !isAutoImportAvailable,
                    label: (
                      <Group position="center" spacing={4}>
                        {!isAutoImportAvailable && (
                          <Flex>
                            <LockIcon size="md" />
                          </Flex>
                        )}
                        Automatic
                      </Group>
                    ),
                  },
                ]}
              />
            )}
          />
        </Box>

        <Box>
          <Controller
            name="expectedDateFormat"
            control={control}
            rules={{
              validate: (value) => {
                if (!value) return true;

                const result = validateDateFormatString(value as string);
                if (typeof result === 'object' && 'isValid' in result) {
                  return result.isValid ? true : result.error || 'Invalid date format';
                }

                return result === true ? true : (result as string);
              },
            }}
            render={({ field, fieldState }) => (
              <MultiSelect
                creatable
                maxSelectedValues={VARIABLES.ONE}
                clearable
                searchable
                label="Date Formats"
                placeholder="Date Formats"
                description="Define the date format you expect in your import data."
                data={[
                  ...SAMPLE_DATE_FORMATS,
                  ...(field.value && !SAMPLE_DATE_FORMATS.includes(field.value) ? [field.value] : []),
                ]}
                getCreateLabel={(query) => `Add "${query}"`}
                onCreate={(newItem) => {
                  field.onChange(newItem);

                  return newItem;
                }}
                onChange={(value) => {
                  field.onChange(value[0]);
                }}
                error={fieldState.error?.message}
                value={field.value ? [field.value] : []}
              />
            )}
          />
          <Text size="xs" color="dimmed" mt="xs">
            Example formats: DD/MM/YYYY, MM/DD/YYYY, YYYY-MM-DD, DD-MMM-YYYY
          </Text>
        </Box>

        <Button type="submit" fullWidth mt="md">
          Update
        </Button>
      </Stack>
    </form>
  );
}

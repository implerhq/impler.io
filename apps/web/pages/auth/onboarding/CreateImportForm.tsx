// Quick fix: Reduce padding in CreateImportForm
import { Controller, useForm, Control, UseFormSetError, FieldErrors, UseFormResetField } from 'react-hook-form';
import { Title, Stack, TextInput, Radio, Flex, Box, FocusTrap } from '@mantine/core';
import { Button } from '@ui/button';
import { colors, PLACEHOLDERS } from '@config';
import { IntegrationEnum } from '@impler/shared';
import ImportColumnsSection from './ImportColumnsSection';
import { Stepper } from '@components/Stepper/Stepper';

interface CreateImportFormProps {
  onSubmit: (data: CreateOnboardImportFormData) => void;
  isLoading?: boolean;
  control: Control<CreateOnboardImportFormData>;
  errors: FieldErrors<CreateOnboardImportFormData>;
  setError: UseFormSetError<CreateOnboardImportFormData>;
  resetField: UseFormResetField<CreateOnboardImportFormData>;
  handleSubmit: ReturnType<typeof useForm<CreateOnboardImportFormData>>['handleSubmit'];
}

export function CreateImportForm({
  onSubmit,
  isLoading,
  control,
  errors,
  setError,
  handleSubmit,
}: CreateImportFormProps) {
  return (
    <>
      <Stepper currentStep={3} totalSteps={3} />
      <Title mb="md">Get Your First Import</Title>
      <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
        <FocusTrap active>
          <Stack spacing="xs" align="left">
            <Controller
              name="importName"
              control={control}
              rules={{
                required: 'Import name is required',
                validate: {
                  noSpaces: (value) => value.trim().length > 0 || 'Import name cannot be empty or contain only spaces',
                },
              }}
              render={({ field }) => (
                <TextInput
                  required
                  label="Import Name"
                  placeholder={PLACEHOLDERS.importName}
                  error={errors.importName?.message}
                  {...field}
                />
              )}
            />

            <Controller
              name="importIntegration"
              control={control}
              rules={{ required: 'Integration is required' }}
              render={({ field }) => (
                <Radio.Group
                  name="integration"
                  label="Where do you want to integrate importer?"
                  required
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  error={errors.importIntegration?.message as string}
                >
                  <Flex gap="sm" wrap="wrap">
                    {Object.keys(IntegrationEnum).map((key) => {
                      const value = IntegrationEnum[key as keyof typeof IntegrationEnum];

                      return (
                        <Box
                          key={key}
                          p="xs"
                          sx={() => ({
                            border: `1px solid ${colors.darkGrey}`,
                          })}
                        >
                          <Radio name="integration" value={value} label={value} />
                        </Box>
                      );
                    })}
                  </Flex>
                </Radio.Group>
              )}
            />

            <ImportColumnsSection control={control} setError={setError} errors={errors} />
            <Button type="submit" fullWidth loading={isLoading}>
              Create and Check Import
            </Button>
          </Stack>
        </FocusTrap>
      </form>
    </>
  );
}

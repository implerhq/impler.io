import { Controller, useForm, Control, UseFormSetError, FieldErrors, UseFormResetField } from 'react-hook-form';
import { Title, Stack, TextInput, Radio, Flex, Box, FocusTrap, Text } from '@mantine/core';
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

export default function CreateImportForm({
  onSubmit,
  isLoading,
  control,
  errors,
  setError,
  handleSubmit,
}: CreateImportFormProps) {
  return (
    <>
      <Flex justify="space-between" align="flex-start" mb="sm">
        <Box>
          <Title order={1} color="white" mb={0}>
            Get Your First Import
          </Title>
        </Box>
        <Box>
          <Stepper currentStep={2} totalSteps={2} />
        </Box>
      </Flex>
      <Text size="xs" color="dimmed" mb="md">
        You&apos;re 1 step away from seeing Impler in action. Upload a file or use a sample to generate columns
        automatically.
      </Text>
      <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
        <FocusTrap active>
          <Stack spacing="xs" align="left">
            <Controller
              name="importName"
              defaultValue="Product's Import"
              control={control}
              rules={{
                required: 'Import name is required',
                validate: {
                  noSpaces: (value) => value.trim().length > 0 || 'Import name cannot be empty or contain only spaces',
                },
              }}
              render={({ field }) => (
                <TextInput
                  description="This name helps you identify imports later."
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
                  hidden
                  name="integration"
                  label="Where do you want to integrate importer?"
                  required
                  value={IntegrationEnum.REACT}
                  // value={field.value}
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
              Generate Importer
            </Button>
          </Stack>
        </FocusTrap>
      </form>
    </>
  );
}

import { Stack, SegmentedControl, Box, Text } from '@mantine/core';
import { Control, Controller, FieldErrors, UseFormSetError } from 'react-hook-form';
import { UploadDropzone } from '@ui/UploadDropzone';
import { WIDGET_TEXTS } from '@impler/client';
import { OnboardCreateTemplateModeEnum } from '@impler/shared';
import { useTemplateSchema } from '@hooks/useTemplateSchema';
import OnboardTemplateSchemaTable from './OnboardTemplateSchemaTable';
import SampleColumnsTable from './SampleColumnsTable';

interface ImportColumnsSectionProps {
  control: Control<CreateOnboardImportFormData>;
  setError: UseFormSetError<CreateOnboardImportFormData>;
  errors: FieldErrors<CreateOnboardImportFormData>;
}

export default function ImportColumnsSection({ control, setError, errors }: ImportColumnsSectionProps) {
  const { getTemplateFileSchema, isTemplateSampleLoading: isLoading, templateSchema } = useTemplateSchema({ setError });

  const renderContent = (mode: OnboardCreateTemplateModeEnum = OnboardCreateTemplateModeEnum.FILE_MAP_COLUMN) => {
    if (mode === OnboardCreateTemplateModeEnum.FILE_MAP_COLUMN) {
      return (
        <Controller
          name="file"
          control={control}
          render={({ field, fieldState }) => (
            <Stack spacing="lg">
              {templateSchema && templateSchema.length > 0 ? (
                <Stack spacing="xs">
                  <OnboardTemplateSchemaTable data={templateSchema} />
                </Stack>
              ) : (
                <>
                  <UploadDropzone
                    onDrop={(selectedFiles) => {
                      const file = selectedFiles[0];
                      field.onChange(file);
                      getTemplateFileSchema(file);
                    }}
                    onReject={() => {
                      setError('file', {
                        type: 'manual',
                        message: errors.file?.message,
                      });
                    }}
                    texts={WIDGET_TEXTS}
                    error={fieldState.error?.message}
                    loading={isLoading}
                  />
                  <Text size="sm" align="center">
                    Your file won&apos;t be stored anywhere. You can edit, and delete columns on the import details
                    page.
                  </Text>
                </>
              )}
            </Stack>
          )}
        />
      );
    } else {
      return <SampleColumnsTable />;
    }
  };

  return (
    <Stack spacing={1}>
      <Controller
        name="onboardCreateTemplateMode"
        control={control}
        render={({ field }) => (
          <>
            <SegmentedControl
              value={field.value}
              onChange={(value: string) => field.onChange(value as OnboardCreateTemplateModeEnum)}
              data={[
                { label: 'Choose a File', value: OnboardCreateTemplateModeEnum.FILE_MAP_COLUMN },
                { label: 'Use Sample Columns', value: OnboardCreateTemplateModeEnum.SAMPLE_COLUMN },
              ]}
              fullWidth
            />

            <Box mt="md">{renderContent(field.value as OnboardCreateTemplateModeEnum)}</Box>
          </>
        )}
      />
    </Stack>
  );
}

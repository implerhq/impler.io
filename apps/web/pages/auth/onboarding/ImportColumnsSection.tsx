import { Stack, SegmentedControl, Box, List, Text } from '@mantine/core';
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
            <Stack spacing="md">
              {templateSchema && templateSchema.length > 0 ? (
                <Stack spacing="md">
                  <OnboardTemplateSchemaTable data={templateSchema} />
                  <List spacing="xs">
                    <List.Item>
                      <Text size="md">You will be able to Edit and delete Columns in Next Step</Text>
                    </List.Item>
                    <List.Item>
                      <Text size="md">Your filewon&apos;t be stored anywhere</Text>
                    </List.Item>
                  </List>
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

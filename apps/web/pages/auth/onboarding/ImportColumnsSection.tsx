import { Stack, SegmentedControl, Box, Text, Flex } from '@mantine/core';
import { Control, Controller, FieldErrors, UseFormSetError } from 'react-hook-form';
import { UploadDropzone } from '@ui/UploadDropzone';
import { WIDGET_TEXTS } from '@impler/client';
import { OnboardCreateTemplateModeEnum } from '@impler/shared';
import { useTemplateSchema } from '@hooks/useTemplateSchema';
import OnboardTemplateSchemaTable from './OnboardTemplateSchemaTable';
import SampleColumnsTable from './SampleColumnsTable';
import { colors } from '@config';
import { InformationIcon } from '@assets/icons/Information.icon';

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
            <Stack spacing="xl">
              {templateSchema && templateSchema.length > 0 ? (
                <Stack spacing="md">
                  <Box
                    style={{
                      maxHeight: '250px',
                      overflowY: 'auto',
                      border: '1px solid #373A40',
                      borderRadius: '4px',
                    }}
                  >
                    <OnboardTemplateSchemaTable data={templateSchema} />
                  </Box>
                  <Flex gap="xs">
                    <InformationIcon size="md" color={colors.yellow} />
                    <Text color="dimmed">You will be able to Edit and delete Columns in Next Step</Text>
                  </Flex>
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
      return (
        <Box
          style={{
            overflowY: 'auto',
            height: '200px',
          }}
        >
          <SampleColumnsTable />
        </Box>
      );
    }
  };

  return (
    <Stack spacing="sm">
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

            <Box>{renderContent(field.value as OnboardCreateTemplateModeEnum)}</Box>
          </>
        )}
      />
    </Stack>
  );
}

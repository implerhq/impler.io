import { IColumn, IntegrationEnum, OnboardCreateTemplateModeEnum } from '@impler/shared';
import { CreateImportForm } from './CreateImportForm';
import { useForm } from 'react-hook-form';
import { useTemplateSchema } from '@hooks/useTemplateSchema';
import { useAppState } from 'store/app.context';
import { CONSTANTS, sampleColumns } from '@config';

export default function OnboardImportForm() {
  const { profileInfo } = useAppState();

  const {
    handleSubmit,
    formState: { errors },
    control,
    setError,
    resetField,
  } = useForm<CreateOnboardImportFormData>({
    defaultValues: {
      importIntegration: IntegrationEnum.REACT,
      onboardCreateTemplateMode: OnboardCreateTemplateModeEnum.FILE_MAP_COLUMN,
    },
  });

  const { createOnboardTemplateSample, isCreateOnboardTemplateSampleLoading, getTemplateFileSchema } =
    useTemplateSchema({});

  const handleCreateImportFormSubmit = async (createImportFormData: CreateOnboardImportFormData) => {
    if (createImportFormData.onboardCreateTemplateMode === OnboardCreateTemplateModeEnum.SAMPLE_COLUMN) {
      createOnboardTemplateSample({
        name: CONSTANTS.SAMPLE_IMPORT_NAME,
        _projectId: profileInfo!._projectId,
        columns: sampleColumns as IColumn[],
      });
    }
    if (createImportFormData.onboardCreateTemplateMode === OnboardCreateTemplateModeEnum.FILE_MAP_COLUMN) {
      const templateSchemaColumns = await getTemplateFileSchema(createImportFormData.file || null);
      createOnboardTemplateSample({
        name: createImportFormData.importName,
        _projectId: profileInfo!._projectId,
        columns: templateSchemaColumns?.length ? templateSchemaColumns.map((item) => ({ ...item })) : [],
      });
    }
  };

  return (
    <CreateImportForm
      onSubmit={handleCreateImportFormSubmit}
      isLoading={isCreateOnboardTemplateSampleLoading}
      control={control}
      errors={errors}
      setError={setError}
      resetField={resetField}
      handleSubmit={handleSubmit}
    />
  );
}

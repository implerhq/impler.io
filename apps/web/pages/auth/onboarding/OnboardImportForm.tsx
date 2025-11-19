import { IColumn, IntegrationEnum, OnboardCreateTemplateModeEnum } from '@impler/shared';
import CreateImportForm from './CreateImportForm';
import { useForm } from 'react-hook-form';
import { useTemplateSchema } from '@hooks/useTemplateSchema';
import { useAppState } from 'store/app.context';
import { CONSTANTS, sampleColumns } from '@config';
import { useLocalStorage } from '@mantine/hooks';

export default function OnboardImportForm() {
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const [_, setShowWelcome] = useLocalStorage<boolean>({
    key: CONSTANTS.SHOW_WELCOME_IMPORTER_STORAGE_KEY,
    defaultValue: true,
  });

  const { profileInfo } = useAppState();

  const {
    handleSubmit,
    formState: { errors },
    control,
    setError,
    resetField,
  } = useForm<CreateOnboardImportFormData>({
    defaultValues: {
      importName: 'Product Import',
      importIntegration: IntegrationEnum.REACT,
      onboardCreateTemplateMode: OnboardCreateTemplateModeEnum.FILE_MAP_COLUMN,
    },
  });

  const { createOnboardTemplateSample, isCreateOnboardTemplateSampleLoading, getTemplateFileSchema } =
    useTemplateSchema({});

  const handleCreateImportFormSubmit = async (createImportFormData: CreateOnboardImportFormData) => {
    if (createImportFormData.onboardCreateTemplateMode === OnboardCreateTemplateModeEnum.SAMPLE_COLUMN) {
      createOnboardTemplateSample({
        name: createImportFormData.importName || CONSTANTS.SAMPLE_IMPORT_NAME,
        _projectId: profileInfo!._projectId,
        columns: sampleColumns as IColumn[],
      });
      setShowWelcome(true);
    }
    if (createImportFormData.onboardCreateTemplateMode === OnboardCreateTemplateModeEnum.FILE_MAP_COLUMN) {
      const templateSchemaColumns = await getTemplateFileSchema(createImportFormData.file || null);
      createOnboardTemplateSample({
        name: createImportFormData.importName,
        _projectId: profileInfo!._projectId,
        columns: templateSchemaColumns?.length ? templateSchemaColumns.map((item) => ({ ...item })) : [],
      });
      setShowWelcome(true);
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

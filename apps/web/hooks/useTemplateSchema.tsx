import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { commonApi } from '@libs/api';
// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
import { API_KEYS, ROUTES, VARIABLES } from '@config';
import { IColumn, IErrorObject, ITemplate, ITemplateSchema } from '@impler/shared';
import { UseFormSetError } from 'react-hook-form';
import { useAppState } from 'store/app.context';
import { useRouter } from 'next/router';
import { useLocalStorage } from '@mantine/hooks';

interface UseTemplateSchemaProps {
  setError?: UseFormSetError<CreateOnboardImportFormData>;
}

export function useTemplateSchema({ setError }: UseTemplateSchemaProps) {
  const [templateSchema, setTemplateSchema] = useState<OnboardTemplateSchemaTable[]>();
  const { profileInfo } = useAppState();
  const { push } = useRouter();
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const [showWelcome, setShowWelcome] = useLocalStorage<boolean>({
    key: 'SHOW_WELCOME_IMPORTER_STORAGE_KEY',
    defaultValue: true,
  });

  const {
    data: templateSampleData,
    mutateAsync: getTemplateFileSchema,
    isLoading: isTemplateSampleLoading,
  } = useMutation<ITemplateSchema[], IErrorObject, File | null>(
    [API_KEYS.TEMPLATE_SCHEMA_GET],
    async (file) => {
      if (!file) return [];
      const formData = new FormData();
      formData.append('file', file);

      return commonApi<ITemplateSchema[]>(API_KEYS.TEMPLATE_SCHEMA_GET as any, { body: formData });
    },
    {
      onSuccess: (data) => {
        const templateSchemaData: OnboardTemplateSchemaTable[] = data?.map((item) => ({
          name: item.name,
          type: item.type,
        }));

        setTemplateSchema(templateSchemaData);
        if (setError) {
          setError('file', { type: 'manual', message: '' });
        }
      },
      onError: (error) => {
        if (setError) {
          setError('file', { type: 'manual', message: error.message || 'File upload failed' });
        }
      },
    }
  );

  const { mutate: createOnboardTemplateSample, isLoading: isCreateOnboardTemplateSampleLoading } = useMutation<
    ITemplate,
    IErrorObject,
    { name: string; columns: IColumn[] | ITemplateSchema[] | IColumn | undefined; _projectId: string }
  >(
    [API_KEYS.TEMPLATE_SAMPLE_CREATE],
    (payload) =>
      commonApi(API_KEYS.TEMPLATE_SAMPLE_CREATE as any, {
        body: {
          name: payload.name,
          columns: payload.columns,
          _projectId: profileInfo?._projectId,
        },
      }),
    {
      onSuccess: (templateData) => {
        if (templateData && templateData._id && profileInfo) {
          push(`${ROUTES.IMPORTS}/${templateData._id}?welcomeShow=true`);
          setShowWelcome(true);
        }
      },
    }
  );

  return {
    getTemplateFileSchema,
    templateSchema,
    isTemplateSampleLoading,
    templateSampleData,
    createOnboardTemplateSample,
    isCreateOnboardTemplateSampleLoading,
  };
}

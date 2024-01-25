import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { commonApi } from '@libs/api';
import { notify } from '@libs/notify';
import { track } from '@libs/amplitude';
import { API_KEYS, NOTIFICATION_KEYS } from '@config';
import { IErrorObject, ICustomization } from '@impler/shared';

interface UseEditorProps {
  templateId: string;
}

interface CustomizationDataFormat {
  combinedFormat: string;
}

export function useEditor({ templateId }: UseEditorProps) {
  const queryClient = useQueryClient();
  const {
    reset,
    control,
    setError,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomizationDataFormat>();
  const { data: customization, isLoading: isCustomizationLoading } = useQuery<
    ICustomization,
    IErrorObject,
    ICustomization,
    string[]
  >(
    [API_KEYS.TEMPLATE_CUSTOMIZATION_GET, templateId],
    () => commonApi<ICustomization>(API_KEYS.TEMPLATE_CUSTOMIZATION_GET as any, { parameters: [templateId] }),
    {
      onSuccess(data) {
        reset({
          combinedFormat: data.combinedFormat,
        });
      },
    }
  );
  const { mutate: updateCustomization, isLoading: isUpdateCustomizationLoading } = useMutation<
    ICustomization,
    IErrorObject,
    CustomizationDataFormat,
    string[]
  >(
    [API_KEYS.TEMPLATE_CUSTOMIZATION_UPDATE, templateId],
    (data) =>
      commonApi<ICustomization>(API_KEYS.TEMPLATE_CUSTOMIZATION_UPDATE as any, {
        parameters: [templateId],
        body: data,
      }),
    {
      onSuccess(data) {
        track({
          name: 'OUTPUT FORMAT UPDATED',
          properties: {},
        });
        notify(NOTIFICATION_KEYS.OUTPUT_UPDATED);
        queryClient.setQueryData([API_KEYS.TEMPLATE_CUSTOMIZATION_GET, templateId], data);
      },
    }
  );
  const { mutate: syncCustomization, isLoading: isSyncCustomizationLoading } = useMutation<
    ICustomization,
    IErrorObject,
    void,
    string[]
  >(
    [API_KEYS.TEMPLATE_CUSTOMIZATION_UPDATE, templateId],
    () => commonApi<ICustomization>(API_KEYS.TEMPLATE_CUSTOMIZATION_SYNC as any, { parameters: [templateId] }),
    {
      onSuccess(data) {
        queryClient.setQueryData([API_KEYS.TEMPLATE_CUSTOMIZATION_GET, templateId], data);
        setValue('combinedFormat', data.combinedFormat);
      },
    }
  );

  const validateFormat = (data: string): boolean => {
    try {
      JSON.parse(data);

      return true;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-throw-literal
      throw { type: 'JSON', message: 'Not a valid JSON!' };
    }
  };
  const onSaveClick = () => {
    handleSubmit((data) => {
      let { combinedFormat } = data;
      // Remove single-line & multi-line comments
      combinedFormat = combinedFormat.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
      try {
        validateFormat(combinedFormat);
      } catch (error) {
        return setError('combinedFormat', {
          type: (error as any).type,
          message: (error as Error).message,
        });
      }

      updateCustomization({
        combinedFormat,
      });
    })();
  };

  return {
    errors,
    control,
    onSaveClick,
    handleSubmit,
    customization,
    syncCustomization,
    updateCustomization,
    isCustomizationLoading,
    isSyncCustomizationLoading,
    isUpdateCustomizationLoading,
  };
}

import { API_KEYS } from '@config';
import { useForm } from 'react-hook-form';
import { IErrorObject, ICustomization, validateVariable } from '@impler/shared';
import { commonApi } from '@libs/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

interface UseEditorProps {
  templateId: string;
}

interface CustomizationDataFormat {
  recordFormat: string;
  chunkFormat: string;
}

export function useEditor({ templateId }: UseEditorProps) {
  const queryClient = useQueryClient();
  const {
    reset,
    control,
    setError,
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
          recordFormat: data.recordFormat,
          chunkFormat: data.chunkFormat,
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
        queryClient.setQueryData([API_KEYS.TEMPLATE_CUSTOMIZATION_GET, templateId], data);
      },
    }
  );

  const validateFormat = (data: string, variables: string[]): boolean => {
    try {
      JSON.parse(data);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-throw-literal
      throw { type: 'JSON', message: 'Not a valid JSON!' };
    }
    try {
      const parsed = JSON.parse(data);
      const values = Object.values(parsed);
      const isValid: boolean = values.every((value) => {
        if (typeof value === 'string' && validateVariable(value)) {
          return variables.includes(value);
        } else if (typeof value === 'object') {
          return validateFormat(JSON.stringify(value), variables);
        }

        return true;
      });
      if (!isValid) throw new Error('Variables are not proper');

      return isValid;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-throw-literal
      throw { type: 'VARIABLES', message: 'Variables are not Proper!' };
    }
  };
  const onSaveClick = () => {
    handleSubmit((data) => {
      const { chunkFormat, recordFormat } = data;
      try {
        validateFormat(chunkFormat, customization!.chunkVariables);
      } catch (error) {
        setError('chunkFormat', {
          type: (error as any).type,
          message: (error as Error).message,
        });
      }

      try {
        validateFormat(recordFormat, customization!.recordVariables);
      } catch (error) {
        setError('recordFormat', {
          type: (error as any).type,
          message: (error as Error).message,
        });
      }
      updateCustomization({
        recordFormat,
        chunkFormat,
      });
    })();
  };

  return {
    errors,
    control,
    onSaveClick,
    handleSubmit,
    customization,
    updateCustomization,
    isCustomizationLoading,
    isUpdateCustomizationLoading,
  };
}

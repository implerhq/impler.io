import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { commonApi } from '@libs/api';
import { notify } from '@libs/notify';
import { track } from '@libs/amplitude';
import { API_KEYS, NOTIFICATION_KEYS } from '@config';
import { IErrorObject, ICustomization, IDestinationData, DestinationsEnum } from '@impler/shared';

interface UseEditorProps {
  templateId: string;
}

interface CustomizationDataFormat {
  format?: string;
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
  const { data: destination, isLoading: isDestinationLoading } = useQuery<
    unknown,
    IErrorObject,
    IDestinationData,
    [string, string | undefined]
  >([API_KEYS.DESTINATION_FETCH, templateId], () =>
    commonApi<IDestinationData>(API_KEYS.DESTINATION_FETCH as any, { parameters: [templateId] })
  );
  const { data: customization, isLoading: isCustomizationLoading } = useQuery<
    ICustomization,
    IErrorObject,
    ICustomization,
    string[]
  >([API_KEYS.TEMPLATE_CUSTOMIZATION_GET, templateId], () =>
    commonApi<ICustomization>(API_KEYS.TEMPLATE_CUSTOMIZATION_GET as any, { parameters: [templateId] })
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
        const formatKey = getFormatKey();
        console.log(formatKey);
        setValue('format', formatKey);
      },
    }
  );

  // Combine all variables: record variables + chunk variables + system variables
  const allVariables = useMemo(() => {
    const variables = [];

    // Add schema variables (from record format)
    if (customization?.recordVariables) {
      variables.push(...customization.recordVariables.map((variable) => variable.substring(2, variable.length - 2)));
    }

    // Add system variables (from chunk format)
    if (customization?.chunkVariables) {
      variables.push(...customization.chunkVariables);
    }

    // Add Bubble.io specific system variables
    if (destination?.destination === DestinationsEnum.BUBBLEIO) {
      variables.push('extra.uploadId', 'extra.userId');
    }

    return variables;
  }, [customization?.recordVariables, customization?.chunkVariables, destination?.destination]);

  // Helper function to format variable display
  const formatVariableDisplay = (variable: string) => {
    return `"${variable}"`;
  };

  // Helper function to categorize variables
  const isSystemVariable = (variable: string) => {
    return variable.startsWith('extra.') || variable.startsWith('params.');
  };

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
      let { format } = data;
      if (format) {
        // Remove single-line & multi-line comments
        format = format?.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
        try {
          validateFormat(format);
        } catch (error) {
          return setError('format', {
            type: (error as any).type,
            message: (error as Error).message,
          });
        }
      }

      const formatKey = getFormatKey();
      updateCustomization({
        [formatKey]: format,
      });
    })();
  };
  const getFormatKey = () =>
    destination?.destination === DestinationsEnum.BUBBLEIO ? 'recordFormat' : 'combinedFormat';

  useEffect(() => {
    if (destination?.destination && customization) {
      let format = customization.combinedFormat; // default for webhook
      if (
        destination.destination === DestinationsEnum.BUBBLEIO ||
        destination.destination === DestinationsEnum.FRONTEND
      ) {
        format = customization.recordFormat;
      }
      reset({ format });
    }
  }, [destination, customization, reset]);

  return {
    errors,
    control,
    onSaveClick,
    destination,
    handleSubmit,
    allVariables,
    customization,
    isSystemVariable,
    syncCustomization,
    updateCustomization,
    isDestinationLoading,
    formatVariableDisplay,
    isCustomizationLoading,
    isSyncCustomizationLoading,
    isUpdateCustomizationLoading,
  };
}

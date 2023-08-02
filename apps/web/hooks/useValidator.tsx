import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';

import { API_KEYS } from '@config';
import { commonApi } from '@libs/api';
import { ICustomization, IErrorObject, IValidator } from '@impler/shared';

interface UseSchemaProps {
  templateId: string;
}

interface ValidationsData {
  onBatchInitialize: string;
}

export function useValidator({ templateId }: UseSchemaProps) {
  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<ValidationsData>();
  const [editorVariables, setEditorVariables] = useState<string[]>([]);
  const { data: customization, isFetching: isCustomizationsLoading } = useQuery<
    ICustomization,
    IErrorObject,
    ICustomization,
    string[]
  >(
    [API_KEYS.TEMPLATE_CUSTOMIZATION_GET, templateId],
    () => commonApi<ICustomization>(API_KEYS.TEMPLATE_CUSTOMIZATION_GET as any, { parameters: [templateId] }),
    {
      onSuccess(data) {
        setEditorVariables([
          ...(data.chunkVariables.map((variable) => variable.substring(2, variable.length - 2)) || []),
        ]);
      },
    }
  );
  const { data: validations, isFetching: isValidationsLoading } = useQuery<unknown, IErrorObject, IValidator, string[]>(
    [API_KEYS.VALIDATIONS, templateId],
    () => commonApi<IValidator>(API_KEYS.VALIDATIONS as any, { parameters: [templateId] }),
    {
      onSuccess(data) {
        setValue('onBatchInitialize', data?.onBatchInitialize || '');
      },
    }
  );
  const { mutate: updateValidations, isLoading: isUpdateValidationsLoading } = useMutation<
    IValidator,
    IErrorObject,
    ValidationsData,
    string[]
  >([API_KEYS.VALIDATIONS_UPDATE, templateId], (body) =>
    commonApi<IValidator>(API_KEYS.VALIDATIONS_UPDATE as any, { parameters: [templateId], body })
  );
  const onSaveValidationsClick = (data: ValidationsData) => {
    updateValidations(data);
  };

  return {
    errors,
    control,
    validations,
    handleSubmit,
    customization,
    editorVariables,
    isValidationsLoading: isValidationsLoading || isCustomizationsLoading,
    onSave: handleSubmit(onSaveValidationsClick),
    isUpdateValidationsLoading,
  };
}

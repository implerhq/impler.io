import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';

import { API_KEYS } from '@config';
import { commonApi } from '@libs/api';
import { IErrorObject, IValidator } from '@impler/shared';

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

  const { data: validations, isLoading: isValidationsLoading } = useQuery<unknown, IErrorObject, IValidator, string[]>(
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
    control,
    handleSubmit,
    errors,
    validations,
    isValidationsLoading,
    onSave: handleSubmit(onSaveValidationsClick),
    isUpdateValidationsLoading,
  };
}

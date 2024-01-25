import { useState } from 'react';
import { modals } from '@mantine/modals';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';

import { notify } from '@libs/notify';
import { commonApi } from '@libs/api';
import { API_KEYS, MODAL_KEYS, MODAL_TITLES } from '@config';
import { ICustomization, IErrorObject, IValidator } from '@impler/shared';
import { CodeOutput } from '@components/imports/validator/CodeOutput';

interface UseSchemaProps {
  templateId: string;
}

interface TestCodeResult {
  passed: boolean;
  standardOutput: string;
  standardError: string;
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
  const [testCodeResult, setTestCodeResult] = useState<TestCodeResult>();
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
          ...(data.recordVariables.map((variable) => variable.substring(2, variable.length - 2)) || []),
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
    {
      passed: boolean;
      standardOutput: string;
      standardError: string;
    },
    IErrorObject,
    ValidationsData,
    string[]
  >(
    [API_KEYS.VALIDATIONS_UPDATE, templateId],
    (body) => commonApi<TestCodeResult>(API_KEYS.VALIDATIONS_UPDATE as any, { parameters: [templateId], body }),
    {
      onSuccess(output) {
        setTestCodeResult(output);
        if (output && !output.passed) {
          modals.open({
            modalId: MODAL_KEYS.VALIDATIONS_OUTPUT,
            title: MODAL_TITLES.VALIDATIONS_OUTPUT,

            children: <CodeOutput output={output.standardOutput} error={output.standardError} />,
          });
          notify('VALIDATIONS_UPDATED', {
            title: 'Validation code update failed!',
            message: 'It seems there is some issues with code!',
            color: 'red',
          });
        } else {
          notify('VALIDATIONS_UPDATED');
        }
      },
      onError(error) {
        notify('VALIDATIONS_UPDATED', { title: 'Something went wrong!', message: error?.message, color: 'red' });
      },
    }
  );
  const onSaveValidationsClick = (data: ValidationsData) => {
    updateValidations(data);
  };
  const onViewCodeResultClick = () => {
    modals.open({
      modalId: MODAL_KEYS.VALIDATIONS_OUTPUT,
      title: MODAL_TITLES.VALIDATIONS_OUTPUT,

      children: <CodeOutput output={testCodeResult?.standardOutput} error={testCodeResult?.standardError} />,
    });
  };

  return {
    errors,
    control,
    validations,
    handleSubmit,
    customization,
    testCodeResult,
    editorVariables,
    onViewCodeResultClick,
    isValidationsLoading: isValidationsLoading || isCustomizationsLoading,
    onSave: handleSubmit(onSaveValidationsClick),
    isUpdateValidationsLoading,
  };
}

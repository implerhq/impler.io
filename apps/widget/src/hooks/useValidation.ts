import { ApiService } from '@impler/client';
import { IErrorObject } from '@impler/shared';
import { useQuery } from '@tanstack/react-query';

interface IUseValidationProps {
  api: ApiService;
  projectId: string;
  templateId?: string;
  schema?: string;
  onSuccess: () => void;
  onError: () => void;
}
const useValidation = ({ api, projectId, templateId, schema, onSuccess, onError }: IUseValidationProps) => {
  const { refetch } = useQuery<boolean, IErrorObject, any, string[]>(
    ['valid', projectId],

    () => api.checkIsRequestvalid(projectId, templateId, schema) as Promise<boolean>,
    {
      onSuccess() {
        onSuccess();
      },

      onError() {
        onError();
      },
    }
  );

  return { refetch };
};

export default useValidation;

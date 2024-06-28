import { ITemplate, IErrorObject } from '@impler/shared';
import { useAPIState } from '@store/api.context';
import { useQuery } from '@tanstack/react-query';
import { notifier } from '@util';

interface UseTemplatesProps {
  projectId: string;
}

export function useTemplates({ projectId }: UseTemplatesProps) {
  const { api } = useAPIState();
  const {
    data: templates,
    isFetched: isTemplatesFetching,
    isLoading: isTemplatesLoading,
  } = useQuery<ITemplate[], IErrorObject, ITemplate[], string[]>(
    ['templates', projectId],
    () => api.getTemplates(projectId),
    {
      onError(error: IErrorObject) {
        notifier.showError({ message: error.message, title: error.error });
      },
      refetchOnMount: 'always',
    }
  );

  return {
    templates,
    isTemplatesFetching,
    isTemplatesLoading,
  };
}

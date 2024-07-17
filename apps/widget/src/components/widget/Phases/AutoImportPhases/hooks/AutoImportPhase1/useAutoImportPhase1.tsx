import { useMutation } from '@tanstack/react-query';
import { useAPIState } from '@store/api.context';
import { IErrorObject } from '@impler/shared';
import { IUserJob } from '@impler/shared';
import { useImplerState } from '@store/impler.context';
import { useJobsInfo } from '@store/jobinfo.context';

interface IUseAutoImportPhase1Props {
  goNext: () => void;
}

export function useAutoImportPhase1({ goNext }: IUseAutoImportPhase1Props) {
  const { api } = useAPIState();
  const { templateId } = useImplerState();
  const { setJobsInfo } = useJobsInfo();

  const { isLoading, mutate: getRssXmlHeading } = useMutation<IUserJob, IErrorObject, string, [string]>(
    ['getRssXmlHeading'],
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    (url: string) => api.getRssXmlMappingHeading(templateId!, url) as Promise<IUserJob>,
    {
      onSuccess(data) {
        setJobsInfo(data);
        goNext();
      },
    }
  );

  return {
    isLoading,
    getRssXmlHeading,
  };
}

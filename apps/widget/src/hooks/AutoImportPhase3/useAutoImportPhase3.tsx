import { useMutation } from '@tanstack/react-query';
import { IErrorObject, IUserJob } from '@impler/shared';
import { useAPIState } from '@store/api.context';
import { useJobsInfo } from '@store/jobinfo.context';

interface IUseAutoImportPhase3Props {
  goNext: () => void;
}

export function useAutoImportPhase3({ goNext }: IUseAutoImportPhase3Props) {
  const { api } = useAPIState();
  const { jobsInfo, setJobsInfo } = useJobsInfo();

  const { mutate: updateUserJob, isLoading: isUpdateUserJobLoading } = useMutation<
    IUserJob,
    IErrorObject,
    Partial<IUserJob>
  >((jobInfo) => api.updateUserJob(jobsInfo._id, jobInfo), {
    onSuccess(updatedJobInfo) {
      setJobsInfo(updatedJobInfo);
      goNext();
    },
  });

  return {
    updateUserJob,
    isUpdateUserJobLoading,
  };
}

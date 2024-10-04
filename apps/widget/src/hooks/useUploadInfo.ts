import { useQuery } from '@tanstack/react-query';

import { IUpload } from '@impler/client';
import { IErrorObject } from '@impler/shared';
import { useAppState } from '@store/app.context';
import { useAPIState } from '@store/api.context';

interface IUseUploadInfoProps {
  enabled?: boolean;
  onNext?: (data: IUpload) => void;
}
export const useUploadInfo = ({ onNext, enabled = true }: IUseUploadInfoProps) => {
  const { api } = useAPIState();
  const { setUploadInfo, uploadInfo } = useAppState();
  const { refetch: fetchUploadInfo, isLoading: isUploadInfoLoading } = useQuery<
    IUpload,
    IErrorObject,
    IUpload,
    [string]
  >([`getUpload:${uploadInfo._id}`], () => api.getUpload(uploadInfo._id), {
    enabled,
    onSuccess(data) {
      onNext?.(data);
      setUploadInfo(data);
    },
  });

  return { fetchUploadInfo, isUploadInfoLoading };
};

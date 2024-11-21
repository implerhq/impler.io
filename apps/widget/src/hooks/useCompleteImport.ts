import { useMutation } from '@tanstack/react-query';

import { notifier } from '@util';
import { IUpload } from '@impler/client';
import { logAmplitudeEvent } from '@amplitude';
import { IErrorObject } from '@impler/shared';
import { useAppState } from '@store/app.context';
import { useAPIState } from '@store/api.context';

interface IUseCompleteImportProps {
  onNext?: (uploadInfo: IUpload, importedData: Record<string, any>[]) => void;
}

export const useCompleteImport = ({ onNext }: IUseCompleteImportProps) => {
  const { api } = useAPIState();
  const { uploadInfo, setUploadInfo, host } = useAppState();
  const { isLoading: isCompleteImportLoading, mutate: completeImport } = useMutation<
    {
      email: string;
      uploadInfo: IUpload;
      importedData: Record<string, any>[];
    },
    IErrorObject,
    void,
    [string]
  >([`confirm:${uploadInfo._id}`], () => api.confirmReview(uploadInfo._id), {
    onSuccess(uploadData) {
      logAmplitudeEvent('RECORDS', {
        type: 'invalid',
        host,
        email: uploadData.email,
        records: uploadData.uploadInfo.invalidRecords,
      });
      logAmplitudeEvent('RECORDS', {
        type: 'valid',
        host,
        email: uploadData.email,
        records: uploadData.uploadInfo.totalRecords - uploadData.uploadInfo.invalidRecords,
      });
      setUploadInfo(uploadData.uploadInfo);
      onNext?.(uploadData.uploadInfo, uploadData.importedData);
    },
    onError(error: IErrorObject) {
      notifier.showError({ message: error.message, title: error.error });
    },
  });

  return { isCompleteImportLoading, completeImport };
};

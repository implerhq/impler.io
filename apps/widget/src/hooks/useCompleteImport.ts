import { useMutation } from '@tanstack/react-query';

// import { notifier } from '@util';
import { IUpload } from '@impler/client';
import { logAmplitudeEvent } from '@amplitude';
import { IErrorObject, numberFormatter } from '@impler/shared';
import { useAppState } from '@store/app.context';
import { useAPIState } from '@store/api.context';

interface IUseCompleteImportProps {
  onNext?: (uploadInfo: IUpload, importedData: Record<string, any>[]) => void;
}

export const useCompleteImport = ({ onNext }: IUseCompleteImportProps) => {
  const { api } = useAPIState();
  const { uploadInfo, setUploadInfo, host, maxRecords } = useAppState();
  const { isLoading: isCompleteImportLoading, mutate: completeImport } = useMutation<
    {
      email: string;
      uploadInfo: IUpload;
      importedData: Record<string, any>[];
      maxRecords?: number;
    },
    IErrorObject,
    void,
    [string]
    // eslint-disable-next-line prettier/prettier
  >([`confirm:${uploadInfo._id}`], () => api.confirmReview(uploadInfo._id, maxRecords), {
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
      console.log(error.message);
      // notifier.showError({ message: texts.PHASE3.MAX_RECORD_LIMIT_ERROR ?? error.message, title: error.error });
    },
  });

  return { isCompleteImportLoading, completeImport };
};

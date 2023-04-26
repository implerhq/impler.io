import { logAmplitudeEvent } from '@amplitude';
import { variables } from '@config';
import { IErrorObject, IReviewData, IUpload } from '@impler/shared';
import { useAPIState } from '@store/api.context';
import { useAppState } from '@store/app.context';
import { useMutation, useQuery } from '@tanstack/react-query';
import { downloadFileFromURL, getFileNameFromUrl, notifier } from '@util';
import { useState } from 'react';

const defaultPage = 1;

interface IUsePhase3Props {
  onNext: (uploadData: IUpload) => void;
}

export function usePhase3({ onNext }: IUsePhase3Props) {
  const { api } = useAPIState();
  const { uploadInfo, setUploadInfo } = useAppState();
  const [page, setPage] = useState<number>(defaultPage);
  const [totalPages, setTotalPages] = useState<number>(defaultPage);
  const {
    data: reviewData,
    isLoading: isReviewDataLoading,
    isFetched: isReviewDataFetched,
  } = useQuery<IReviewData, IErrorObject, IReviewData, [string, number]>(
    [`review`, page],
    () => api.getReviewData(uploadInfo._id, page),
    {
      onSuccess(data) {
        logAmplitudeEvent('VALIDATE', {
          invalidRecords: data.totalRecords,
        });
        if (!data.totalRecords) {
          // Confirm review if spreadsheet do not have invalid records
          confirmReview(false);
        } else {
          setPage(Number(data.page));
          setTotalPages(data.totalPages);
        }
      },
      onError(error: IErrorObject) {
        notifier.showError({ message: error.message, title: error.error });
      },
    }
  );
  const { mutate: getSignedUrl } = useMutation<string, IErrorObject, [string, string]>(
    [`getSignedUrl:${uploadInfo._id}`],
    ([fileUrl]) => api.getSignedUrl(getFileNameFromUrl(fileUrl)),
    {
      onSuccess(signedUrl, queryVariables) {
        logAmplitudeEvent('DOWNLOAD_INVALID_DATA');
        downloadFileFromURL(signedUrl, queryVariables[variables.firstIndex]);
      },
      onError(error: IErrorObject) {
        notifier.showError({ title: error.error, message: error.message });
      },
    }
  );
  const { isLoading: isGetUploadLoading, refetch: getUpload } = useQuery<IUpload, IErrorObject, IUpload, [string]>(
    [`getUpload:${uploadInfo._id}`],
    () => api.getUpload(uploadInfo._id),
    {
      onSuccess(data) {
        setUploadInfo(data);
        getSignedUrl([data.invalidCSVDataFileUrl, `invalid-data-${uploadInfo._id}.csv`]);
      },
      onError(error: IErrorObject) {
        notifier.showError({ message: error.message, title: error.error });
      },
      enabled: false,
    }
  );
  const { isLoading: isConfirmReviewLoading, mutate: confirmReview } = useMutation<
    IUpload,
    IErrorObject,
    boolean,
    [string]
  >(
    [`confirm:${uploadInfo._id}`],
    (processInvalidRecords) => api.confirmReview(uploadInfo._id, processInvalidRecords),
    {
      onSuccess(uploadData) {
        setUploadInfo(uploadData);
        onNext(uploadData);
      },
      onError(error: IErrorObject) {
        notifier.showError({ message: error.message, title: error.error });
      },
    }
  );

  const onPageChange = (newPageNumber: number) => {
    setPage(newPageNumber);
  };

  const onExportData = () => {
    if (!uploadInfo.invalidCSVDataFileUrl) getUpload();
    else getSignedUrl([uploadInfo.invalidCSVDataFileUrl, `invalid-data-${uploadInfo._id}.csv`]);
  };

  return {
    page,
    totalPages,
    onPageChange,
    onExportData,
    isGetUploadLoading,
    isConfirmReviewLoading,
    onConfirmReview: confirmReview,
    heaings: uploadInfo.headings.map((key: string) => ({ title: key, key })),
    reviewData: reviewData?.data || [],
    // eslint-disable-next-line no-magic-numbers
    totalData: reviewData?.totalRecords || 0,
    isInitialDataLoaded: isReviewDataFetched && !isReviewDataLoading,
  };
}

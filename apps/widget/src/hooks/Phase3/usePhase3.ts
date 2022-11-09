import { IErrorObject, IReviewData, IUpload } from '@impler/shared';
import { useAPIState } from '@store/api.context';
import { useAppState } from '@store/app.context';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';

const defaultPage = 1;

interface IUsePhase3Props {
  onNext: (dataCount: number) => void;
}

export function usePhase3({ onNext }: IUsePhase3Props) {
  const { api } = useAPIState();
  const { uploadInfo } = useAppState();
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
        setPage(Number(data.page));
        setTotalPages(data.totalPages);
      },
    }
  );
  const { isLoading: isConfirmReviewLoading, mutate: confirmReview } = useMutation<
    IUpload,
    IErrorObject,
    boolean,
    [string]
  >([`confirm:${uploadInfo._id}`], (exemptData) => api.confirmReview(uploadInfo._id, exemptData), {
    onSuccess() {
      onNext(uploadInfo.totalRecords);
    },
  });

  const onPageChange = (newPageNumber: number) => {
    setPage(newPageNumber);
  };

  return {
    page,
    totalPages,
    onPageChange,
    onConfirmReview: confirmReview,
    heaings: uploadInfo.headings.map((key: string) => ({ title: key, key })),
    reviewData: reviewData?.data || [],
    // eslint-disable-next-line no-magic-numbers
    totalData: reviewData?.totalRecords || 0,
    isConfirmReviewLoading,
    isInitialDataLoaded: isReviewDataFetched && !isReviewDataLoading,
  };
}

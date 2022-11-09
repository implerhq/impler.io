import { IErrorObject, IReviewData } from '@impler/shared';
import { useAPIState } from '@store/api.context';
import { useAppState } from '@store/app.context';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

const defaultPage = 1;

export function usePhase3() {
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

  const onPageChange = (newPageNumber: number) => {
    setPage(newPageNumber);
  };

  return {
    page,
    totalPages,
    onPageChange,
    heaings: uploadInfo.headings.map((key: string) => ({ title: key, key })),
    reviewData: reviewData?.data || [],
    isInitialDataLoaded: isReviewDataFetched && !isReviewDataLoading,
  };
}

import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';

import { notifier } from '@util';
import { HotItemSchema } from '@types';
import { logAmplitudeEvent } from '@amplitude';
import { useAPIState } from '@store/api.context';
import { useAppState } from '@store/app.context';
import { ColumnTypesEnum, ISchemaColumn, IErrorObject, IReviewData, IUpload, IRecord } from '@impler/shared';
import { variables } from '@config';

interface IUsePhase3Props {
  onNext: (uploadData: IUpload) => void;
}

const defaultPage = 1;

export function usePhase3({ onNext }: IUsePhase3Props) {
  const { api } = useAPIState();
  const [page, setPage] = useState<number>(defaultPage);
  const [headings, setHeadings] = useState<string[]>([]);
  const { uploadInfo, setUploadInfo, host } = useAppState();
  const [reviewData, setReviewData] = useState<IRecord[]>([]);
  const [columnDefs, setColumnDefs] = useState<HotItemSchema[]>([]);
  const [totalPages, setTotalPages] = useState<number>(defaultPage);
  const [showAllDataValidModal, setShowAllDataValidModal] = useState<boolean | undefined>(undefined);

  useQuery<unknown, IErrorObject, ISchemaColumn[], [string, string]>(
    [`columns:${uploadInfo._id}`, uploadInfo._id],
    () => api.getColumns(uploadInfo._id),
    {
      onSuccess(data) {
        const newColumnDefs: HotItemSchema[] = [];
        const newHeadings: string[] = ['#'];
        newColumnDefs.push({
          type: 'text',
          data: 'index',
          readOnly: true,
          editor: false,
          className: 'custom-cell',
        });
        data.forEach((column: ISchemaColumn) => {
          newHeadings.push(column.name);
          const columnItem: HotItemSchema = {
            className: 'htCenter',
            data: `record.${column.name}`,
            allowEmpty: !column.isRequired,
            allowDuplicate: !column.isUnique,
          };
          switch (column.type) {
            case ColumnTypesEnum.STRING:
            case ColumnTypesEnum.EMAIL:
            case ColumnTypesEnum.REGEX:
              columnItem.type = 'text';
              columnItem.renderer = 'custom';
              break;
            case ColumnTypesEnum.SELECT:
              columnItem.type = 'text';
              columnItem.editor = 'select';
              columnItem.renderer = 'custom';
              columnItem.selectOptions = column.selectValues;
              break;
            case ColumnTypesEnum.NUMBER:
              columnItem.type = 'numeric';
              columnItem.renderer = 'custom';
              break;
            case ColumnTypesEnum.DATE:
              columnItem.type = 'date';

              columnItem.renderer = 'custom';
              break;
            default:
              columnItem.type = 'text';
              break;
          }
          newColumnDefs.push(columnItem);
        });
        setHeadings(newHeadings);
        setColumnDefs(newColumnDefs);
      },
    }
  );
  const { refetch: fetchUploadInfo } = useQuery<IUpload, IErrorObject, IUpload, [string]>(
    [`getUpload:${uploadInfo._id}`],
    () => api.getUpload(uploadInfo._id),
    {
      enabled: false,
      onSuccess(data) {
        setUploadInfo(data);
        if (data.invalidRecords === variables.baseIndex && data.totalRecords) {
          setShowAllDataValidModal(true);
        }
      },
    }
  );
  const { mutate: refetchReviewData, isLoading: isReviewDataLoading } = useMutation<
    IReviewData,
    IErrorObject,
    void,
    [string]
  >(['review'], () => api.getReviewData(uploadInfo._id, page), {
    onSuccess(data) {
      setReviewData(data.data);
      logAmplitudeEvent('VALIDATE', {
        invalidRecords: data.totalRecords,
      });
      setPage(Number(data.page));
      setTotalPages(data.totalPages);
    },
    onError(error: IErrorObject) {
      notifier.showError({ message: error.message, title: error.error });
    },
  });
  const { refetch: reReviewData, isLoading: isDoReviewLoading } = useQuery<
    unknown,
    IErrorObject,
    void,
    [string, string]
  >([`review`, uploadInfo._id], () => api.doReivewData(uploadInfo._id), {
    cacheTime: 0,
    staleTime: 0,
    onSuccess() {
      fetchUploadInfo();
      setPage(defaultPage);
      refetchReviewData();
    },
    onError(error: IErrorObject) {
      notifier.showError({ message: error.message, title: error.error });
    },
  });
  const { isLoading: isConfirmReviewLoading, mutate: confirmReview } = useMutation<
    IUpload,
    IErrorObject,
    void,
    [string]
  >([`confirm:${uploadInfo._id}`], () => api.confirmReview(uploadInfo._id), {
    onSuccess(uploadData) {
      logAmplitudeEvent('RECORDS', {
        type: 'invalid',
        host,
        records: uploadData.invalidRecords,
      });
      logAmplitudeEvent('RECORDS', {
        type: 'valid',
        host,
        records: uploadData.totalRecords - uploadData.invalidRecords,
      });
      setUploadInfo(uploadData);
      onNext(uploadData);
    },
    onError(error: IErrorObject) {
      notifier.showError({ message: error.message, title: error.error });
    },
  });
  const { mutate: updateRecord } = useMutation<unknown, IErrorObject, IRecord, [string]>([`update`], (record) =>
    api.updateRecord(uploadInfo._id, record)
  );

  const onPageChange = (newPageNumber: number) => {
    setPage(newPageNumber);
    refetchReviewData();
  };

  return {
    page,
    headings,
    totalPages,
    columnDefs,
    reReviewData,
    updateRecord,
    onPageChange,
    setReviewData,
    isDoReviewLoading,
    isReviewDataLoading,
    showAllDataValidModal,
    isConfirmReviewLoading,
    setShowAllDataValidModal,
    reviewData: reviewData || [],
    onConfirmReview: confirmReview,
    totalRecords: uploadInfo.totalRecords ?? undefined,
    invalidRecords: uploadInfo.invalidRecords ?? undefined,
  };
}

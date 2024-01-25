import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';

import { notifier } from '@util';
import { variables } from '@config';
import { HotItemSchema } from '@types';
import { logAmplitudeEvent } from '@amplitude';
import { useAPIState } from '@store/api.context';
import { useAppState } from '@store/app.context';
import {
  ColumnTypesEnum,
  ISchemaColumn,
  IErrorObject,
  IReviewData,
  IUpload,
  IRecord,
  ReviewDataTypesEnum,
} from '@impler/shared';

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
  const [type, setType] = useState<ReviewDataTypesEnum>(ReviewDataTypesEnum.ALL);
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
          className: 'index-cell',
          disableVisualSelection: true,
        });
        data.forEach((column: ISchemaColumn) => {
          newHeadings.push(column.name);
          const columnItem: HotItemSchema = {
            className: 'htCenter',
            data: `record.${column.key}`,
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
              if (column.dateFormats?.length) {
                columnItem.dateFormat = column.dateFormats[variables.baseIndex];
                columnItem.correctFormat = true;
              }

              columnItem.renderer = 'custom';
              break;
            default:
              columnItem.type = 'text';
              break;
          }
          newColumnDefs.push(columnItem);
        });
        newColumnDefs.push({
          type: 'text',
          data: 'record._id',
          readOnly: true,
          editor: false,
          renderer: 'del',
          className: 'del-cell',
          disableVisualSelection: true,
        });
        newHeadings.push('X');
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
    [number, string],
    [string]
  >(
    ['review'],
    ([reviewPageNumber, reviewDataType]) =>
      api.getReviewData({ uploadId: uploadInfo._id, page: reviewPageNumber, type: reviewDataType }),
    {
      onSuccess(data) {
        if (!data.data.length && page > 1) {
          setTotalPages(totalPages - 1);
          setPage(page - 1);

          return;
        }
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
    }
  );
  const { refetch: reReviewData, isFetching: isDoReviewLoading } = useQuery<
    unknown,
    IErrorObject,
    void,
    [string, string]
  >([`review`, uploadInfo._id], () => api.doReivewData(uploadInfo._id), {
    cacheTime: 0,
    staleTime: 0,
    onSuccess() {
      fetchUploadInfo();
      refetchReviewData([page, type]);
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
  const { mutate: deleteRecord, isLoading: isDeleteRecordLoading } = useMutation<
    unknown,
    IErrorObject,
    [number, boolean],
    [string]
  >([`delete`], ([index, isValid]) => api.deleteRecord(uploadInfo._id, index, isValid), {
    onSuccess(data, vars) {
      const newReviewData = reviewData.filter((record) => record.index !== vars[0]);
      const newUploadInfo = { ...uploadInfo };
      newUploadInfo.totalRecords = newUploadInfo.totalRecords - 1;
      if (!vars[1]) {
        newUploadInfo.invalidRecords = newUploadInfo.invalidRecords - 1;
      }
      setUploadInfo(newUploadInfo);
      setReviewData(newReviewData);
      if (newReviewData.length === 0) {
        refetchReviewData([getPrevPage(page), type]);
      }
    },
  });

  const getPrevPage = (currentPageNumber: number) => Math.max(currentPageNumber - 1, 1);

  const onTypeChange = (newType: ReviewDataTypesEnum) => {
    setType(newType);
    refetchReviewData([page, newType]);
  };
  const onPageChange = (newPageNumber: number) => {
    refetchReviewData([newPageNumber, type]);
  };

  return {
    page,
    type,
    headings,
    totalPages,
    columnDefs,
    reReviewData,
    updateRecord,
    onPageChange,
    onTypeChange,
    deleteRecord,
    setReviewData,
    isDoReviewLoading,
    isReviewDataLoading,
    showAllDataValidModal,
    isDeleteRecordLoading,
    isConfirmReviewLoading,
    setShowAllDataValidModal,
    reviewData: reviewData || [],
    onConfirmReview: confirmReview,
    totalRecords: uploadInfo.totalRecords ?? undefined,
    invalidRecords: uploadInfo.invalidRecords ?? undefined,
  };
}

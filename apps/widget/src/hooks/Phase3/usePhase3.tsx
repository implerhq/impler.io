import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';

import { variables } from '@config';
import { HotItemSchema } from '@types';
import { logAmplitudeEvent } from '@amplitude';
import { useAPIState } from '@store/api.context';
import { useAppState } from '@store/app.context';
import { downloadFileFromURL, getFileNameFromUrl, notifier } from '@util';
import { ColumnTypesEnum, ISchemaColumn, IErrorObject, IReviewData, IUpload } from '@impler/shared';

interface IUsePhase3Props {
  onNext: (uploadData: IUpload) => void;
}

const defaultPage = 1;

export function usePhase3({ onNext }: IUsePhase3Props) {
  const { api } = useAPIState();
  const [page, setPage] = useState<number>(defaultPage);
  const [headings, setHeadings] = useState<string[]>([]);
  const { uploadInfo, setUploadInfo, host } = useAppState();
  const [columnDefs, setColumnDefs] = useState<HotItemSchema[]>([]);
  const [totalPages, setTotalPages] = useState<number>(defaultPage);

  useQuery<unknown, IErrorObject, ISchemaColumn[], [string, string]>(
    [`columns:${uploadInfo._id}`, uploadInfo._id],
    () => api.getColumns(uploadInfo._id),
    {
      onSuccess(data) {
        const newColumnDefs: HotItemSchema[] = [];
        const newHeadings: string[] = [];
        data.forEach((column: ISchemaColumn) => {
          newHeadings.push(column.name);
          switch (column.type) {
            case ColumnTypesEnum.STRING:
              newColumnDefs.push({
                type: 'text',
                validator: 'text',
                data: `record.${column.name}`,
                allowEmpty: !column.isRequired,
                allowDuplicate: !column.isUnique,
              });
              break;
            case ColumnTypesEnum.NUMBER:
              newColumnDefs.push({
                type: 'numeric',
                validator: 'numeric',
                data: `record.${column.name}`,
                allowEmpty: !column.isRequired,
                allowDuplicate: !column.isUnique,
              });
              break;
            case ColumnTypesEnum.DATE:
              newColumnDefs.push({
                type: 'date',
                validator: 'date',
                data: `record.${column.name}`,
                allowEmpty: !column.isRequired,
                allowDuplicate: !column.isUnique,
              });
              break;
            case ColumnTypesEnum.EMAIL:
              newColumnDefs.push({
                type: 'text',
                validator: 'regex',
                data: `record.${column.name}`,
                allowEmpty: !column.isRequired,
                allowDuplicate: !column.isUnique,
                regex: '^([a-zA-Z0-9_\\-\\.]+)@([a-zA-Z0-9_\\-\\.]+)\\.([a-zA-Z]{2,5})$',
              });
              break;
            case ColumnTypesEnum.SELECT:
              newColumnDefs.push({
                editor: 'select',
                validator: 'select',
                data: `record.${column.name}`,
                allowEmpty: !column.isRequired,
                selectOptions: column.selectValues,
              });
              break;
            case ColumnTypesEnum.REGEX:
              newColumnDefs.push({
                type: 'text',
                validator: 'regex',
                regex: column.regex,
                data: `record.${column.name}`,
                allowEmpty: !column.isRequired,
                allowDuplicate: !column.isUnique,
                allowInvalid: false,
              });
              break;
            default:
              newColumnDefs.push({
                type: 'text',
                validator: 'autocomplete',
                data: `record.${column.name}`,
                allowEmpty: !column.isRequired,
                allowDuplicate: !column.isUnique,
              });
              break;
          }
        });
        setHeadings(newHeadings);
        setColumnDefs(newColumnDefs);
      },
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
    }
  );
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
        getSignedUrl([data.invalidCSVDataFileUrl, `invalid-data-${uploadInfo._id}.xlsx`]);
      },
      onError(error: IErrorObject) {
        notifier.showError({ message: error.message, title: error.error });
      },
      enabled: false,
    }
  );

  const onPageChange = (newPageNumber: number) => {
    setPage(newPageNumber);
  };

  const onExportData = () => {
    getUpload();
  };

  return {
    page,
    headings,
    totalPages,
    columnDefs,
    onPageChange,
    onExportData,
    isGetUploadLoading,
    isConfirmReviewLoading,
    onConfirmReview: confirmReview,
    reviewData: reviewData?.data || [],
    // eslint-disable-next-line no-magic-numbers
    totalData: reviewData?.totalRecords || 0,
    isInitialDataLoaded: isReviewDataFetched && !isReviewDataLoading,
  };
}

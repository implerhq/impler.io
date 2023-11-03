import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';

import { variables } from '@config';
import { TableSchema } from '@types';
import { logAmplitudeEvent } from '@amplitude';
import { useAPIState } from '@store/api.context';
import { useAppState } from '@store/app.context';
import { getValidator } from 'util/validator/AJV';
import { downloadFileFromURL, getFileNameFromUrl, notifier } from '@util';
import { DatePickerRenderer, CellRenderer } from 'components/Common/Table';
import { ColumnTypesEnum, ISchemaColumn, IErrorObject, IReviewData, IUpload } from '@impler/shared';

interface IUsePhase3Props {
  onNext: (uploadData: IUpload) => void;
}

const defaultPage = 1;

export function usePhase3({ onNext }: IUsePhase3Props) {
  const { api } = useAPIState();
  const [page, setPage] = useState<number>(defaultPage);
  const { uploadInfo, setUploadInfo, host } = useAppState();
  const [validator, setValidator] = useState<(key: string, value: string | number) => boolean>();
  const [columnDefs, setColumnDefs] = useState<TableSchema[]>([]);
  const [totalPages, setTotalPages] = useState<number>(defaultPage);
  const [dataList, setDataList] = useState<Record<string, any>[]>([]);

  useQuery<unknown, IErrorObject, ISchemaColumn[], [string, string]>(
    [`columns:${uploadInfo._id}`, uploadInfo._id],
    () => api.getColumns(uploadInfo._id),
    {
      onSuccess(data) {
        const schemaValidator = getValidator(data);
        setValidator(() => schemaValidator);
        const newColumnDefs: TableSchema[] = [
          {
            headerName: '#',
            valueGetter: 'node.data.index',
          },
        ];
        data.forEach((column: ISchemaColumn) => {
          switch (column.type) {
            case ColumnTypesEnum.STRING:
              newColumnDefs.push({
                headerName: column.columnHeading,
                field: column.columnHeading,
                editable: true,
                cellRenderer: CellRenderer,
                cellEditor: 'agTextCellEditor',
                tooltipValueGetter(node) {
                  return node.data.errors && node.data.errors[column.columnHeading]
                    ? node.data.errors[column.columnHeading]
                    : null;
                },
                valueGetter: (node) => {
                  return node.data.record[column.columnHeading];
                },
              });
              break;
            case ColumnTypesEnum.NUMBER:
              newColumnDefs.push({
                headerName: column.columnHeading,
                field: column.columnHeading,
                editable: true,
                valueGetter: (node) => {
                  return node.data.record[column.columnHeading];
                },
                tooltipValueGetter(node) {
                  return node.data.errors && node.data.errors[column.columnHeading]
                    ? node.data.errors[column.columnHeading]
                    : null;
                },
                cellRenderer: CellRenderer,
                cellEditor: 'agNumberCellEditor',
              });
              break;
            case ColumnTypesEnum.DATE:
              newColumnDefs.push({
                headerName: column.columnHeading,
                field: column.columnHeading,
                editable: true,
                cellRenderer: CellRenderer,
                cellEditor: DatePickerRenderer,
                valueGetter: (node) => {
                  return node.data.record[column.columnHeading];
                },
                tooltipValueGetter(node) {
                  return node.data.errors && node.data.errors[column.columnHeading]
                    ? node.data.errors[column.columnHeading]
                    : null;
                },
              });
              break;
            case ColumnTypesEnum.EMAIL:
              newColumnDefs.push({
                headerName: column.columnHeading,
                field: column.columnHeading,
                editable: true,
                cellRenderer: CellRenderer,
                cellEditor: 'agTextCellEditor',
                valueGetter: (node) => {
                  return node.data.record[column.columnHeading];
                },
                tooltipValueGetter(node) {
                  return node.data.errors && node.data.errors[column.columnHeading]
                    ? node.data.errors[column.columnHeading]
                    : null;
                },
              });
              break;
            case ColumnTypesEnum.SELECT:
              newColumnDefs.push({
                headerName: column.columnHeading,
                field: column.columnHeading,
                editable: true,
                cellRenderer: CellRenderer,
                cellEditor: 'agSelectCellEditor',
                cellEditorParams: {
                  values: column.selectValues,
                },
                tooltipValueGetter(node) {
                  return node.data.errors && node.data.errors[column.columnHeading]
                    ? node.data.errors[column.columnHeading]
                    : null;
                },
                valueGetter: (node) => {
                  return node.data.record[column.columnHeading];
                },
              });
              break;
            case ColumnTypesEnum.REGEX:
              newColumnDefs.push({
                headerName: column.columnHeading,
                field: column.columnHeading,
                editable: true,
                cellRenderer: CellRenderer,
                tooltipValueGetter(node) {
                  return node.data.errors && node.data.errors[column.columnHeading]
                    ? node.data.errors[column.columnHeading]
                    : null;
                },
                cellEditor: 'agLargeTextCellEditor',
                valueGetter: (node) => {
                  return node.data.record[column.columnHeading];
                },
              });
              break;
            default:
              newColumnDefs.push({
                headerName: column.columnHeading,
                field: column.columnHeading,
                editable: true,
                cellRenderer: CellRenderer,
                valueGetter: (node) => {
                  return node.data.record[column.columnHeading];
                },
                tooltipValueGetter(node) {
                  return node.data.errors && node.data.errors[column.columnHeading]
                    ? node.data.errors[column.columnHeading]
                    : null;
                },
              });
              break;
          }
        });
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
        setDataList(data.data);
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
    dataList,
    validator,
    totalPages,
    columnDefs,
    setDataList,
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

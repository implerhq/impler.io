import { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';

import { notifier } from '@util';
import { variables } from '@config';
import { logAmplitudeEvent } from '@amplitude';
import { useAPIState } from '@store/api.context';
import { useAppState } from '@store/app.context';
import { HotItemSchema, IRecordExtended } from '@types';
import { SelectEditor } from '@hooks/Phase3/SelectEditor';
import { MultiSelectEditor } from '@hooks/Phase3/MultiSelectEditor';
import {
  IColumn,
  IReviewData,
  IErrorObject,
  ColumnTypesEnum,
  ColumnDelimiterEnum,
  ReviewDataTypesEnum,
} from '@impler/shared';
import { useUploadInfo } from '@hooks/useUploadInfo';

interface IDataGridProps {
  limit: number;
}

export function useDataGrid({ limit }: IDataGridProps) {
  const { api } = useAPIState();
  const { uploadInfo } = useAppState();
  const { fetchUploadInfo } = useUploadInfo({
    enabled: false,
  });
  const [columns, setColumns] = useState<IOption[]>([]);
  const [headings, setHeadings] = useState<string[]>([]);
  const [frozenColumns, setFrozenColumns] = useState<number>(2);
  const [columnDefs, setColumnDefs] = useState<HotItemSchema[]>([]);
  const [type, setType] = useState<ReviewDataTypesEnum>(ReviewDataTypesEnum.ALL);
  const [showFindReplaceModal, setShowFindReplaceModal] = useState<boolean | undefined>(undefined);
  const [reviewData, setReviewData] = useState<IRecordExtended[]>([
    {
      index: 1,
      isValid: false,
      record: {},
      updated: {},
    },
  ]);

  const { data: templateColumns } = useQuery<unknown, IErrorObject, IColumn[], [string, string]>(
    [`columns:${uploadInfo._id}`, uploadInfo._id],
    () => api.getColumns(uploadInfo._id)
  );

  const { mutate: refetchReviewData, isLoading: isReviewDataLoading } = useMutation<
    IReviewData,
    IErrorObject,
    string,
    [string]
  >(
    ['review'],
    (reviewDataType) => api.getReviewData({ uploadId: uploadInfo._id, page: 1, limit, type: reviewDataType }),
    {
      cacheTime: 0,
      onSuccess(reviewDataResponse) {
        setReviewData(reviewDataResponse.data);
        logAmplitudeEvent('VALIDATE', {
          invalidRecords: reviewDataResponse.totalRecords,
        });
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
    enabled: false,
    onSuccess() {
      fetchUploadInfo();
      refetchReviewData(type);
    },
    onError(error: IErrorObject) {
      notifier.showError({ message: error.message, title: error.error });
    },
  });

  const onTypeChange = (newType: ReviewDataTypesEnum) => {
    setType(newType);
    refetchReviewData(newType);
  };

  useEffect(() => {
    if (templateColumns) {
      let updatedFrozenColumns = 0;
      const dataColumns: IOption[] = [{ value: '', label: 'All columns' }];
      const newColumnDefs: HotItemSchema[] = [];
      const newHeadings: string[] = [];
      templateColumns.forEach((column: IColumn) => {
        if (column.isFrozen) updatedFrozenColumns++;
        newHeadings.push(column.name);
        dataColumns.push({ label: column.name, value: column.key });

        const columnItem: HotItemSchema = {
          className: 'htCenter',
          data: `record.${column.key}`,
          allowEmpty: !column.isRequired,
          allowDuplicate: !column.isUnique,
          description: column.description,
        };

        switch (column.type) {
          case ColumnTypesEnum.STRING:
          case ColumnTypesEnum.EMAIL:
          case ColumnTypesEnum.REGEX:
            columnItem.type = 'text';
            columnItem.renderer = 'custom';
            break;
          case ColumnTypesEnum.SELECT:
          case ColumnTypesEnum.IMAGE:
            columnItem.type = 'text';
            columnItem.renderer = 'custom';
            columnItem.delimiter = column.delimiter || ColumnDelimiterEnum.COMMA;
            columnItem.selectOptions = column.selectValues;
            columnItem.editor = column.allowMultiSelect ? MultiSelectEditor : SelectEditor;
            break;
          case ColumnTypesEnum.NUMBER:
            columnItem.type = 'numeric';
            columnItem.renderer = 'custom';
            break;
          case ColumnTypesEnum.DOUBLE:
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
      setColumns(dataColumns);
      setHeadings(newHeadings);
      setColumnDefs(newColumnDefs);
      setFrozenColumns(updatedFrozenColumns);
    }
  }, [templateColumns]);

  return {
    type,
    columns,
    headings,
    reviewData,
    columnDefs,
    onTypeChange,
    reReviewData,
    frozenColumns,
    setReviewData,
    isDoReviewLoading,
    isReviewDataLoading,
    showFindReplaceModal,
    setShowFindReplaceModal,
    totalRecords: uploadInfo.totalRecords ?? undefined,
    invalidRecords: uploadInfo.invalidRecords ?? undefined,
  };
}

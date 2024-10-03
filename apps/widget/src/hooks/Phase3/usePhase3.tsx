import { useRef, useState } from 'react';
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
  IRecord,
  ReviewDataTypesEnum,
  numberFormatter,
  ColumnDelimiterEnum,
} from '@impler/shared';
import { IUpload } from '@impler/client';
import { SelectEditor } from './SelectEditor';
import { MultiSelectEditor } from './MultiSelectEditor';
import { useCompleteImport } from '@hooks/useCompleteImport';

interface IUsePhase3Props {
  onNext: (uploadData: IUpload, importedData?: Record<string, any>[]) => void;
}

const defaultPage = 1;

interface IRecordExtended extends IRecord {
  checked?: boolean;
}

export function usePhase3({ onNext }: IUsePhase3Props) {
  const { api } = useAPIState();
  const [page, setPage] = useState<number>(defaultPage);
  const [headings, setHeadings] = useState<string[]>([]);
  const selectedRowsRef = useRef<Set<number>>(new Set());
  const [columns, setColumns] = useState<IOption[]>([]);
  const [frozenColumns, setFrozenColumns] = useState<number>(2);
  const selectedRowsCountRef = useRef<{ valid: Set<number>; invalid: Set<number> }>({
    valid: new Set(),
    invalid: new Set(),
  });
  const { uploadInfo, setUploadInfo } = useAppState();
  const [allChecked, setAllChecked] = useState<boolean>(false);
  const [reviewData, setReviewData] = useState<IRecordExtended[]>([]);
  const [columnDefs, setColumnDefs] = useState<HotItemSchema[]>([]);
  const [totalPages, setTotalPages] = useState<number>(defaultPage);
  const [type, setType] = useState<ReviewDataTypesEnum>(ReviewDataTypesEnum.ALL);
  const { completeImport, isCompleteImportLoading } = useCompleteImport({ onNext });
  const [showFindReplaceModal, setShowFindReplaceModal] = useState<boolean | undefined>(undefined);
  const [showAllDataValidModal, setShowAllDataValidModal] = useState<boolean | undefined>(undefined);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState<boolean | undefined>(undefined);

  useQuery<unknown, IErrorObject, ISchemaColumn[], [string, string]>(
    [`columns:${uploadInfo._id}`, uploadInfo._id],
    () => api.getColumns(uploadInfo._id),
    {
      onSuccess(data) {
        let updatedFrozenColumns = 2;
        const dataColumns: IOption[] = [{ value: '', label: 'All columns' }];
        const newColumnDefs: HotItemSchema[] = [];
        const newHeadings: string[] = ['*', 'Sr. No.'];
        newColumnDefs.push({
          type: 'text',
          data: 'record.index',
          readOnly: true,
          editor: false,
          renderer: 'check',
          className: 'check-cell',
          disableVisualSelection: true,
        });
        newColumnDefs.push({
          type: 'text',
          data: 'index',
          readOnly: true,
          className: 'index-cell',
          disableVisualSelection: true,
        });
        data.forEach((column: ISchemaColumn) => {
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
      },
      enabled: !!uploadInfo?._id,
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
    ['review', page, type],
    ([reviewPageNumber, reviewDataType]) =>
      api.getReviewData({ uploadId: uploadInfo._id, page: reviewPageNumber, type: reviewDataType }),
    {
      cacheTime: 0,
      onSuccess(reviewDataResponse) {
        setReviewData(
          reviewDataResponse.data.map((record) => ({ ...record, checked: selectedRowsRef.current.has(record.index) }))
        );
        setAllChecked(reviewDataResponse.data.every((record) => selectedRowsRef.current.has(record.index)));
        if (!reviewDataResponse.data.length) {
          let newPage = page;
          if (reviewDataResponse.page > 1 && reviewDataResponse.totalPages < reviewDataResponse.page) {
            newPage = Math.max(1, Math.min(reviewDataResponse.page, reviewDataResponse.totalPages));
            setPage(newPage);
          } else {
            newPage = reviewDataResponse.page;
            setPage(newPage);
          }
          setTotalPages(Math.max(1, reviewDataResponse.totalPages));
          if (newPage !== page) refetchReviewData([newPage, type]);

          return;
        }
        logAmplitudeEvent('VALIDATE', {
          invalidRecords: reviewDataResponse.totalRecords,
        });
        setPage(reviewDataResponse.page);
        setTotalPages(reviewDataResponse.totalPages);
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
    enabled: !!uploadInfo._id,
    onSuccess() {
      fetchUploadInfo();
      refetchReviewData([page, type]);
      selectedRowsRef.current = new Set();
      selectedRowsCountRef.current = { valid: new Set(), invalid: new Set() };
    },
    onError(error: IErrorObject) {
      notifier.showError({ message: error.message, title: error.error });
    },
  });
  const { mutate: updateRecord } = useMutation<unknown, IErrorObject, Partial<IRecord>, [string]>(
    [`update`],
    (record) => api.updateRecord(uploadInfo._id, record)
  );
  const { mutate: deleteRecords, isLoading: isDeleteRecordLoading } = useMutation<
    unknown,
    IErrorObject,
    [number[], number, number],
    [string]
  >([`delete`], ([indexes, valid, invalid]) => api.deleteRecord(uploadInfo._id, indexes, valid, invalid), {
    onSuccess(data, vars) {
      selectedRowsRef.current.clear();
      selectedRowsCountRef.current = { valid: new Set(), invalid: new Set() };
      const newUploadInfo = { ...uploadInfo };
      newUploadInfo.totalRecords = newUploadInfo.totalRecords - vars[0].length;
      if (vars[1]) {
        newUploadInfo.validRecords = newUploadInfo.validRecords - vars[1];
      }
      if (vars[2]) {
        newUploadInfo.invalidRecords = newUploadInfo.invalidRecords - vars[2];
      }
      const newReviewData = reviewData.filter((record) => !vars[0].includes(record.index));
      setUploadInfo(newUploadInfo);
      setReviewData(newReviewData);
      if (newReviewData.length === 0) {
        refetchReviewData([getPrevPage(page), type]);
      }
      setShowDeleteConfirmModal(false);
      logAmplitudeEvent('RECORDS_DELETED', {
        valid: vars[1],
        invalid: vars[2],
      });
      notifier.showError({
        message: `Successfully deleted ${numberFormatter(vars[1])} valid and ${numberFormatter(
          vars[2]
        )} invalid records. Total ${numberFormatter(vars[1] + vars[2])} records are deleted.`,
        title: `${numberFormatter(vars[1] + vars[2])} records deleted.`,
      });
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
    columns,
    headings,
    totalPages,
    columnDefs,
    allChecked,
    reReviewData,
    updateRecord,
    onPageChange,
    onTypeChange,
    deleteRecords,
    setReviewData,
    setAllChecked,
    frozenColumns,
    completeImport,
    selectedRowsRef,
    isDoReviewLoading,
    isReviewDataLoading,
    selectedRowsCountRef,
    showFindReplaceModal,
    showAllDataValidModal,
    isDeleteRecordLoading,
    isCompleteImportLoading,
    showDeleteConfirmModal,
    setShowFindReplaceModal,
    setShowAllDataValidModal,
    setShowDeleteConfirmModal,
    reviewData: reviewData || [],
    totalRecords: uploadInfo.totalRecords ?? undefined,
    invalidRecords: uploadInfo.invalidRecords ?? undefined,
    refetchReviewData: () => refetchReviewData([page, type]),
  };
}

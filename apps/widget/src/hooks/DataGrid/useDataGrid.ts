import { useEffect, useRef, useState } from 'react';
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
  numberFormatter,
  IRecord,
} from '@impler/shared';
import { useUploadInfo } from '@hooks/useUploadInfo';

interface IDataGridProps {
  limit: number;
}

// Enhanced interface to match usePhase3
interface IRecordExtendedWithSelection extends IRecordExtended {
  checked?: boolean;
}

export function useDataGrid({ limit }: IDataGridProps) {
  const { api } = useAPIState();
  const { uploadInfo, setUploadInfo, data, config } = useAppState();
  const { fetchUploadInfo } = useUploadInfo({
    enabled: false,
  });

  // Enhanced state management similar to usePhase3
  const [columns, setColumns] = useState<IOption[]>([]);
  const selectedRowsRef = useRef<Set<number>>(new Set());
  const selectedRowsCountRef = useRef<{ valid: Set<number>; invalid: Set<number> }>({
    valid: new Set(),
    invalid: new Set(),
  });
  const [allChecked, setAllChecked] = useState<boolean>(false);
  const [headings, setHeadings] = useState<string[]>([]);
  const [frozenColumns, setFrozenColumns] = useState<number>(2);
  const [columnDefs, setColumnDefs] = useState<HotItemSchema[]>([]);
  const [type, setType] = useState<ReviewDataTypesEnum>(ReviewDataTypesEnum.ALL);
  const [showFindReplaceModal, setShowFindReplaceModal] = useState<boolean | undefined>(undefined);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState<boolean | undefined>(undefined);

  // Track the highest index to ensure proper indexing for new records
  const maxIndexRef = useRef<number>(0);

  // Enhanced reviewData with selection state and proper indexing
  const [reviewData, setReviewData] = useState<IRecordExtendedWithSelection[]>(() => {
    if (data) {
      const parsedData = JSON.parse(data);
      const initialData = parsedData.map((record: Record<string, any>, arrayIndex: number) => {
        // Use a proper index system - start from existing max or 1
        const recordIndex = record.index || arrayIndex + 1;
        maxIndexRef.current = Math.max(maxIndexRef.current, recordIndex);

        return {
          index: recordIndex,
          record,
          updated: {},
          isValid: false,
          checked: false,
        };
      });

      return initialData;
    } else {
      // For manual entry, start with index 1
      maxIndexRef.current = 1;

      return [
        {
          index: 1,
          isValid: false,
          record: {},
          updated: {},
          checked: false,
        },
      ];
    }
  });

  // Method to get next available index for new records
  const getNextRecordIndex = () => {
    maxIndexRef.current += 1;

    return maxIndexRef.current;
  };

  const { data: templateColumns, isLoading: isTemplateColumnsLoading } = useQuery<
    unknown,
    IErrorObject,
    IColumn[],
    [string, string]
  >([`columns:${uploadInfo._id}`, uploadInfo._id], () => api.getColumns(uploadInfo._id));

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
        // Update max index based on fetched data
        const maxFetchedIndex = Math.max(...reviewDataResponse.data.map((record) => record.index), maxIndexRef.current);
        maxIndexRef.current = maxFetchedIndex;

        // Enhanced to include selection state
        setReviewData(
          reviewDataResponse.data.map((record) => ({
            ...record,
            checked: selectedRowsRef.current.has(record.index),
          }))
        );
        setAllChecked(reviewDataResponse.data.every((record) => selectedRowsRef.current.has(record.index)));
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
      // Clear selections on re-review
      selectedRowsRef.current = new Set();
      selectedRowsCountRef.current = { valid: new Set(), invalid: new Set() };
    },
    onError(error: IErrorObject) {
      console.log('ERROR IS >', error.message);
      notifier.showError({ message: error.message, title: error.error });
    },
  });

  // Add mutation for updating records with better error handling
  const { mutate: updateRecord } = useMutation<unknown, IErrorObject, Partial<IRecord>, [string]>(
    [`update`],
    (record) => api.updateRecord(uploadInfo._id, record),
    {
      onError(error: IErrorObject) {
        console.error('Update record error:', error);
        notifier.showError({
          message: error.message || 'Failed to update record',
          title: 'Update Error',
        });
      },
    }
  );

  // Add mutation for deleting records with improved statistics handling
  const { mutate: deleteRecords, isLoading: isDeleteRecordLoading } = useMutation<
    unknown,
    IErrorObject,
    [number[], number, number],
    [string]
  >([`delete`], ([indexes, valid, invalid]) => api.deleteRecord(uploadInfo._id, indexes, valid, invalid), {
    onSuccess(apiResponseData, vars) {
      selectedRowsRef.current.clear();
      selectedRowsCountRef.current = { valid: new Set(), invalid: new Set() };

      const [deletedIndexes, validDeleted, invalidDeleted] = vars;

      // Update upload info with proper bounds checking
      const newUploadInfo = { ...uploadInfo };
      newUploadInfo.totalRecords = Math.max(0, (newUploadInfo.totalRecords || 0) - deletedIndexes.length);

      if (validDeleted > 0) {
        newUploadInfo.validRecords = Math.max(0, (newUploadInfo.validRecords || 0) - validDeleted);
      }
      if (invalidDeleted > 0) {
        newUploadInfo.invalidRecords = Math.max(0, (newUploadInfo.invalidRecords || 0) - invalidDeleted);
      }

      // Filter out deleted records from review data
      const newReviewData = reviewData.filter((record) => !deletedIndexes.includes(record.index));

      setUploadInfo(newUploadInfo);
      setReviewData(newReviewData);
      setShowDeleteConfirmModal(false);

      logAmplitudeEvent('RECORDS_DELETED', {
        valid: validDeleted,
        invalid: invalidDeleted,
      });

      notifier.showError({
        message: `Successfully deleted ${numberFormatter(validDeleted)} valid and ${numberFormatter(
          invalidDeleted
        )} invalid records. Total ${numberFormatter(validDeleted + invalidDeleted)} records deleted.`,
        title: `${numberFormatter(validDeleted + invalidDeleted)} records deleted.`,
      });
    },
    onError(error: IErrorObject) {
      console.error('Delete records error:', error);
      notifier.showError({
        message: error.message || 'Failed to delete records',
        title: 'Delete Error',
      });
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

      // Add checkbox column if not hidden
      if (!config?.hideCheckBox) {
        newHeadings.push('');
        updatedFrozenColumns++;
        newColumnDefs.push({
          type: 'text',
          data: 'record.index',
          readOnly: true,
          editor: false,
          renderer: 'check',
          className: 'check-cell',
          disableVisualSelection: true,
        });
      }

      // Add Sr No column if not hidden
      if (!config?.hideSrNo) {
        newHeadings.push('Sr. No.');
        updatedFrozenColumns++;
        newColumnDefs.push({
          type: 'text',
          data: 'index',
          readOnly: true,
          className: 'index-cell',
          disableVisualSelection: true,
        });
      }

      // Add template columns
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
            columnItem.datePickerConfig = {
              yearRange: [1900, 3000],
            };
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
    allChecked,
    onTypeChange,
    reReviewData,
    frozenColumns,
    setReviewData,
    setAllChecked,
    updateRecord,
    deleteRecords,
    selectedRowsRef,
    isDoReviewLoading,
    isReviewDataLoading,
    selectedRowsCountRef,
    showFindReplaceModal,
    showDeleteConfirmModal,
    isDeleteRecordLoading,
    setShowFindReplaceModal,
    setShowDeleteConfirmModal,
    isTemplateColumnsLoading,
    getNextRecordIndex, // Export this method
    // Ensure non-negative values
    totalRecords: Math.max(0, uploadInfo.totalRecords ?? 0),
    invalidRecords: Math.max(0, uploadInfo.invalidRecords ?? 0),
    // Add config flags from usePhase3
    hideFindAndReplaceButton: config?.hideFindAndReplaceButton,
    hideDeleteButton: config?.hideDeleteButton,
    hideCheckBox: config?.hideCheckBox,
  };
}

import { Flex, Group, Stack, Badge } from '@mantine/core';
import { HotTableClass } from '@handsontable/react';
import { useEffect, useRef, useState } from 'react';

import { PhasesEnum } from '@types';
import { Button } from '@ui/Button';
import { MANUAL_ENTRY_LIMIT } from '@config';
import { Table } from 'components/Common/Table';
import { Footer } from 'components/Common/Footer';
import { LoadingOverlay } from '@ui/LoadingOverlay';
import { IUpload, WIDGET_TEXTS } from '@impler/client';
import { SegmentedControl } from '@ui/SegmentedControl';
import { useDataGrid } from '@hooks/DataGrid/useDataGrid';
import { useCompleteImport } from '@hooks/useCompleteImport';
import { FindReplaceModal } from 'components/widget/modals/FindReplace';
import { ConfirmModal } from 'components/widget/modals/ConfirmModal';
import { numberFormatter, replaceVariablesInString } from '@impler/shared';
import { useBatchedUpdateRecord } from '@hooks/DataGrid/useBatchUpdateRecords';

interface IPhase12Props {
  onPrevClick: () => void;
  texts: typeof WIDGET_TEXTS;
  onNextClick: (uploadData: IUpload, importedData?: Record<string, any>[]) => void;
}

export function DataGrid({ onNextClick, onPrevClick, texts }: IPhase12Props) {
  const tableRef = useRef<HotTableClass>(null);
  const {
    type,
    columns,
    headings,
    reviewData,
    columnDefs,
    allChecked,
    onTypeChange,
    reReviewData,
    totalRecords,
    setReviewData,
    setAllChecked,
    frozenColumns,
    deleteRecords,
    invalidRecords,
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
    hideFindAndReplaceButton,
    hideDeleteButton,
    hideCheckBox,
    getNextRecordIndex, // Add this method to get proper index
  } = useDataGrid({ limit: MANUAL_ENTRY_LIMIT });

  const validRecordsCount = totalRecords - invalidRecords;
  const hasValidRecords = validRecordsCount > 0;
  const [isPasteLoading, setIsPasteLoading] = useState<boolean>(false);

  // Use a ref to track pending updates to avoid duplicate calls
  const pendingUpdatesRef = useRef<Set<string>>(new Set());

  const { updateRecord: batchUpdateRecord } = useBatchedUpdateRecord({
    onUpdate: () => {
      reReviewData();
      setIsPasteLoading(false);
    },
  });

  const tableWrapperRef = useRef<HTMLDivElement>() as React.MutableRefObject<HTMLDivElement>;
  const { completeImport, isCompleteImportLoading } = useCompleteImport({ onNext: onNextClick });
  const [tableWrapperDimensions, setTableWrapperDimentions] = useState({
    height: 200,
    width: 500,
  });

  // Generate column descriptions for the table
  const columnDescriptions = columnDefs.map((column) => column.description || '');

  useEffect(() => {
    //  setting wrapper height
    setTableWrapperDimentions({
      height: tableWrapperRef.current.getBoundingClientRect().height - 50,
      width: tableWrapperRef.current.getBoundingClientRect().width,
    });
  }, []);

  // Fixed onValueChange handler
  const handleValueChange = (row: number, prop: string, oldVal: any, newVal: any) => {
    const name = String(prop).replace('record.', '');
    const currentData = [...reviewData];

    // Skip if no actual change
    if (
      oldVal === newVal ||
      (oldVal === '' && newVal === undefined) ||
      (newVal === '' && (oldVal === undefined || oldVal === null))
    ) {
      return;
    }

    if (currentData && currentData[row]) {
      // Ensure proper index assignment for new records
      if (!currentData[row].index) {
        currentData[row].index = getNextRecordIndex();
      }

      // Create update key to prevent duplicates
      const updateKey = `${currentData[row].index}-${name}-${Date.now()}`;

      // Check if this update is already pending
      if (pendingUpdatesRef.current.has(updateKey)) {
        return;
      }

      pendingUpdatesRef.current.add(updateKey);

      if (!currentData[row].updated) {
        currentData[row].updated = {};
      }

      currentData[row].record[name] = newVal === '' ? null : newVal;
      currentData[row].updated[name] = true;
      setReviewData(currentData);

      // Use only one update method to avoid double counting
      const recordUpdate = {
        index: currentData[row].index,
        record: currentData[row].record,
        updated: currentData[row].updated,
      };

      // Use batch update for better performance and consistency
      batchUpdateRecord(recordUpdate);

      // Clean up pending update after a delay
      setTimeout(() => {
        pendingUpdatesRef.current.delete(updateKey);
      }, 1000);
    }
  };

  return (
    <>
      <LoadingOverlay visible={isTemplateColumnsLoading || isPasteLoading || isDeleteRecordLoading} />

      <Stack ref={tableWrapperRef} style={{ flexGrow: 1 }} spacing="xs" align="flex-start">
        <Flex direction="row" justify="space-between" w="100%">
          <SegmentedControl
            value={type}
            onChange={onTypeChange}
            items={[
              {
                value: 'all',
                label: replaceVariablesInString(texts.PHASE3.LABEL_ALL_RECORDS, {
                  records: numberFormatter(totalRecords),
                }),
              },
              {
                value: 'valid',
                label: replaceVariablesInString(texts.PHASE3.LABEL_VALID_RECORDS, {
                  records: numberFormatter(Math.max(0, totalRecords - invalidRecords)),
                }),
              },
              {
                value: 'invalid',
                label: replaceVariablesInString(texts.PHASE3.LABEL_INVALID_RECORDS, {
                  records: numberFormatter(Math.max(0, invalidRecords)),
                }),
              },
            ]}
          />
          <Group spacing="xs">
            {!hideFindAndReplaceButton && (
              <Button onClick={() => setShowFindReplaceModal(true)}>{texts.PHASE3.FIND_REPLACE}</Button>
            )}
            {!hideDeleteButton && (
              <Button
                color="red"
                disabled={!selectedRowsRef.current.size}
                onClick={() => setShowDeleteConfirmModal(true)}
              >
                {texts.COMMON.DELETE}
                <Badge variant="gradient" ml="xs" color="red">
                  {numberFormatter(selectedRowsRef.current.size)}
                </Badge>
              </Button>
            )}
          </Group>
        </Flex>
        <Table
          rowHeaders={false}
          ref={tableRef}
          minSpareRows={1}
          data={reviewData}
          headings={headings}
          selectEnabled={true}
          columnDefs={columnDefs}
          allChecked={allChecked}
          hideCheckBox={hideCheckBox}
          columnDescriptions={columnDescriptions}
          beforePaste={() => setIsPasteLoading(true)}
          onValueChange={handleValueChange}
          // Add row selection handlers from Phase3
          onRowCheck={(rowIndex, recordIndex, checked) => {
            const currentData = [...reviewData];

            const isEmptyRow = Object.values(currentData[rowIndex].record || {}).every((value) => {
              return value === '' || value === null || value === undefined;
            });

            if (isEmptyRow && checked) {
              return;
            }

            currentData[rowIndex].checked = checked;
            const newSelectedRowsCountRef = { ...selectedRowsCountRef.current };

            if (checked) {
              selectedRowsRef.current.add(recordIndex);
              if (currentData[rowIndex].isValid) newSelectedRowsCountRef.valid.add(recordIndex);
              else newSelectedRowsCountRef.invalid.add(recordIndex);
            } else {
              selectedRowsRef.current.delete(recordIndex);
              if (currentData[rowIndex].isValid) newSelectedRowsCountRef.valid.delete(recordIndex);
              else newSelectedRowsCountRef.invalid.delete(recordIndex);
            }

            setReviewData(currentData);
            selectedRowsCountRef.current = newSelectedRowsCountRef;
            setAllChecked(
              selectedRowsRef.current.size ===
                currentData.filter(
                  (row) =>
                    !Object.values(row.record || {}).every(
                      (value) => value === '' || value === null || value === undefined
                    )
                ).length
            );
          }}
          onCheckAll={(checked) => {
            setAllChecked(checked);
            const currentData = [...reviewData];
            const newSelectedRows = new Set<number>();
            const newSelectedRowsCountRef = { valid: new Set<number>(), invalid: new Set<number>() };

            currentData.forEach((record, index) => {
              // Fixed: Added return statement for empty row detection
              const isEmptyRow = Object.values(record.record || {}).every((value) => {
                return value === '' || value === null || value === undefined;
              });

              if (isEmptyRow) {
                currentData[index].checked = false;

                return; // Skip empty rows
              }

              currentData[index].checked = checked;
              if (checked) {
                newSelectedRows.add(record.index);
                if (record.isValid) newSelectedRowsCountRef.valid.add(record.index);
                else newSelectedRowsCountRef.invalid.add(record.index);
              }
            });

            selectedRowsRef.current = newSelectedRows;
            selectedRowsCountRef.current = newSelectedRowsCountRef;
            setReviewData(currentData);
          }}
          frozenColumns={frozenColumns}
          width={tableWrapperDimensions.width}
          height={tableWrapperDimensions.height}
        />
      </Stack>

      <Footer
        onPrevClick={onPrevClick}
        onNextClick={completeImport}
        active={PhasesEnum.MANUAL_ENTRY}
        primaryButtonLoading={isDoReviewLoading || isReviewDataLoading || isCompleteImportLoading}
        primaryButtonTooltip={
          invalidRecords > 0
            ? texts['PHASE1-2'].FIX_INVALID_DATA
            : !hasValidRecords
            ? 'No valid records to import'
            : undefined
        }
        primaryButtonDisabled={
          // Only disable if there are invalid records OR no valid records at all
          invalidRecords > 0 || !hasValidRecords
        }
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        onCancel={() => setShowDeleteConfirmModal(false)}
        title={replaceVariablesInString(texts.DELETE_RECORDS_CONFIRMATION.TITLE, {
          total: numberFormatter(selectedRowsRef.current.size),
        })}
        onConfirm={() => {
          setShowDeleteConfirmModal(false);

          // Filter out empty rows before deletion
          const nonEmptySelectedRows = Array.from(selectedRowsRef.current).filter((index) => {
            const record = reviewData.find((reviewDatas) => reviewDatas.index === index);

            return (
              record &&
              !Object.values(record.record || {}).every(
                (value) => value === '' || value === null || value === undefined
              )
            );
          });

          // Update the selected rows ref to only include non-empty rows
          selectedRowsRef.current = new Set(nonEmptySelectedRows);

          // Recalculate valid/invalid counts for non-empty rows only
          const validCount = nonEmptySelectedRows.filter(
            (index) => reviewData.find((reviewDataa) => reviewDataa.index === index)?.isValid
          ).length;
          const invalidCount = nonEmptySelectedRows.length - validCount;

          deleteRecords([nonEmptySelectedRows, validCount, invalidCount]);
        }}
        cancelLabel={texts.DELETE_RECORDS_CONFIRMATION.CANCEL_DELETE}
        confirmLabel={texts.DELETE_RECORDS_CONFIRMATION.CONFIRM_DELETE}
        opened={!!showDeleteConfirmModal}
        subTitle={texts.DELETE_RECORDS_CONFIRMATION.DETAILS}
      />

      <FindReplaceModal
        texts={texts}
        columns={columns}
        opened={!!showFindReplaceModal}
        cancelLabel={texts.COMMON.CANCEL}
        replaceLabel={texts.PHASE3.REPLACE}
        refetchReviewData={reReviewData}
        onClose={() => setShowFindReplaceModal(false)}
      />
    </>
  );
}

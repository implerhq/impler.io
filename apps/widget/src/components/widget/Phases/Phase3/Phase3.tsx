import { Badge, Flex, Group, Stack } from '@mantine/core';
import { useRef, useState, useEffect } from 'react';
import HotTableClass from '@handsontable/react/hotTableClass';

import { PhasesEnum } from '@types';
import { logAmplitudeEvent } from '@amplitude';
import { usePhase3 } from '@hooks/Phase3/usePhase3';
import { IUpload, WIDGET_TEXTS } from '@impler/client';
import { numberFormatter, replaceVariablesInString } from '@impler/shared';

import { Table } from 'components/Common/Table';
import { Footer } from 'components/Common/Footer';
import { ReviewConfirmModal } from './ReviewConfirmModal';

import { Button } from '@ui/Button';
import { Pagination } from '@ui/Pagination';
import { LoadingOverlay } from '@ui/LoadingOverlay';
import { SegmentedControl } from '@ui/SegmentedControl';
import { ConfirmModal } from 'components/widget/modals/ConfirmModal';
import { FindReplaceModal } from 'components/widget/modals/FindReplace';

interface IPhase3Props {
  onNextClick: (uploadData: IUpload, importedData?: Record<string, any>[]) => void;
  onPrevClick: () => void;
  texts: typeof WIDGET_TEXTS;
}

export function Phase3(props: IPhase3Props) {
  const tableRef = useRef<HotTableClass>(null);
  const { onNextClick, onPrevClick, texts } = props;
  const {
    page,
    type,
    columns,
    headings,
    columnDefs,
    totalPages,
    reviewData,
    allChecked,
    totalRecords,
    onTypeChange,
    reReviewData,
    updateRecord,
    onPageChange,
    frozenColumns,
    setReviewData,
    setAllChecked,
    deleteRecords,
    invalidRecords,
    completeImport,
    selectedRowsRef,
    refetchReviewData,
    isDoReviewLoading,
    isReviewDataLoading,
    selectedRowsCountRef,
    showFindReplaceModal,
    showAllDataValidModal,
    isDeleteRecordLoading,
    showDeleteConfirmModal,
    setShowFindReplaceModal,
    isCompleteImportLoading,
    setShowAllDataValidModal,
    setShowDeleteConfirmModal,
  } = usePhase3({ onNext: onNextClick });
  const tableWrapperRef = useRef<HTMLDivElement>() as React.MutableRefObject<HTMLDivElement>;
  const [tableWrapperDimensions, setTableWrapperDimentions] = useState({
    height: 200,
    width: 500,
  });
  const columnDescriptions = columnDefs.map((column) => column.description || '');

  useEffect(() => {
    //  setting wrapper height
    setTableWrapperDimentions({
      height: tableWrapperRef.current.getBoundingClientRect().height - 50,
      width: tableWrapperRef.current.getBoundingClientRect().width,
    });
  }, []);

  const onReviewConfirmed = () => {
    logAmplitudeEvent('CONFIRM');
    completeImport();
  };

  return (
    <>
      <LoadingOverlay
        visible={isReviewDataLoading || isDoReviewLoading || isCompleteImportLoading || isDeleteRecordLoading}
      />

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
                  records: numberFormatter(totalRecords - invalidRecords),
                }),
              },
              {
                value: 'invalid',
                label: replaceVariablesInString(texts.PHASE3.LABEL_INVALID_RECORDS, {
                  records: numberFormatter(invalidRecords),
                }),
              },
            ]}
          />
          <Group spacing="xs">
            <Button onClick={() => setShowFindReplaceModal(true)}>{texts.PHASE3.FIND_REPLACE}</Button>
            <Button
              color="red"
              disabled={!selectedRowsRef.current.size}
              onClick={() => setShowDeleteConfirmModal(true)}
            >
              {texts.COMMON.DELETE}
              <Badge variant="light" ml="xs" color="red">
                {numberFormatter(selectedRowsRef.current.size)}
              </Badge>
            </Button>
          </Group>
        </Flex>
        <Table
          ref={tableRef}
          frozenColumns={frozenColumns}
          width={tableWrapperDimensions.width}
          height={tableWrapperDimensions.height}
          onValueChange={(row, prop, oldVal, newVal) => {
            const name = String(prop).replace('record.', '');

            const currentData = [...reviewData];

            if (
              currentData &&
              oldVal != newVal &&
              !(oldVal === '' && newVal === undefined) &&
              !(newVal === '' && (oldVal === undefined || oldVal === null))
            ) {
              if (!currentData[row].updated) {
                currentData[row].updated = {};
              }
              currentData[row].record[name] = newVal === '' ? null : newVal;
              currentData[row].updated[name] = true;
              setReviewData(currentData);
              updateRecord({
                index: currentData[row].index,
                record: currentData[row].record,
                updated: currentData[row].updated,
              });
            }
          }}
          onRowCheck={(rowIndex, recordIndex, checked) => {
            const currentData = [...reviewData];
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
            setAllChecked(selectedRowsRef.current.size === currentData.length);
          }}
          onCheckAll={(checked) => {
            setAllChecked(checked);
            const currentData = [...reviewData];
            currentData.forEach((record) => {
              record.checked = checked;
            });
            const newSelectedRows = selectedRowsRef.current;
            const newSelectedRowsCountRef = { ...selectedRowsCountRef.current };
            currentData.forEach((record) => {
              if (checked) {
                newSelectedRows.add(record.index);
                if (record.isValid) newSelectedRowsCountRef.valid.add(record.index);
                else newSelectedRowsCountRef.invalid.add(record.index);
              } else {
                newSelectedRows.delete(record.index);
                if (record.isValid) newSelectedRowsCountRef.valid.delete(record.index);
                else newSelectedRowsCountRef.invalid.delete(record.index);
              }
            });
            selectedRowsRef.current = newSelectedRows;
            selectedRowsCountRef.current = newSelectedRowsCountRef;
            setReviewData(currentData);
          }}
          data={reviewData}
          headings={headings}
          columnDefs={columnDefs}
          allChecked={allChecked}
          columnDescriptions={columnDescriptions}
        />
      </Stack>
      <Pagination page={page} total={totalPages} onChange={onPageChange} />

      <Footer
        primaryButtonLoading={isCompleteImportLoading}
        active={PhasesEnum.REVIEW}
        onNextClick={reReviewData}
        onPrevClick={onPrevClick}
      />
      <ReviewConfirmModal
        texts={texts}
        opened={!!showAllDataValidModal}
        onClose={() => setShowAllDataValidModal(false)}
        onConfirm={onReviewConfirmed}
        totalRecords={totalRecords}
      />
      <ConfirmModal
        onCancel={() => setShowDeleteConfirmModal(false)}
        title={replaceVariablesInString(texts.DELETE_RECORDS_CONFIRMATION.TITLE, {
          total: numberFormatter(selectedRowsRef.current.size),
        })}
        onConfirm={() => {
          setShowDeleteConfirmModal(false);
          deleteRecords([
            Array.from(selectedRowsRef.current),
            selectedRowsCountRef.current.valid.size,
            selectedRowsCountRef.current.invalid.size,
          ]);
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
        refetchReviewData={refetchReviewData}
        onClose={() => setShowFindReplaceModal(false)}
      />
    </>
  );
}

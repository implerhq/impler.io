import { Badge, Flex, Stack } from '@mantine/core';
import { useRef, useState, useEffect } from 'react';
import HotTableClass from '@handsontable/react/hotTableClass';

import { PhasesEnum } from '@types';
import { logAmplitudeEvent } from '@amplitude';
import { usePhase3 } from '@hooks/Phase3/usePhase3';
import { IUpload, numberFormatter, replaceVariablesInString } from '@impler/shared';

import { ReviewConfirmModal } from './ReviewConfirmModal';
import { Table } from 'components/Common/Table';
import { Footer } from 'components/Common/Footer';

import { TEXTS } from '@config';
import { Button } from '@ui/Button';
import { Pagination } from '@ui/Pagination';
import { LoadingOverlay } from '@ui/LoadingOverlay';
import { SegmentedControl } from '@ui/SegmentedControl';
import { ConfirmModal } from 'components/widget/modals/ConfirmModal';

interface IPhase3Props {
  onNextClick: (uploadData: IUpload, importedData?: Record<string, any>[]) => void;
  onPrevClick: () => void;
}

export function Phase3(props: IPhase3Props) {
  const tableRef = useRef<HotTableClass>(null);
  const { onNextClick, onPrevClick } = props;
  const {
    page,
    type,
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
    onConfirmReview,
    selectedRowsRef,
    isDoReviewLoading,
    isReviewDataLoading,
    selectedRowsCountRef,
    showAllDataValidModal,
    isDeleteRecordLoading,
    isConfirmReviewLoading,
    showDeleteConfirmModal,
    setShowAllDataValidModal,
    setShowDeleteConfirmModal,
  } = usePhase3({ onNext: onNextClick });
  const tableWrapperRef = useRef<HTMLDivElement>() as React.MutableRefObject<HTMLDivElement>;
  const [tableWrapperDimensions, setTableWrapperDimentions] = useState({
    height: 200,
    width: 500,
  });

  useEffect(() => {
    //  setting wrapper height
    setTableWrapperDimentions({
      height: tableWrapperRef.current.getBoundingClientRect().height - 50,
      width: tableWrapperRef.current.getBoundingClientRect().width,
    });
  }, []);

  const onReviewConfirmed = () => {
    logAmplitudeEvent('CONFIRM');
    onConfirmReview();
  };

  return (
    <>
      <LoadingOverlay
        visible={isReviewDataLoading || isDoReviewLoading || isConfirmReviewLoading || isDeleteRecordLoading}
      />

      <Stack ref={tableWrapperRef} style={{ flexGrow: 1 }} spacing="xs" align="flex-start">
        <Flex direction="row" justify="space-between" w="100%">
          <SegmentedControl
            value={type}
            onChange={onTypeChange}
            items={[
              { value: 'all', label: `All ${numberFormatter(totalRecords)}` },
              { value: 'valid', label: `Valid ${numberFormatter(totalRecords - invalidRecords)}` },
              { value: 'invalid', label: `Invalid ${numberFormatter(invalidRecords)}` },
            ]}
          />
          <Button color="red" disabled={!selectedRowsRef.current.size} onClick={() => setShowDeleteConfirmModal(true)}>
            Delete
            <Badge variant="light" ml="xs" color="red">
              {numberFormatter(selectedRowsRef.current.size)}
            </Badge>
          </Button>
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
        />
      </Stack>
      <Pagination page={page} total={totalPages} onChange={onPageChange} />

      <Footer
        primaryButtonLoading={isConfirmReviewLoading}
        active={PhasesEnum.REVIEW}
        onNextClick={reReviewData}
        onPrevClick={onPrevClick}
      />
      <ReviewConfirmModal
        opened={!!showAllDataValidModal}
        onClose={() => setShowAllDataValidModal(false)}
        onConfirm={onReviewConfirmed}
        totalRecords={totalRecords}
      />
      <ConfirmModal
        onCancel={() => setShowDeleteConfirmModal(false)}
        title={replaceVariablesInString(TEXTS.DELETE_CONFIRMATION.TITLE, {
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
        cancelLabel={TEXTS.DELETE_CONFIRMATION.NO}
        confirmLabel={TEXTS.DELETE_CONFIRMATION.YES}
        opened={!!showDeleteConfirmModal}
        subTitle={TEXTS.DELETE_CONFIRMATION.SUBTITLE}
      />
    </>
  );
}

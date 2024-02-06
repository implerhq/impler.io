import { Stack } from '@mantine/core';
import { HotTable } from '@handsontable/react';
import { useRef, useState, useEffect } from 'react';

import { PhasesEnum } from '@types';
import { IUpload, numberFormatter } from '@impler/shared';
import { logAmplitudeEvent } from '@amplitude';
import { usePhase3 } from '@hooks/Phase3/usePhase3';

import { ConfirmModal } from '../ConfirmModal';
import { Table } from 'components/Common/Table';
import { Footer } from 'components/Common/Footer';

import { Pagination } from '@ui/Pagination';
import { LoadingOverlay } from '@ui/LoadingOverlay';
import { SegmentedControl } from '@ui/SegmentedControl';

interface IPhase3Props {
  onNextClick: (uploadData: IUpload) => void;
  onPrevClick: () => void;
}

export function Phase3(props: IPhase3Props) {
  const tableRef = useRef<HotTable>(null);
  const { onNextClick, onPrevClick } = props;
  const {
    page,
    type,
    headings,
    columnDefs,
    totalPages,
    reviewData,
    deleteRecord,
    onTypeChange,
    reReviewData,
    updateRecord,
    onPageChange,
    setReviewData,
    totalRecords,
    invalidRecords,
    onConfirmReview,
    isDoReviewLoading,
    isReviewDataLoading,
    showAllDataValidModal,
    isDeleteRecordLoading,
    isConfirmReviewLoading,
    setShowAllDataValidModal,
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
        <SegmentedControl
          value={type}
          onChange={onTypeChange}
          allDataLength={numberFormatter(totalRecords)}
          invalidDataLength={numberFormatter(invalidRecords)}
          validDataLength={numberFormatter(totalRecords - invalidRecords)}
        />
        <Table
          ref={tableRef}
          onRecordDelete={(index, isValid) => deleteRecord([index, isValid])}
          width={tableWrapperDimensions.width}
          height={tableWrapperDimensions.height}
          onValueChange={(row, prop, oldVal, newVal) => {
            const name = String(prop).replace('record.', '');

            const currentData = [...reviewData];

            if (currentData && oldVal != newVal && !(oldVal === '' && newVal === undefined)) {
              if (!currentData[row].updated) {
                currentData[row].updated = {};
              }
              currentData[row].record[name] = newVal;
              currentData[row].updated[name] = true;
              setReviewData(currentData);
              updateRecord(currentData[row]);
            }
          }}
          data={reviewData}
          headings={headings}
          columnDefs={columnDefs}
        />
      </Stack>
      <Pagination page={page} total={totalPages} onChange={onPageChange} />

      <Footer
        primaryButtonLoading={isConfirmReviewLoading}
        active={PhasesEnum.REVIEW}
        onNextClick={reReviewData}
        onPrevClick={onPrevClick}
      />
      <ConfirmModal
        opened={!!showAllDataValidModal}
        onClose={() => setShowAllDataValidModal(false)}
        onConfirm={onReviewConfirmed}
        totalRecords={totalRecords}
      />
    </>
  );
}

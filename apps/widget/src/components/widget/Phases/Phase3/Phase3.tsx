import { Group, Text } from '@mantine/core';
import { HotTable } from '@handsontable/react';
import { useRef, useState, useEffect } from 'react';

import { PhasesEum } from '@types';
import { colors, TEXTS, variables } from '@config';
import { IUpload, numberFormatter, replaceVariablesInString } from '@impler/shared';
import { CheckIcon, Warning } from '@icons';
import { usePhase3 } from '@hooks/Phase3/usePhase3';

import useStyles from './Styles';
import { Pagination } from '@ui/Pagination';
import { ConfirmModal } from '../ConfirmModal';
import { Table } from 'components/Common/Table';
import { Footer } from 'components/Common/Footer';
import { LoadingOverlay } from '@ui/LoadingOverlay';
import { logAmplitudeEvent } from '@amplitude';

interface IPhase3Props {
  onNextClick: (uploadData: IUpload) => void;
  onPrevClick: () => void;
}

export function Phase3(props: IPhase3Props) {
  const { classes } = useStyles();
  const tableRef = useRef<HotTable>(null);
  const { onNextClick, onPrevClick } = props;
  const {
    page,
    headings,
    columnDefs,
    totalPages,
    reviewData,
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
    isConfirmReviewLoading,
    setShowAllDataValidModal,
  } = usePhase3({ onNext: onNextClick });
  const tableWrapperRef = useRef<HTMLDivElement>() as React.MutableRefObject<HTMLDivElement>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  const [tableWrapperDimensions, setTableWrapperDimentions] = useState({
    height: 200,
    width: 500,
  });

  useEffect(() => {
    //  setting wrapper height
    setTableWrapperDimentions({
      height: tableWrapperRef.current.getBoundingClientRect().height,
      width: tableWrapperRef.current.getBoundingClientRect().width,
    });
  }, []);

  const onReviewConfirmed = () => {
    logAmplitudeEvent('CONFIRM');
    onConfirmReview();
  };

  return (
    <>
      <LoadingOverlay visible={isReviewDataLoading || isDoReviewLoading || isConfirmReviewLoading} />
      {typeof invalidRecords === 'undefined' || typeof totalRecords === 'undefined' ? null : (
        <Group align="center" spacing="xs">
          {invalidRecords === variables.baseIndex ? (
            <>
              <CheckIcon fill={colors.success} className={classes.successIcon} />
              <Text size="xs" inline color={colors.success} style={{ flex: 1 }}>
                {replaceVariablesInString(TEXTS.PHASE3.VALID_DATA_INFO, {
                  total: numberFormatter(totalRecords),
                })}
              </Text>
            </>
          ) : (
            <>
              <Warning fill={colors.red} className={classes.warningIcon} />
              <Text size="xs" inline color={colors.red} style={{ flex: 1 }}>
                {replaceVariablesInString(TEXTS.PHASE3.INVALID_DATA_INFO, {
                  total: numberFormatter(totalRecords),
                  invalid: numberFormatter(invalidRecords),
                })}
              </Text>
            </>
          )}
        </Group>
      )}

      <div ref={tableWrapperRef} style={{ flexGrow: 1 }}>
        <Table
          width={tableWrapperDimensions.width}
          height={tableWrapperDimensions.height}
          ref={tableRef}
          onValueChange={(row, prop, oldVal, newVal) => {
            const name = String(prop).replace('record.', '');

            const currentData = [...reviewData];
            if (currentData && oldVal !== newVal) {
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
      </div>
      <Pagination page={page} total={totalPages} onChange={onPageChange} />

      <Footer
        primaryButtonLoading={isConfirmReviewLoading}
        active={PhasesEum.REVIEW}
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

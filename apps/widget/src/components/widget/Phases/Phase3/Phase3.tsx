import { colors, TEXTS } from '@config';
import { usePhase3 } from '@hooks/Phase3/usePhase3';
import { Download, Warning } from '@icons';
import { IUpload } from '@impler/shared';
import { Group, Text } from '@mantine/core';
import { PhasesEum } from '@types';
import { Button } from '@ui/Button';
import { LoadingOverlay } from '@ui/LoadingOverlay';
import { Pagination } from '@ui/Pagination';
import { Table } from '@ui/Table';
import { Footer } from 'components/Common/Footer';
import { useRef, useState, useEffect } from 'react';
import { ConfirmModal } from '../ConfirmModal';
import useStyles from './Styles';
import { logAmplitudeEvent, resetAmplitude } from '@amplitude';

interface IPhase3Props {
  onNextClick: (uploadData: IUpload) => void;
  onPrevClick: () => void;
}

export function Phase3(props: IPhase3Props) {
  const { classes } = useStyles();
  const { onNextClick, onPrevClick } = props;
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const {
    onPageChange,
    onExportData,
    heaings,
    isInitialDataLoaded,
    reviewData,
    page,
    totalPages,
    totalData,
    onConfirmReview,
    isConfirmReviewLoading,
  } = usePhase3({ onNext: onNextClick });
  const tableWrapperRef = useRef<HTMLDivElement>() as React.MutableRefObject<HTMLDivElement>;
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

  const onConfirmClick = () => {
    setShowConfirmModal(true);
  };

  const onReviewConfirmed = (exempt: boolean) => {
    logAmplitudeEvent('CONFIRM', { exempt });
    resetAmplitude();
    setShowConfirmModal(false);
    onConfirmReview(exempt);
  };

  return (
    <>
      <LoadingOverlay visible={!isInitialDataLoaded || isConfirmReviewLoading} />
      <Group className={classes.textContainer} align="center" spacing="xs">
        <Group align="center" spacing="xs">
          <Warning fill={colors.red} className={classes.warningIcon} />
          <Text size="xs" inline color={colors.red} style={{ flex: 1 }}>
            {TEXTS.PHASE3.INVALID_DATA_INFO}
          </Text>
        </Group>
        <Button leftIcon={<Download />} onClick={onExportData}>
          {TEXTS.PHASE3.EXPORT_DATA}
        </Button>
      </Group>

      <div ref={tableWrapperRef} style={{ flexGrow: 1 }}>
        <Table
          style={{
            height: tableWrapperDimensions.height,
          }}
          headings={heaings}
          data={reviewData}
          emptyDataText=""
        />
      </div>
      <Pagination page={page} total={totalPages} onChange={onPageChange} />

      <Footer
        primaryButtonLoading={isConfirmReviewLoading}
        active={PhasesEum.REVIEW}
        onNextClick={onConfirmClick}
        onPrevClick={onPrevClick}
      />

      <ConfirmModal
        onConfirm={onReviewConfirmed}
        onClose={() => setShowConfirmModal(false)}
        opened={showConfirmModal}
        wrongDataCount={totalData}
      />
    </>
  );
}

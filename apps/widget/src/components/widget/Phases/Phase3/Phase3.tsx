import { colors, TEXTS } from '@config';
import { usePhase3 } from '@hooks/Phase3/usePhase3';
import { Download, Warning } from '@icons';
import { Group, Text } from '@mantine/core';
import { PhasesEum } from '@types';
import { Button } from '@ui/Button';
import { LoadingOverlay } from '@ui/LoadingOverlay';
import { Pagination } from '@ui/Pagination';
import { Table } from '@ui/Table';
import { Footer } from 'components/Common/Footer';
import { useRef, useState, useEffect } from 'react';
import useStyles from './Styles';

interface IPhase3Props {
  onNextClick: () => void;
  onPrevClick: () => void;
}

export function Phase3(props: IPhase3Props) {
  const { classes } = useStyles();
  const { onNextClick, onPrevClick } = props;
  const { onPageChange, heaings, isInitialDataLoaded, reviewData, page, totalPages } = usePhase3();
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

  return (
    <>
      <LoadingOverlay visible={!isInitialDataLoaded} />
      <Group className={classes.textContainer} align="center">
        <Group align="center" spacing="xs">
          <Warning fill={colors.red} className={classes.warningIcon} />
          <Text color={colors.red}>{TEXTS.PHASE3.INVALID_DATA_INFO}</Text>
        </Group>
        <Button size="sm" leftIcon={<Download />}>
          {TEXTS.PHASE3.EXPORT_DATA}
        </Button>
      </Group>

      <div ref={tableWrapperRef} style={{ flexGrow: 1 }}>
        <Table
          style={{
            height: tableWrapperDimensions.height,
          }}
          headings={[{ key: 'index', title: '#', width: '4%' }, ...heaings]}
          data={reviewData}
        />
      </div>
      <Pagination page={page} total={totalPages} onChange={onPageChange} />

      <Footer active={PhasesEum.REVIEW} onNextClick={onNextClick} onPrevClick={onPrevClick} />
    </>
  );
}

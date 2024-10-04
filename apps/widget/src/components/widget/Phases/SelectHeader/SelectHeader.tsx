import { useEffect, useRef, useState } from 'react';
import { Alert, Radio, Stack, Table } from '@mantine/core';

import { Warning } from '@icons';
import { colors } from '@config';
import { PhasesEnum } from '@types';
import useStyles from './SelectHeader.styles';
import { Footer } from 'components/Common/Footer';
import { LoadingOverlay } from '@ui/LoadingOverlay';
import { useSelectHeader } from '@hooks/SelectHeader/useSelectHeader';

interface ISelectHeaderProps {
  onNext: () => void;
}

export function SelectHeader({ onNext }: ISelectHeaderProps) {
  const { classes, cx } = useStyles();
  const [selectedRow, setSelectedRow] = useState<number>(0);
  const tableWrapperRef = useRef<HTMLDivElement>() as React.MutableRefObject<HTMLDivElement>;
  const [tableWrapperDimensions, setTableWrapperDimentions] = useState({
    height: 200,
    width: 500,
  });
  const { previewRows, isPreviewRowsLoading, setHeaderRow, isSetHeaderRowLoading } = useSelectHeader({ onNext });

  const handleRowClick = (index: number) => {
    setSelectedRow(index);
  };

  useEffect(() => {
    //  setting wrapper height
    setTableWrapperDimentions({
      height: tableWrapperRef.current.getBoundingClientRect().height,
      width: tableWrapperRef.current.getBoundingClientRect().width,
    });
  }, []);

  return (
    <>
      <LoadingOverlay visible={isPreviewRowsLoading} />
      <Stack style={{ flexGrow: 1, overflow: 'auto' }} ref={tableWrapperRef} h={tableWrapperDimensions.height + 'px'}>
        <Table withBorder withColumnBorders className={classes.table}>
          <tbody>
            {previewRows?.map((element, indexOuter) => (
              <tr
                key={indexOuter}
                className={cx(
                  classes.row,
                  { [classes.selectedRow]: selectedRow === indexOuter },
                  { [classes.aboveSelectedRow]: selectedRow !== null && indexOuter < selectedRow }
                )}
                onClick={() => handleRowClick(indexOuter)}
              >
                <td className={cx(classes.cell, classes.radioCell)}>
                  <Radio onChange={() => handleRowClick(indexOuter)} checked={selectedRow === indexOuter} />
                </td>
                {element.map((elementData, indexInner) => (
                  <td key={indexInner} className={classes.cell}>
                    {elementData}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </Stack>

      <Alert color="yellow" icon={<Warning fill={colors.yellow} />}>
        Rows above the header will not be imported
      </Alert>

      <Footer
        active={PhasesEnum.SELECT_HEADER}
        primaryButtonLoading={isSetHeaderRowLoading}
        secondaryButtonLoading={isSetHeaderRowLoading}
        onPrevClick={() => setHeaderRow({ index: -1, headings: previewRows?.[selectedRow] || [] })}
        onNextClick={() => setHeaderRow({ index: selectedRow, headings: previewRows?.[selectedRow] || [] })}
      />
    </>
  );
}

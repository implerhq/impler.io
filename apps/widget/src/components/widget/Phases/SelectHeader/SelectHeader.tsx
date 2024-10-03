import { Alert, Radio, Stack, Table } from '@mantine/core';
import { PhasesEnum } from '@types';
import useStyles from './SelectHeader.styles';
import { Footer } from 'components/Common/Footer';
import { useState } from 'react';
import { Warning } from '@icons';
import { colors } from '@config';

const DATA = [
  [1, 'john', 'doe', 'john doe', 'male', 28, 'California', 'New York', 'Software Engineer'],
  [2, 'jane', 'doe', 'jane doe', 'female', 32, 'California', 'New York', 'Software Engineer'],
  [3, 'john', 'doe', 'john doe', 'male', 28, 'California', 'New York', 'Software Engineer'],
  [4, 'jane', 'doe', 'jane doe', 'female', 32, 'California', 'New York', 'Software Engineer'],
  [5, 'john', 'doe', 'john doe', 'male', 28, 'California', 'New York', 'Software Engineer'],
  [6, 'jane', 'doe', 'jane doe', 'female', 32, 'California', 'New York', 'Software Engineer'],
  [7, 'john', 'doe', 'john doe', 'male', 28, 'California', 'New York', 'Software Engineer'],
  [8, 'jane', 'doe', 'jane doe', 'female', 32, 'California', 'New York', 'Software Engineer'],
  [9, 'john', 'doe', 'john doe', 'male', 28, 'California', 'New York', 'Software Engineer'],
  [10, 'jane', 'doe', 'jane doe', 'female', 32, 'California', 'New York', 'Software Engineer'],
];

export function SelectHeader() {
  const { classes, cx } = useStyles();
  const [selectedRow, setSelectedRow] = useState<number>(0);

  const handleRowClick = (index: number) => {
    setSelectedRow(index);
  };

  return (
    <>
      <Stack style={{ flexGrow: 1 }}>
        <Table className={classes.table} withBorder withColumnBorders>
          <tbody>
            {DATA.map((element, indexOuter) => (
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

      <Footer active={PhasesEnum.SELECT_HEADER} />
    </>
  );
}

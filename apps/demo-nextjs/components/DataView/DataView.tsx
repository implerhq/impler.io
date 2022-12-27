import { Table, Pagination, Flex } from '@mantine/core';
import useStyles from './Styles';

const elements = [
  { position: 6, mass: 12.011, symbol: 'C', name: 'Carbon' },
  { position: 7, mass: 14.007, symbol: 'N', name: 'Nitrogen' },
  { position: 39, mass: 88.906, symbol: 'Y', name: 'Yttrium' },
  { position: 56, mass: 137.33, symbol: 'Ba', name: 'Barium' },
  { position: 58, mass: 140.12, symbol: 'Ce', name: 'Cerium' },
];

const DataView = () => {
  const { classes } = useStyles();

  const rows = elements.map((element) => (
    <tr key={element.name}>
      <td className={classes.td}>{element.position}</td>
      <td className={classes.td}>{element.name}</td>
      <td className={classes.td}>{element.symbol}</td>
      <td className={classes.td}>{element.mass}</td>
    </tr>
  ));

  return (
    <Flex direction="column" gap="sm" align="center" style={{ flexGrow: 1 }}>
      <div className={classes.tableWrapper}>
        <Table>
          <thead className={classes.thead}>
            <tr>
              <th>Element position</th>
              <th>Element name</th>
              <th>Symbol</th>
              <th>Atomic mass</th>
            </tr>
          </thead>
          <tbody className={classes.tbody}>{rows}</tbody>
        </Table>
      </div>
      <Pagination siblings={1} boundaries={0} noWrap={false} total={10} classNames={{ item: classes.item }} />
    </Flex>
  );
};

export default DataView;

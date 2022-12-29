import { Table as MantineTable } from '@mantine/core';
import useStyles from './Styles';

interface TableProps {
  headings: {
    label: string;
    key: string;
  }[];
  data: any[];
  emptyMessage?: string;
}

const Table = ({ data, headings, emptyMessage }: TableProps) => {
  const { classes } = useStyles();

  const rows = data.map((row, index) => (
    <tr key={index}>
      {headings.map((heading) => (
        <td key={heading.key}>{row[heading.key]}</td>
      ))}
    </tr>
  ));
  const emptyRow = (
    <tr>
      <td colSpan={headings.length}>{emptyMessage || 'No record found!'}</td>
    </tr>
  );

  return (
    <div className={classes.tableWrapper}>
      <MantineTable>
        <thead className={classes.thead}>
          <tr>
            {headings.map((heading) => (
              <th key={heading.key}>{heading.label}</th>
            ))}
          </tr>
        </thead>
        <tbody className={classes.tbody}>{data.length ? rows : emptyRow}</tbody>
      </MantineTable>
    </div>
  );
};

export default Table;

import { Table as MantineTable } from '@mantine/core';
import useStyles from './Table.style';

interface IHeadingItem {
  title: string;
  key: string;
  Cell?: (item: Record<string, string>) => any;
}

interface ITableProps {
  emptyDataText?: string;
  headings?: IHeadingItem[];
  data?: Record<string, string>[];
}

export function Table(props: ITableProps) {
  const { classes } = useStyles();
  const { data, headings, emptyDataText = 'No Data Found!' } = props;

  const isHeadingsEmpty = !headings || !Array.isArray(headings) || !headings.length;
  const isDataEmpty = !data || !Array.isArray(data) || !data.length;

  const THead = () => {
    if (isHeadingsEmpty) return <thead />;

    return (
      <thead className={classes.heading}>
        <tr>
          {headings.map((heading: IHeadingItem, index: number) => (
            <th key={index}>{heading.title}</th>
          ))}
        </tr>
      </thead>
    );
  };

  const TBody = () => {
    if (isHeadingsEmpty) return <tbody />;

    if (isDataEmpty)
      return (
        <tbody>
          <tr>
            <td colSpan={headings?.length || 1}>{emptyDataText}</td>
          </tr>
        </tbody>
      );

    return (
      <tbody>
        {data.map((item: Record<string, string>, i: number) => (
          <tr key={item.id || i}>
            {headings.map((heading: IHeadingItem, fieldIndex: number) => (
              <td key={fieldIndex}>{typeof heading.Cell === 'function' ? heading.Cell(item) : item[heading.key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    );
  };

  return (
    <MantineTable withBorder withColumnBorders className={classes.table}>
      <THead />
      <TBody />
    </MantineTable>
  );
}

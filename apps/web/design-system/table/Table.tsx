import React from 'react';
import useStyles from './Table.styles';
import { Table as MantineTable } from '@mantine/core';

interface IHeadingItem {
  title: string;
  key: string;
  width?: number | string;
  Cell?: (item: any) => React.ReactNode;
}

interface ITableProps {
  emptyDataText?: string;
  headings?: IHeadingItem[];
  data?: Record<string, any>[];
  style?: React.CSSProperties;
}

export function Table(props: ITableProps) {
  const defaultColSpan = 1;
  const { classes } = useStyles();
  const { data, headings, emptyDataText = 'No Data Found!', style } = props;

  const isHeadingsEmpty = !headings || !Array.isArray(headings) || !headings.length;
  const isDataEmpty = !data || !Array.isArray(data) || !data.length;

  const THead = () => {
    if (isHeadingsEmpty) return <thead />;

    return (
      <thead className={classes.heading}>
        <tr>
          {headings.map((heading: IHeadingItem, index: number) => (
            <th style={{ width: heading.width || '' }} key={index}>
              {heading.title}
            </th>
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
            <td colSpan={headings?.length || defaultColSpan}>{emptyDataText}</td>
          </tr>
        </tbody>
      );

    return (
      <tbody>
        {data.map((item: Record<string, string>, rowIndex: number) => (
          <tr key={item.id || rowIndex}>
            {headings.map((heading: IHeadingItem, fieldIndex: number) =>
              typeof heading.Cell === 'function' ? (
                <td key={fieldIndex}>{heading.Cell(item)}</td>
              ) : (
                <td key={fieldIndex}>{item[heading.key]}</td>
              )
            )}
          </tr>
        ))}
      </tbody>
    );
  };

  return (
    <MantineTable withBorder withColumnBorders className={classes.table} style={style}>
      <THead />
      <TBody />
    </MantineTable>
  );
}

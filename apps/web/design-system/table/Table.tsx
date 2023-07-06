import React from 'react';
import useStyles from './Table.styles';
import { Table as MantineTable } from '@mantine/core';

interface IHeadingItem<T> {
  title: string;
  key: string;
  width?: number | string;
  Cell?: (item: T) => React.ReactNode;
}

interface ITableProps<T> {
  data?: T[];
  emptyDataText?: string;
  headings?: IHeadingItem<T>[];
  style?: React.CSSProperties;
  extraContent?: React.ReactNode;
}

export function Table<T extends { _id?: string }>(props: ITableProps<T>) {
  const defaultColSpan = 1;
  const { classes } = useStyles();
  const { data, headings, emptyDataText = 'No Data Found!', style, extraContent } = props;

  const isHeadingsEmpty = !headings || !Array.isArray(headings) || !headings.length;
  const isDataEmpty = !data || !Array.isArray(data) || !data.length;

  const THead = () => {
    if (isHeadingsEmpty) return <thead />;

    return (
      <thead className={classes.heading}>
        <tr>
          {headings.map((heading: IHeadingItem<T>, index: number) => (
            <th style={heading.width ? { width: heading.width } : {}} key={index}>
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
        {data.map((item: T, rowIndex: number) => (
          <tr key={item._id || rowIndex}>
            {headings.map((heading: IHeadingItem<T>, fieldIndex: number) =>
              typeof heading.Cell === 'function' ? (
                <td key={fieldIndex}>{heading.Cell(item)}</td>
              ) : (
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                <td key={fieldIndex}>{item[heading.key]}</td>
              )
            )}
          </tr>
        ))}
        {extraContent}
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

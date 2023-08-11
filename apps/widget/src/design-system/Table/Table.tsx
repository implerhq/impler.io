import React from 'react';
import { Table as MantineTable } from '@mantine/core';
import useStyles from './Table.style';
import { InvalidWarning } from '../InvalidWarning';

interface IHeadingItem {
  title: string;
  key: string;
  width?: number | string;
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
          <th style={{ textAlign: 'center', width: '4%' }}>#</th>
          {headings.map((heading: IHeadingItem, index: number) => (
            <th style={{ textAlign: 'center', width: heading.width || '' }} key={index}>
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
        {data.map((item: Record<string, any>, i: number) => (
          <tr key={item.index || i}>
            <td style={{ textAlign: 'center' }}>{item.index}</td>
            {headings.map((heading: IHeadingItem, fieldIndex: number) =>
              item.errors && item.errors[heading.key] ? (
                // if error exist for column
                <td key={fieldIndex} className={classes.invalidColumn}>
                  {item.record[heading.key]}
                  <InvalidWarning label={item.errors[heading.key]} />
                </td>
              ) : (
                // normal column
                <td key={fieldIndex}>{item.record[heading.key]}</td>
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

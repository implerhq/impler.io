import React from 'react';
import { Table, Text } from '@mantine/core';
import { getListStyles } from './List.styles';

interface IHeadingItem<T> {
  key: string;
  title: string;
  width?: number | string;
  Cell?: (item: T) => React.ReactNode;
}

interface IListProps<T> {
  data?: T[];
  emptyDataText?: string;
  selectedItemId?: string;
  headings?: IHeadingItem<T>[];
  style?: React.CSSProperties;
  extraContent?: React.ReactNode;
  onItemClick?: (item: T) => void;
}

export function List<T extends { _id?: string }>(props: IListProps<T>) {
  const {
    data,
    headings,
    emptyDataText = 'No Project Data Found!',
    style,
    extraContent,
    selectedItemId,
    onItemClick,
  } = props;
  const { classes, cx } = getListStyles();

  const isHeadingsEmpty = !headings || !Array.isArray(headings) || !headings.length;
  const isDataEmpty = !data || !Array.isArray(data) || !data.length;

  const ListHeader = () => {
    if (isHeadingsEmpty) return null;

    return (
      <thead className={classes.header}>
        {headings.map((heading: IHeadingItem<T>, index: number) => (
          <th key={index} className={classes.th} style={heading.width ? { width: heading.width } : {}}>
            {heading.title}
          </th>
        ))}
      </thead>
    );
  };

  const ListBody = () => {
    if (isHeadingsEmpty) return null;

    if (isDataEmpty)
      return (
        <tbody>
          <tr>
            <td>{emptyDataText}</td>
          </tr>
        </tbody>
      );

    return (
      <tbody>
        {data.map((item: T) => (
          <tr
            key={item._id}
            className={cx(classes.row, { [classes.selectedRow]: item._id === selectedItemId })}
            onClick={() => onItemClick && onItemClick(item)}
          >
            {headings.map((heading: IHeadingItem<T>, fieldIndex: number) => (
              <td key={fieldIndex} className={classes.td}>
                {typeof heading.Cell === 'function' ? (
                  heading.Cell(item)
                ) : (
                  <Text>{item[heading.key as keyof T] as string}</Text>
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    );
  };

  return (
    <Table className={classes.list} style={style}>
      <ListHeader />
      <ListBody />
      {extraContent}
    </Table>
  );
}

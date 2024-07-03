import React, { useRef } from 'react';
import { Table as MantineTable } from '@mantine/core';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider, useDrag, useDrop } from 'react-dnd';

import useStyles from './Table.styles';

interface IHeadingItem<T> {
  title: string;
  key: string;
  width?: number | string;
  Cell?: (item: T) => React.ReactNode;
}

interface ITableProps<T> {
  data?: T[];
  emptyDataText?: string;
  style?: React.CSSProperties;
  headings?: IHeadingItem<T>[];
  extraContent?: React.ReactNode;
  moveItem: (itemIndex: number, dropIndex: number) => void;
}

const TableRow = <T extends { _id?: string; index: number }>({
  item,
  headings,
  rowIndex,
  moveItem,
}: {
  item: T;
  rowIndex: number;
  headings: IHeadingItem<T>[];
  moveItem: (itemIndex: number, dropIndex: number) => void;
}) => {
  const ref = useRef<HTMLTableRowElement>(null);

  const [{ handlerId }, drop] = useDrop<T, void, { handlerId: string | null }>({
    accept: 'row',
    drop(dropLocationItem: T) {
      if (!ref.current) {
        return;
      }
      const dropIndex = rowIndex;
      const itemIndex = dropLocationItem.index;
      if (dropIndex === itemIndex) {
        return;
      }
      moveItem?.(itemIndex, dropIndex);
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'row',
    item: { ...item, index: rowIndex },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0.2 : 1;
  drag(drop(ref));

  return (
    <tr key={item._id || rowIndex} ref={ref} style={{ opacity }} data-handler-id={handlerId}>
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
  );
};

export function DraggableTable<T extends { _id?: string }>(props: ITableProps<T>) {
  const defaultColSpan = 1;
  const { classes } = useStyles();
  const { data, headings, emptyDataText = 'No Data Found!', style, extraContent, moveItem } = props;

  const isDataEmpty = !data || !Array.isArray(data) || !data.length;
  const isHeadingsEmpty = !headings || !Array.isArray(headings) || !headings.length;

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
          {extraContent}
        </tbody>
      );

    return (
      <tbody>
        <DndProvider backend={HTML5Backend}>
          {data.map((item: T, rowIndex: number) => (
            <TableRow
              headings={headings}
              item={{
                ...item,
                index: rowIndex,
              }}
              rowIndex={rowIndex}
              moveItem={moveItem}
              key={item._id || rowIndex}
            />
          ))}
        </DndProvider>
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

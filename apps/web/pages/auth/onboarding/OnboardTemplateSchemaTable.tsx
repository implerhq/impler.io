import React from 'react';
import { Text, ScrollArea } from '@mantine/core';
import { Table } from '@ui/table';

interface OnboardTemplateSchemaTableProps {
  data?: OnboardTemplateSchemaTable[];
  maxHeight?: string | number;
}

export default function OnboardTemplateSchemaTable({ data }: OnboardTemplateSchemaTableProps) {
  return (
    <ScrollArea h={200}>
      <Table<OnboardTemplateSchemaTable>
        headings={[
          {
            title: 'Name',
            key: 'name',
            Cell: (item: OnboardTemplateSchemaTable) => <Text>{item.name}</Text>,
          },
          {
            title: 'Type',
            key: 'type',
            Cell: (item: OnboardTemplateSchemaTable) => <Text size="sm">{item.type}</Text>,
          },
        ]}
        data={data}
      />
    </ScrollArea>
  );
}

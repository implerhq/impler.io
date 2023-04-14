import { Flex, Title } from '@mantine/core';

import { Button } from '@ui/button';
import { Table } from '@ui/table';
import { Pagination } from '@ui/pagination';
import { useImports } from '@hooks/useImports';
import { AppLayout } from '@layouts/AppLayout';
import { ImportActions } from '@components/imports/ImportActions';

export default function Imports() {
  const { onCreateClick } = useImports();

  return (
    <>
      <Flex gap="sm" direction="column" h="100%">
        <Flex justify="space-between" align="center">
          <Title order={2}>Imports</Title>
          <Button variant="outline" onClick={onCreateClick}>
            Start with fresh Import
          </Button>
        </Flex>
        <div style={{ flexGrow: 1 }}>
          <Table
            headings={[
              { title: 'Name', key: 'name' },
              { title: 'Imports', key: 'imports' },
              { title: 'Total rows', key: 'totalImports' },
              { title: 'Total errors', key: 'totalErrors' },
              {
                title: '',
                key: 'actions',
                Cell: () => <ImportActions slug="users-import" />,
              },
            ]}
            data={[
              {
                name: 'Import 1',
                imports: 100,
                totalImports: 100,
                totalErrors: 0,
              },
              {
                name: 'Import 2',
                imports: 100,
                totalImports: 100,
                totalErrors: 0,
              },
            ]}
          />
        </div>
        <Pagination
          dataLength={100}
          page={1}
          limit={10}
          onLimitChange={() => {}}
          setPage={() => {}}
          totalPages={10}
          totalRecords={100}
        />
      </Flex>
    </>
  );
}

Imports.Layout = AppLayout;

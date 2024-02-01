import { ChangeEvent } from 'react';
import { Flex, Grid, Group, LoadingOverlay, Text, Title } from '@mantine/core';

import { Input } from '@ui/input';
import { Button } from '@ui/button';
import { VARIABLES } from '@config';
import { Pagination } from '@ui/pagination';
import { ImportCard } from '@ui/import-card';
import { useImports } from '@hooks/useImports';
import { AppLayout } from '@layouts/AppLayout';
import { SearchIcon } from '@assets/icons/Search.icon';

const NEW_IMPORT_TEXT = 'Create Import';

export default function Imports() {
  const {
    search,
    importsData,
    onCreateClick,
    isCreateImportLoading,
    isImportsLoading,
    onLimitChange,
    onPageChange,
    onSearchChange,
  } = useImports();

  return (
    <>
      <Flex gap="sm" direction="column" h="100%" style={{ position: 'relative' }}>
        <LoadingOverlay visible={isCreateImportLoading || isImportsLoading} />
        <Flex justify="space-between" align="center">
          <Title order={2}>Imports</Title>
          <Group spacing="xs">
            <Input
              icon={<SearchIcon />}
              placeholder="Search imports by name..."
              register={{
                defaultValue: search,
                onChange: (e: ChangeEvent<HTMLInputElement>) => onSearchChange(e.currentTarget.value),
              }}
              type="search"
            />
            <Button color="invariant" onClick={onCreateClick}>
              {NEW_IMPORT_TEXT}
            </Button>
          </Group>
        </Flex>
        <Grid
          gutter="sm"
          style={{
            flexGrow: 1,
            alignContent: 'flex-start',
          }}
          justify="flex-start"
        >
          {!importsData?.data?.length && (
            <Grid.Col>
              <Text>
                No imports found, click on <b>{NEW_IMPORT_TEXT}</b> to get started with a new import.
              </Text>
            </Grid.Col>
          )}
          {importsData?.data?.length ? (
            <>
              {importsData?.data.map((importItem) => (
                <Grid.Col span={4} key={importItem._id}>
                  <ImportCard
                    title={importItem.name}
                    imports={importItem.totalUploads}
                    totalRecords={importItem.totalRecords}
                    errorRecords={importItem.totalInvalidRecords}
                    href={`/imports/${importItem._id}`}
                  />
                </Grid.Col>
              ))}
            </>
          ) : null}
        </Grid>
        <Pagination
          dataLength={importsData?.data.length || VARIABLES.ZERO}
          limit={importsData?.limit || VARIABLES.ZERO}
          onLimitChange={onLimitChange}
          page={importsData?.page || VARIABLES.ZERO}
          size="sm"
          setPage={onPageChange}
          totalPages={importsData?.totalPages || VARIABLES.ZERO}
          totalRecords={importsData?.totalRecords || VARIABLES.ZERO}
        />
      </Flex>
    </>
  );
}

export async function getServerSideProps() {
  return {
    props: {
      title: 'Imports',
    },
  };
}

Imports.Layout = AppLayout;

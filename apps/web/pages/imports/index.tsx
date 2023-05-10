import { Flex, Grid, Text, Title } from '@mantine/core';

import { Button } from '@ui/button';
import { useImports } from '@hooks/useImports';
import { AppLayout } from '@layouts/AppLayout';
import { ImportCard } from '@ui/import-card';

const NEW_IMPORT_TEXT = 'Start with new import';

export default function Imports() {
  const { onCreateClick, templates } = useImports();

  return (
    <>
      <Flex gap="sm" direction="column" h="100%">
        <Flex justify="space-between" align="center">
          <Title order={2}>Imports</Title>
          <Button variant="outline" onClick={onCreateClick}>
            {NEW_IMPORT_TEXT}
          </Button>
        </Flex>
        <Grid gutter="sm">
          {!templates?.length && (
            <Grid.Col>
              <Text>
                No imports found, click on <b>{NEW_IMPORT_TEXT}</b> to get started with a new import.
              </Text>
            </Grid.Col>
          )}
          {templates?.length ? (
            <>
              {templates.map((template) => (
                <Grid.Col span={4} key={template._id}>
                  <ImportCard
                    title={template.name}
                    imports={template.totalUploads}
                    totalRecords={template.totalRecords}
                    errorRecords={template.totalInvalidRecords}
                    href={`/imports/${template._id}`}
                  />
                </Grid.Col>
              ))}
            </>
          ) : null}
        </Grid>
      </Flex>
    </>
  );
}

Imports.Layout = AppLayout;

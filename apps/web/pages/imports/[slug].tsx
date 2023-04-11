import Link from 'next/link';
import { Flex, Group, Title } from '@mantine/core';

import { AppLayout } from '@layouts/AppLayout';
import { Card } from '@ui/Card';
import { Button } from '@ui/button';
import { EditIcon } from '@assets/icons/Edit.icon';
import { DeleteIcon } from '@assets/icons/Delete.icon';
import { Tabs } from '@ui/Tabs';

export default function ImportDetails() {
  return (
    <Flex gap="sm" direction="column" h="100%">
      <Flex justify="space-between">
        <Title order={2}>Users Import</Title>
        <Group spacing="xs">
          <Button>
            <EditIcon />
          </Button>
          <Button color="red">
            <DeleteIcon />
          </Button>
        </Group>
      </Flex>
      <Group spacing="sm" w="100%" grow>
        <Link href="asdf">
          <Card title="Total Imports" subtitle="81K" color="primary" />
        </Link>
        <Card title="Total Imported Records" subtitle="81K" />
        <Card title="Total Error Records" subtitle="81K" />
      </Group>
      <Tabs
        items={[
          {
            value: 'schema',
            title: 'Schema',
            content: <div>Schema</div>,
          },
          {
            value: 'snippet',
            title: 'Snippet',
            content: <div>Snippet</div>,
          },
          {
            value: 'output',
            title: 'Output',
            content: <div>Output</div>,
          },
          {
            value: 'destination',
            title: 'Destination',
            content: <div>Destination</div>,
          },
        ]}
        defaultValue="schema"
      />
    </Flex>
  );
}

ImportDetails.Layout = AppLayout;

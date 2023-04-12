import Link from 'next/link';
import { Flex, Group, Title } from '@mantine/core';

import { Tabs } from '@ui/Tabs';
import { Card } from '@ui/Card';
import { Button } from '@ui/button';
import { AppLayout } from '@layouts/AppLayout';

import { EditIcon } from '@assets/icons/Edit.icon';
import { DeleteIcon } from '@assets/icons/Delete.icon';

import { Schema } from '@components/imports/Schema';
import { Snippet } from '@components/imports/Snippet';

export default function ImportDetails() {
  return (
    <Flex gap="lg" direction="column" h="100%">
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
            content: <Schema />,
          },
          {
            value: 'snippet',
            title: 'Snippet',
            content: <Snippet />,
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

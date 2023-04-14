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
import { Destination } from '@components/imports/Destination';
import dynamic from 'next/dynamic';

const Editor = dynamic(() => import('@components/imports/Editor'), { ssr: false });

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
            content: (
              <Editor
                variables={['record.fName', 'record.lName']}
                value={`{
  totalRecords: 200,
  page: 1,
  limit: 10,
  totalPages: 20,
  hasMore: true,
  data: [
    {
      "name": {{record.fName}},
      "lname": {{record.lName}},
    }
  ]
}`}
              />
            ),
          },
          {
            value: 'destination',
            title: 'Destination',
            content: <Destination />,
          },
        ]}
        defaultValue="schema"
      />
    </Flex>
  );
}

ImportDetails.Layout = AppLayout;

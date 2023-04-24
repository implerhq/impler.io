import Link from 'next/link';
import dynamic from 'next/dynamic';
import { GetServerSideProps } from 'next';
import { Flex, Group, Title } from '@mantine/core';

import { commonApi } from '@libs/api';
import { ITemplate } from '@impler/shared';
import { API_KEYS, CONSTANTS, ROUTES } from '@config';

import { Tabs } from '@ui/Tabs';
import { Card } from '@ui/Card';
import { Button } from '@ui/button';

import { AppLayout } from '@layouts/AppLayout';
import { EditIcon } from '@assets/icons/Edit.icon';
import { DeleteIcon } from '@assets/icons/Delete.icon';

import { Schema } from '@components/imports/Schema';
import { Snippet } from '@components/imports/Snippet';
import { Destination } from '@components/imports/Destination';
const Editor = dynamic(() => import('@components/imports/Editor'), { ssr: false });

interface ImportDetailProps {
  template: ITemplate;
}

export default function ImportDetails({ template }: ImportDetailProps) {
  return (
    <Flex gap="lg" direction="column" h="100%">
      <Flex justify="space-between">
        <Title order={2}>{template.name}</Title>
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
          <Card title="Total Imports" subtitle={String(template.totalUploads)} color="primary" />
        </Link>
        <Card title="Total Imported Records" subtitle={String(template.totalRecords)} />
        <Card title="Total Error Records" subtitle={String(template.totalInvalidRecords)} />
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const templateId = context.params?.id as string | undefined;
  const authenticationToken = context.req.cookies[CONSTANTS.AUTH_COOKIE_NAME];
  if (!templateId) return { redirect: ROUTES.IMPORTS, props: {} };

  const template = await commonApi<ITemplate>(API_KEYS.TEMPLATE_DETAILS as any, {
    parameters: [templateId],
    cookie: `${CONSTANTS.AUTH_COOKIE_NAME}:${authenticationToken}`,
  });

  return {
    props: {
      template,
    },
  };
};

ImportDetails.Layout = AppLayout;

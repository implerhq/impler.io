import Link from 'next/link';
import dynamic from 'next/dynamic';
import { GetServerSideProps } from 'next';
import { Flex, Group, Title } from '@mantine/core';

import { commonApi } from '@libs/api';
import { Button as ImportButton } from '@impler/react';
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
import { useImportDetails } from '@hooks/useImportDetails';
const Editor = dynamic(() => import('@components/imports/Editor'), { ssr: false });

interface ImportDetailProps {
  template: ITemplate;
}

export default function ImportDetails({ template }: ImportDetailProps) {
  const { onUpdateClick, onDeleteClick, templateData, profile } = useImportDetails({ template });

  return (
    <Flex gap="lg" direction="column" h="100%">
      <Flex justify="space-between">
        <Title order={2}>{templateData.name}</Title>
        <Group spacing="xs">
          <ImportButton accessToken={profile?.accessToken} template={template._id} projectId={template._projectId}>
            Import
          </ImportButton>
          <Button onClick={onUpdateClick}>
            <EditIcon />
          </Button>
          <Button color="red" onClick={onDeleteClick}>
            <DeleteIcon />
          </Button>
        </Group>
      </Flex>
      <Group spacing="sm" w="100%" grow>
        <Link href="asdf">
          <Card title="Total Imports" subtitle={String(templateData.totalUploads)} color="primary" />
        </Link>
        <Card title="Total Imported Records" subtitle={String(templateData.totalRecords)} />
        <Card title="Total Error Records" subtitle={String(templateData.totalInvalidRecords)} />
      </Group>
      <Tabs
        items={[
          {
            value: 'schema',
            title: 'Schema',
            content: <Schema templateId={template._id} />,
          },
          {
            value: 'snippet',
            title: 'Snippet',
            content: <Snippet templateId={template._id} projectId={template._projectId} />,
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
            content: <Destination template={template} />,
          },
        ]}
        defaultValue="schema"
      />
    </Flex>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const templateId = context.params?.id as string | undefined;
    const authenticationToken = context.req.cookies[CONSTANTS.AUTH_COOKIE_NAME];
    if (!templateId || !authenticationToken) throw new Error();

    const template = await commonApi<ITemplate>(API_KEYS.TEMPLATE_DETAILS as any, {
      parameters: [templateId],
      cookie: `${CONSTANTS.AUTH_COOKIE_NAME}:${authenticationToken}`,
    });
    if (!template) throw new Error();

    return {
      props: {
        template,
      },
    };
  } catch (error) {
    return {
      redirect: {
        permanent: false,
        destination: ROUTES.IMPORTS,
      },
      props: {},
    };
  }
};

ImportDetails.Layout = AppLayout;

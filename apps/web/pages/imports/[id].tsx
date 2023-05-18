import Link from 'next/link';
import dynamic from 'next/dynamic';
import { GetServerSideProps } from 'next';
import { Flex, Group, Title } from '@mantine/core';

import { commonApi } from '@libs/api';
import { ITemplate } from '@impler/shared';
import { useImpler } from '@impler/react';
import { useImportDetails } from '@hooks/useImportDetails';
import { API_KEYS, CONSTANTS, ROUTES, colors } from '@config';

import { Tabs } from '@ui/Tabs';
import { Card } from '@ui/Card';
import { Button } from '@ui/button';
import { Schema } from '@components/imports/Schema';
import { Snippet } from '@components/imports/Snippet';
import { Destination } from '@components/imports/Destination';

import { AppLayout } from '@layouts/AppLayout';
import { EditIcon } from '@assets/icons/Edit.icon';
import { DeleteIcon } from '@assets/icons/Delete.icon';
import { LeftArrowIcon } from '@assets/icons/LeftArrow.icon';

const Editor = dynamic(() => import('@components/imports/Editor'), { ssr: false });

interface ImportDetailProps {
  template: ITemplate;
}

export default function ImportDetails({ template }: ImportDetailProps) {
  const { onUpdateClick, onDeleteClick, templateData, profile, onSpreadsheetImported } = useImportDetails({ template });
  const { showWidget, isImplerInitiated } = useImpler({
    templateId: template._id,
    projectId: template._projectId,
    accessToken: profile?.accessToken,
    primaryColor: colors.blue,
    onUploadComplete: onSpreadsheetImported,
  });

  return (
    <Flex gap="lg" direction="column" h="100%">
      <Flex justify="space-between">
        <Group spacing="xs">
          <Button variant="outline" component={Link} href={ROUTES.IMPORTS} color="invariant">
            <LeftArrowIcon />
          </Button>
          <Title order={2}>{templateData.name}</Title>
        </Group>
        <Group spacing="xs">
          <Button disabled={!isImplerInitiated} onClick={showWidget}>
            Import
          </Button>
          <Button onClick={onUpdateClick}>
            <EditIcon />
          </Button>
          <Button color="red" onClick={onDeleteClick}>
            <DeleteIcon />
          </Button>
        </Group>
      </Flex>
      <Group spacing="sm" w="100%" grow>
        <Card title="Total Imports" subtitle={String(templateData.totalUploads)} color="primary" />
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
            content: (
              <Snippet templateId={template._id} projectId={template._projectId} accessToken={profile?.accessToken} />
            ),
          },
          {
            value: 'output',
            title: 'Output',
            content: <Editor templateId={template._id} />,
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
      cookie: `${CONSTANTS.AUTH_COOKIE_NAME}=${authenticationToken}`,
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

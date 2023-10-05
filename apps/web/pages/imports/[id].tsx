import Link from 'next/link';
import dynamic from 'next/dynamic';
import { GetServerSideProps } from 'next';
import { ActionIcon, Flex, Group, Title, useMantineTheme } from '@mantine/core';

import { commonApi } from '@libs/api';
import { ITemplate } from '@impler/shared';
import { useImpler } from '@impler/react';
import { useImportDetails } from '@hooks/useImportDetails';
import { API_KEYS, CONSTANTS, ROUTES, colors } from '@config';

import { Tabs } from '@ui/Tabs';
import { Button } from '@ui/button';
import { Schema } from '@components/imports/schema';
import { Snippet } from '@components/imports/Snippet';
import { Destination } from '@components/imports/Destination';

import { AppLayout } from '@layouts/AppLayout';
import { OneIcon } from '@assets/icons/One.icon';
import { TwoIcon } from '@assets/icons/Two.icon';
import { EditIcon } from '@assets/icons/Edit.icon';
import { FiveIcon } from '@assets/icons/Five.icon';
import { FourIcon } from '@assets/icons/Four.icon';
import { ThreeIcon } from '@assets/icons/Three.icon';
import { DeleteIcon } from '@assets/icons/Delete.icon';
import { LeftArrowIcon } from '@assets/icons/LeftArrow.icon';

const Editor = dynamic(() => import('@components/imports/editor').then((mod) => mod.OutputEditor), {
  ssr: false,
});
const Validator = dynamic(() => import('@components/imports/validator').then((mod) => mod.Validator), {
  ssr: false,
});

interface ImportDetailProps {
  template: ITemplate;
}

export default function ImportDetails({ template }: ImportDetailProps) {
  const { colorScheme } = useMantineTheme();
  const { onUpdateClick, onDeleteClick, templateData, profileInfo, onSpreadsheetImported, columns } = useImportDetails({
    template,
  });
  const { showWidget, isImplerInitiated } = useImpler({
    templateId: template._id,
    projectId: template._projectId,
    accessToken: profileInfo?.accessToken,
    primaryColor: colors.blue,
    onUploadComplete: onSpreadsheetImported,
  });

  return (
    <Flex gap="sm" direction="column" h="100%">
      <Flex justify="space-between">
        <Group spacing="xs">
          <Button variant="outline" component={Link} href={ROUTES.IMPORTS} color="invariant">
            <LeftArrowIcon />
          </Button>
          <Group spacing={0}>
            <Title order={2}>{templateData.name}</Title>
            <ActionIcon onClick={onUpdateClick} p={0}>
              <EditIcon color={colors.blue} size="sm" />
            </ActionIcon>
          </Group>
        </Group>
        <Group spacing="xs">
          <Button
            disabled={!isImplerInitiated || columns?.length === 0}
            color="green"
            onClick={() => showWidget({ colorScheme })}
          >
            Import
          </Button>
          <Button variant="outline" color="red" onClick={onDeleteClick}>
            <DeleteIcon />
          </Button>
        </Group>
      </Flex>
      <Tabs
        keepMounted={false}
        items={[
          {
            value: 'schema',
            title: 'Schema',
            icon: <OneIcon size="xs" />,
            content: <Schema templateId={template._id} />,
          },
          {
            value: 'destination',
            title: 'Destination',
            icon: <TwoIcon size="xs" />,
            content: <Destination template={template} accessToken={profileInfo?.accessToken} />,
          },
          {
            value: 'snippet',
            title: 'Snippet',
            icon: <ThreeIcon size="xs" />,
            content: (
              <Snippet
                templateId={template._id}
                projectId={template._projectId}
                accessToken={profileInfo?.accessToken}
              />
            ),
          },
          {
            value: 'validator',
            title: 'Validator',
            icon: <FourIcon size="xs" />,
            content: <Validator templateId={template._id} />,
          },
          {
            value: 'output',
            title: 'Output',
            icon: <FiveIcon size="xs" />,
            content: <Editor templateId={template._id} />,
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
        title: template.name,
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

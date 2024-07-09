import Link from 'next/link';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { ActionIcon, Flex, Group, LoadingOverlay, Title, useMantineTheme, Select } from '@mantine/core';

import { track } from '@libs/amplitude';
import { ROUTES, colors } from '@config';
import { useImpler } from '@impler/react';
import { useImportDetails } from '@hooks/useImportDetails';
import { TemplateModeEnum } from '@impler/shared';

import { Tabs } from '@ui/Tabs';
import { Button } from '@ui/button';
import { Schema } from '@components/imports/schema';
import { Snippet } from '@components/imports/Snippet';
import { Destination } from '@components/imports/destination';

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

export default function ImportDetails({}) {
  const router = useRouter();
  // const [importMode, setImportMode] = useState<'manual' | 'automatic'>('manual');
  const [activeTab, setActiveTab] = useState<'schema' | 'destination' | 'snippet' | 'validator' | 'output'>();
  const { colorScheme } = useMantineTheme();
  const {
    columns,
    profileInfo,
    templateData,
    onUpdateClick,
    onDeleteClick,
    isTemplateDataLoading,
    onSpreadsheetImported,
    updateImport,
  } = useImportDetails({
    templateId: router.query.id as string,
  });
  const { showWidget, isImplerInitiated } = useImpler({
    primaryColor: colors.blue,
    templateId: templateData?._id,
    projectId: templateData?._projectId,
    accessToken: profileInfo?.accessToken,
    onUploadComplete: onSpreadsheetImported,
  });
  const onImportClick = () => {
    track({
      name: 'IMPORT CLICK',
      properties: {},
    });
    showWidget({ colorScheme });
  };

  return (
    <Flex gap="sm" direction="column" h="100%" style={{ position: 'relative' }}>
      <LoadingOverlay visible={isTemplateDataLoading} />
      <Flex justify="space-between">
        <Group spacing="xs">
          <Button variant="outline" component={Link} href={ROUTES.IMPORTS} color="invariant">
            <LeftArrowIcon />
          </Button>
          <Group spacing={0}>
            <Title order={2}>{templateData?.name}</Title>
            <ActionIcon onClick={onUpdateClick} p={0}>
              <EditIcon color={colors.blue} size="sm" />
            </ActionIcon>
          </Group>
        </Group>
        <Group spacing="xs">
          <Select
            size="sm"
            maw={125}
            placeholder="Mode"
            data={[
              { label: 'Manual', value: TemplateModeEnum.MANUAL },
              { label: 'Automatic', value: TemplateModeEnum.AUTOMATIC },
            ]}
            defaultValue={TemplateModeEnum.MANUAL}
            value={templateData?.mode}
            onChange={(mode) => updateImport({ mode: mode || undefined })}
          />
          <Button
            color="green"
            id="import"
            onClick={onImportClick}
            // eslint-disable-next-line no-magic-numbers
            disabled={!isImplerInitiated || columns?.length === 0 || isTemplateDataLoading}
          >
            Import
          </Button>
          <Button variant="outline" color="red" onClick={onDeleteClick}>
            <DeleteIcon />
          </Button>
        </Group>
      </Flex>
      {templateData && (
        <Tabs
          value={activeTab}
          onTabChange={(value: any) => setActiveTab(value)}
          keepMounted={false}
          items={[
            {
              id: 'schema',
              value: 'schema',
              title: 'Schema',
              icon: <OneIcon size="xs" />,
              content: <Schema templateId={templateData._id} />,
            },
            {
              id: 'destination',
              value: 'destination',
              title: 'Destination',
              icon: <TwoIcon size="xs" />,
              content: <Destination template={templateData} />,
            },
            {
              id: 'snippet',
              value: 'snippet',
              title: 'Snippet',
              icon: <ThreeIcon size="xs" />,
              content: (
                <Snippet
                  templateId={templateData._id}
                  projectId={templateData._projectId}
                  accessToken={profileInfo?.accessToken}
                />
              ),
            },
            {
              id: 'validator',
              value: 'validator',
              title: 'Validator',
              icon: <FourIcon size="xs" />,
              content: <Validator templateId={templateData._id} />,
            },
            {
              id: 'output',
              value: 'output',
              title: 'Output',
              icon: <FiveIcon size="xs" />,
              content: <Editor templateId={templateData._id} switchToDestination={() => setActiveTab('destination')} />,
            },
          ]}
          defaultValue="schema"
        />
      )}
    </Flex>
  );
}

ImportDetails.Layout = AppLayout;

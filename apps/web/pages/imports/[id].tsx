import Link from 'next/link';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { ActionIcon, Flex, Group, LoadingOverlay, Title, Select } from '@mantine/core';

import { track } from '@libs/amplitude';
import { useImpler } from '@impler/react';
import { TemplateModeEnum } from '@impler/shared';
import { IMPORT_MODES, ROUTES, SubjectsEnum, colors } from '@config';
import { useImportDetails } from '@hooks/useImportDetails';

import { Tabs } from '@ui/Tabs';
import { Button } from '@ui/button';
import { Schema } from '@components/imports/schema';
import { withProtectedResource } from '@components/hoc';
import { Destination } from '@components/imports/destination';

import { AppLayout } from '@layouts/AppLayout';
import { EditIcon } from '@assets/icons/Edit.icon';
import { DeleteIcon } from '@assets/icons/Delete.icon';
import { LeftArrowIcon } from '@assets/icons/LeftArrow.icon';
import { IntegrationIcon } from '@assets/icons/Integration.icon';

const Editor = dynamic(() => import('@components/imports/editor').then((mod) => mod.OutputEditor), {
  ssr: false,
});
const Validator = dynamic(() => import('@components/imports/validator').then((mod) => mod.Validator), {
  ssr: false,
});

function ImportDetails() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'schema' | 'destination' | 'snippet' | 'validator' | 'output'>();
  const {
    meta,
    columns,
    profileInfo,
    updateImport,
    templateData,
    onUpdateClick,
    onDeleteClick,
    onIntegrationClick,
    isTemplateDataLoading,
    onSpreadsheetImported,
  } = useImportDetails({
    templateId: router.query.id as string,
  });
  const { showWidget, isImplerInitiated } = useImpler({
    primaryColor: colors.faintYellow,
    templateId: templateData?._id,
    projectId: templateData?._projectId,
    accessToken: profileInfo?.accessToken,
    onUploadComplete: onSpreadsheetImported,
    appearance: {
      widget: {
        backgroundColor: '#000000',
        /*
         * background: 'linear-gradient(135deg, #000000 0%, #0a0a0a 50%, #1a1a1a 100%)',
         * border: '1px solid rgba(255, 255, 255, 0.1)',
         */
        // boxShadow: '0px 0px 50px rgba(0, 0, 0, 0.9), inset 0px 2px 10px rgba(255, 255, 255, 0.02)',
      },
      primaryColor: '#ffffff',
      fontFamily: 'JetBrains Mono, Consolas, monospace',
      borderRadius: '4px',
      primaryButtonConfig: {
        backgroundColor: '#1a1a1a',
        textColor: '#ffffff',
        hoverBackground: '#333333',
        hoverTextColor: '#ffffff',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        hoverBorderColor: '#ffffff',
        buttonShadow: '0px 8px 32px rgba(0, 0, 0, 0.8), 0px 0px 20px rgba(255, 255, 255, 0.1)',
        // transform: 'translateY(-2px)',
      },
      secondaryButtonConfig: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        textColor: '#666666',
        hoverBackground: 'rgba(26, 26, 26, 0.9)',
        hoverTextColor: '#ffffff',
        borderColor: 'rgba(102, 102, 102, 0.3)',
        hoverBorderColor: '#1a1a1a',
        buttonShadow: '0px 4px 16px rgba(0, 0, 0, 0.6)',
      },
    },
  });
  const onImportClick = () => {
    track({
      name: 'IMPORT CLICK',
      properties: {},
    });
    showWidget({
      // colorScheme,
    });
  };

  useEffect(() => {
    if (isImplerInitiated && router.query.showWidget) {
      onImportClick();
    }
  }, [isImplerInitiated]);

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
            <ActionIcon radius={0} onClick={onUpdateClick} p={0}>
              <EditIcon color={colors.blue} size="sm" />
            </ActionIcon>
          </Group>
        </Group>
        <Group spacing="xs">
          <Select
            size="sm"
            maw={125}
            placeholder="Mode"
            data={IMPORT_MODES.map((mode) => ({
              ...mode,
              disabled: mode.value === TemplateModeEnum.AUTOMATIC && !meta?.AUTOMATIC_IMPORTS ? true : false,
            }))}
            value={templateData?.mode || TemplateModeEnum.MANUAL}
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
          <Button leftIcon={<IntegrationIcon />} id="integration" onClick={onIntegrationClick}>
            Integrate
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
              content: <Schema templateId={templateData._id} />,
            },
            {
              id: 'destination',
              value: 'destination',
              title: 'Destination',
              content: <Destination template={templateData} />,
            },
            {
              id: 'validator',
              value: 'validator',
              title: 'Validator',
              content: <Validator templateId={templateData._id} />,
            },
            {
              id: 'output',
              value: 'output',
              title: 'Output',
              content: <Editor templateId={templateData._id} switchToDestination={() => setActiveTab('destination')} />,
            },
          ]}
          defaultValue="schema"
        />
      )}
    </Flex>
  );
}

const EnhancedImportDetails = withProtectedResource(ImportDetails, {
  subject: SubjectsEnum.IMPORTS,
});

export default function ImportDetailsPage() {
  return <EnhancedImportDetails />;
}

ImportDetailsPage.Layout = AppLayout;

export async function getServerSideProps() {
  return {
    props: {
      title: 'Import Details',
    },
  };
}

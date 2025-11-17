import Link from 'next/link';
import React, { useCallback, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { ActionIcon, Flex, Group, LoadingOverlay, Title, Select } from '@mantine/core';
import { track } from '@libs/amplitude';
import { defaultWidgetAppereance, TemplateModeEnum } from '@impler/shared';
import { CONSTANTS, IMPORT_MODES, MODAL_KEYS, ROUTES, SubjectsEnum, colors } from '@config';
import { useImportDetails } from '@hooks/useImportDetails';

import { Tabs } from '@ui/Tabs';
import { Button } from '@ui/button';
import { Schema } from '@components/imports/schema';
import { withProtectedResource } from '@components/hoc';
import { AppLayout } from '@layouts/AppLayout';
import { DeleteIcon } from '@assets/icons/Delete.icon';
import { LeftArrowIcon } from '@assets/icons/LeftArrow.icon';
import { modals } from '@mantine/modals';
import { WelcomeImporterModal } from '@components/imports/destination/WidgetConfigurationModal/WelcomeImporterModal';
import {
  WelcomeConfigureStepModal,
  WelcomeConfigureStepModalActionEnum,
} from '@components/imports/destination/WidgetConfigurationModal/WelcomeConfigureStepModal';
import { useImpler } from '@impler/react';
import { ForbiddenIcon } from '@assets/icons';
import { useImports } from '@hooks/useImports';
import { useSubscriptionMetaDataInformation } from '@hooks/useSubscriptionMetaDataInformation';
import { EditIcon } from '@assets/icons/Edit.icon';
import { IntegrationIcon } from '@assets/icons/Integration.icon';
import { Destination } from '@components/imports/destination';

const Editor = dynamic(() => import('@components/imports/editor').then((mod) => mod.OutputEditor), {
  ssr: false,
});
const Validator = dynamic(() => import('@components/imports/validator').then((mod) => mod.Validator), {
  ssr: false,
});

function ImportDetails() {
  const { customValidatatorCodeUnavailable } = useSubscriptionMetaDataInformation();

  const router = useRouter();
  const { onImportCreateClick, showWelcome, clearWelcomeFlag } = useImports();
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

  const handleActionClick = useCallback(
    async (action: WelcomeConfigureStepModalActionEnum) => {
      modals.closeAll();
      clearWelcomeFlag();
      switch (action) {
        case WelcomeConfigureStepModalActionEnum.SetupDestination:
          setActiveTab('destination');
          break;
        case WelcomeConfigureStepModalActionEnum.CreateImporter:
          onImportCreateClick();
          router.push(ROUTES.IMPORTS);
          break;
        case WelcomeConfigureStepModalActionEnum.EmbedIntoYourApplication:
          onIntegrationClick();
          break;
        case WelcomeConfigureStepModalActionEnum.TalkWithTeam:
          window.open(CONSTANTS.IMPLER_CAL_QUICK_MEETING, '_blank');
          break;
        default:
          break;
      }
    },
    [onImportCreateClick, setActiveTab, router, clearWelcomeFlag, onIntegrationClick]
  );

  const { showWidget, isImplerInitiated, closeWidget } = useImpler({
    primaryColor: colors.faintYellow,
    templateId: templateData?._id,
    projectId: templateData?._projectId,
    accessToken: profileInfo?.accessToken,
    appearance: defaultWidgetAppereance,
    onUploadComplete: (data) => {
      onSpreadsheetImported();
      if (data) {
        closeWidget();
        if (showWelcome) {
          modals.closeAll();
          setTimeout(() => {
            modals.open({
              id: MODAL_KEYS.WELCOME_CONFIGURE_STEP,
              children: (
                <WelcomeConfigureStepModal
                  onConfigureDestinationClicked={(action) => {
                    handleActionClick(action);
                  }}
                />
              ),
              withCloseButton: false,
              centered: true,
              size: 'xl',
              onClose: () => {
                clearWelcomeFlag();
              },
            });
          }, 1000);
        }
      }
    },
  });

  const onImportClick = useCallback(() => {
    track({ name: 'IMPORT CLICK', properties: {} });
    clearWelcomeFlag();
    modals.close(MODAL_KEYS.WELCOME_IMPORTER);

    setTimeout(() => showWidget({}), 150);
  }, [showWidget, clearWelcomeFlag]);

  useEffect(() => {
    if (showWelcome) {
      modals.open({
        id: MODAL_KEYS.WELCOME_IMPORTER,
        children: (
          <WelcomeImporterModal
            onDoWelcomeWidgetAction={() => {
              onImportClick();
            }}
          />
        ),
        withCloseButton: true,
        centered: true,
        size: 'xl',
        onClose: () => {
          clearWelcomeFlag();
        },
      });
    }
  }, [showWelcome, onImportClick, clearWelcomeFlag]);

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
              icon: <ForbiddenIcon size="xl" />,
              disabled: customValidatatorCodeUnavailable,
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

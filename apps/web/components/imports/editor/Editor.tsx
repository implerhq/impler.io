import { Controller } from 'react-hook-form';
import { Group, Title, Text, useMantineColorScheme, Flex, Code, Stack, LoadingOverlay } from '@mantine/core';

import { colors, DOCUMENTATION_REFERENCE_LINKS } from '@config';
import { Button } from '@ui/button';
import { Editor } from '@ui/editor/Editor';
import { useEditor } from '@hooks/useEditor';
import { DestinationsEnum } from '@impler/shared';

import { Alert } from '@ui/Alert';
import { VarLabel } from './VarLabel';
import { VarItemWrapper } from './VarItemWrapper';
import { WarningIcon } from '@assets/icons/Warning.icon';
import { InformationIcon } from '@assets/icons/Information.icon';
import { PossibleJSONErrors } from '@components/common/PossibleJsonErrors';
import { TooltipLink } from '@components/TooltipLink';

interface OutputEditorProps {
  templateId: string;
  switchToDestination: () => void;
}

const titles = {
  [DestinationsEnum.WEBHOOK]: {
    title: 'Customize how you want to get data',
    subtitle:
      'Customize the format of how data will be sent to your destination. You can mention properties from extra data too.',
  },
  [DestinationsEnum.BUBBLEIO]: {
    title: 'Customize the fields you want to send to Bubble.io',
    subtitle:
      'Following format represents the format of individual rows that will send to Bubble.io. You can mention dynamic properties too.',
  },
  [DestinationsEnum.FRONTEND]: {
    title: 'Customize how you want to get in Frontend',
    subtitle: 'Following format represents the format of individual rows that will send to Frontend.',
  },
};

export function OutputEditor({ templateId, switchToDestination }: OutputEditorProps) {
  const { colorScheme } = useMantineColorScheme();
  const {
    customization,
    control,
    errors,
    onSaveClick,
    destination,
    syncCustomization,
    isSyncCustomizationLoading,
    isCustomizationLoading,
    isDestinationLoading,
  } = useEditor({
    templateId,
  });

  return (
    <>
      <LoadingOverlay visible={isCustomizationLoading || isDestinationLoading} />
      {destination && destination.destination ? (
        <Stack spacing="sm">
          <Group position="apart">
            <div>
              <Flex gap="sm" align="center">
                <Title color={colorScheme === 'dark' ? colors.white : colors.black} order={4}>
                  {titles[destination.destination].title}
                </Title>
                <TooltipLink link={DOCUMENTATION_REFERENCE_LINKS.customValidation} />
              </Flex>
              <Text fw="normal" color={colors.TXTSecondaryDark}>
                {titles[destination.destination].subtitle}
              </Text>
            </div>
            <Button onClick={onSaveClick}>Update</Button>
          </Group>
          {destination.destination === DestinationsEnum.WEBHOOK && (
            <Alert icon={<InformationIcon size="sm" />} p="xs">
              <Code>{`%<var>%`}</Code> will be used to loop over data items.
            </Alert>
          )}
          {(customization?.isCombinedFormatUpdated || customization?.isRecordFormatUpdated) && (
            <Alert p="xs" color="red" icon={<WarningIcon size="sm" />}>
              <Flex align="center" justify="space-between">
                Format is updated manually. The update in schema will not reflact automatically in output.
                <Button size="xs" onClick={syncCustomization} loading={isSyncCustomizationLoading}>
                  Sync Again
                </Button>
              </Flex>
            </Alert>
          )}
          <Flex gap="xs">
            <div style={{ width: '80%' }}>
              <Controller
                control={control}
                name="format"
                render={({ field }) => (
                  <Editor
                    name="format"
                    id="format"
                    value={field.value}
                    onChange={field.onChange}
                    variables={[...(customization?.recordVariables || []), ...(customization?.chunkVariables || [])]}
                  />
                )}
              />
              {errors.format?.message && <Text color="red">{errors.format.message}</Text>}
              {errors.format?.type === 'JSON' && <PossibleJSONErrors />}
            </div>
            <div style={{ width: '20%', display: 'flex', flexDirection: 'column', gap: '5' }}>
              <VarLabel label="System Variables">
                {customization?.chunkVariables.map((variable) => (
                  <VarItemWrapper key={variable} name={variable} copyText={'"' + variable + '"'} />
                ))}
              </VarLabel>
              <VarLabel label="Schema Variables">
                {customization?.recordVariables.map((variable) => (
                  <VarItemWrapper key={variable} name={variable} copyText={'"' + variable + '"'} />
                ))}
              </VarLabel>
            </div>
          </Flex>
        </Stack>
      ) : (
        <Stack align="center">
          <Text>
            Output format is associated with destination. Please choose appropriate <b>destination</b> to change the
            output.
          </Text>
          <Button onClick={switchToDestination}>Update Destination</Button>
        </Stack>
      )}
    </>
  );
}

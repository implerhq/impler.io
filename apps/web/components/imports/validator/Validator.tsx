import { colors, DOCUMENTATION_REFERENCE_LINKS } from '@config';
import { Controller } from 'react-hook-form';
import {
  Group,
  Stack,
  useMantineColorScheme,
  Title,
  Text,
  Flex,
  Accordion,
  List,
  Code,
  LoadingOverlay,
} from '@mantine/core';

import { Button } from '@ui/button';
import { Editor } from '@ui/editor/Editor';
import { VarLabel } from '../editor/VarLabel';
import { useValidator } from '@hooks/useValidator';
import { VarItemWrapper } from '../editor/VarItemWrapper';
import { InformationIcon } from '@assets/icons/Information.icon';
import { TooltipLink } from '@components/guide-point';

interface ValidatorProps {
  templateId: string;
}

export function Validator({ templateId }: ValidatorProps) {
  const systemVariables = [
    'params.uploadId',
    'params.fileName',
    'params.data',
    'params.extra',
    'params.totalRecords',
    'params.chunkSize',
  ];
  const { colorScheme } = useMantineColorScheme();
  const { control, editorVariables, onSave, isUpdateValidationsLoading, isValidationsLoading, testCodeResult } =
    useValidator({
      templateId,
    });

  return (
    <div style={{ position: 'relative' }}>
      <LoadingOverlay visible={isValidationsLoading} />
      <Stack spacing="sm">
        <Group position="apart">
          <div>
            <Flex gap="sm" align="center">
              <Title color={colorScheme === 'dark' ? colors.white : colors.black} order={4}>
                Validate data in batch
              </Title>
              <TooltipLink link={DOCUMENTATION_REFERENCE_LINKS.customValidation} />
            </Flex>
            <Text fw="normal" color={colors.TXTSecondaryDark}>
              Use this space to apply some custom validator in data like, validating data against data in your database.
            </Text>
          </div>

          <Button onClick={onSave} loading={isUpdateValidationsLoading}>
            Test and Save
          </Button>
        </Group>
        <Accordion variant="contained">
          <Accordion.Item value="instructions" p={0} color="green">
            <Accordion.Control icon={<InformationIcon size="md" color={colors.green} />}>
              Instructions
            </Accordion.Control>
            <Accordion.Panel>
              <List spacing="xs">
                <List.Item>
                  You can use <Code>axios@1.9.0</Code> library to make http requests.
                </List.Item>
                <List.Item>
                  Following keys are available in <Code>params</Code> object to use in your code:
                  <Code block>
                    {`{
  uploadId: string;
  extra: string | number | json;
  fileName: string;
  data: [
    {
      index: number;
      record: {
        [key: string]: string | number; // key is from "Schema Variables" mentioned below
      };
      errors: {};
      isValid: boolean;
    }
  ]
  totalRecords: number;
  chunkSize: number;
}
`}
                  </Code>
                </List.Item>
                <List.Item>
                  You need to return result of validation as array like,
                  <Code block>{`[
  { 
    index: 1, 
    errors: {
      email: 'email is already exists'
    } 
  }
]`}</Code>
                </List.Item>
                <List.Item>
                  In case of all records are valid, you can return empty array <Code>[]</Code>
                </List.Item>
              </List>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
        <Flex gap="xs">
          <div style={{ width: '80%' }}>
            <Controller
              control={control}
              name="onBatchInitialize"
              render={({ field }) => (
                <Editor
                  name="batchDataValidator"
                  id="batch-validator"
                  mode="javascript"
                  value={field.value}
                  onChange={field.onChange}
                  variables={[...systemVariables]}
                />
              )}
            />
            {testCodeResult && !testCodeResult.passed && (
              <Text color="red">It seems there is some issues with code!</Text>
            )}
          </div>
          <div style={{ width: '20%', display: 'flex', flexDirection: 'column', gap: '5' }}>
            <VarLabel label="System Variables">
              {systemVariables.map((variable) => (
                <VarItemWrapper key={variable} name={variable} copyText={variable} />
              ))}
            </VarLabel>
            <VarLabel label="Schema Variables">
              {editorVariables.map((variable) => (
                <VarItemWrapper key={variable} name={variable} copyText={'"' + variable + '"'} />
              ))}
            </VarLabel>
          </div>
        </Flex>
      </Stack>
    </div>
  );
}

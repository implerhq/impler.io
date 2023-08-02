import { colors } from '@config';
import { Controller } from 'react-hook-form';
import { Group, Stack, useMantineColorScheme, Title, Text, Flex, Accordion, List, Code } from '@mantine/core';

import { Button } from '@ui/button';
import { Editor } from '@ui/editor/Editor';
import { VarLabel } from '../editor/VarLabel';
import { useValidator } from '@hooks/useValidator';
import { VarItemWrapper } from '../editor/VarItemWrapper';
import { InformationIcon } from '@assets/icons/Information.icon';

interface ValidatorProps {
  templateId: string;
}

export function Validator({ templateId }: ValidatorProps) {
  const systemVariables = ['uploadId', 'fileName', 'data', 'extra'];
  const recordVariables = ['fname', 'lname', 'surname'];
  const { colorScheme } = useMantineColorScheme();
  const { control, onSave, isUpdateValidationsLoading } = useValidator({ templateId });

  return (
    <Stack spacing="sm">
      <Group position="apart">
        <div>
          <Title color={colorScheme === 'dark' ? colors.white : colors.black} order={4}>
            Validate data in batch
          </Title>
          <Text fw="normal" color={colors.TXTSecondaryDark}>
            Use this space to apply some custom validator in data like, validating data against data in your database.
          </Text>
        </div>

        <Button onClick={onSave} loading={isUpdateValidationsLoading}>
          Save
        </Button>
      </Group>
      <Accordion variant="contained">
        <Accordion.Item value="instructions" p={0} color="green">
          <Accordion.Control icon={<InformationIcon size="md" color={colors.green} />}>Instructions</Accordion.Control>
          <Accordion.Panel>
            <List>
              <List.Item>
                You can use <Code>axios@1.9.0</Code> library to make http requests.
              </List.Item>
              <List.Item>
                Following keys are available in <Code>params</Code> object to use in your code:
                <List>
                  <List.Item>
                    <Code>uploadId</Code> - id of current upload
                  </List.Item>
                  <List.Item>
                    <Code>fileName</Code> - name of current file
                  </List.Item>
                  <List.Item>
                    <Code>data</Code> - array of records, available keys in record are:{' '}
                    <Code>{recordVariables.join(', ')}</Code>
                  </List.Item>
                  <List.Item>
                    <Code>extra</Code> - extra data passed to upload
                  </List.Item>
                  <List.Item>
                    <Code>totalRecords</Code> - total number of records in file
                  </List.Item>
                  <List.Item>
                    <Code>chunkSize</Code> - number of records in current chunk
                  </List.Item>
                </List>
              </List.Item>
              <List.Item>
                You can use <Code>console.log</Code> and <Code>console.error</Code>, to debug your code, output will be
                available in browser console.
              </List.Item>
              <List.Item>
                You need to return result of validation as array like,
                <Code block>{`[\n\t{ index: 1, errors: { email: 'email is already exists' } }\n]`}</Code>
              </List.Item>
              <List.Item>
                In case of all records are valid, you need to return empty array <Code>[]</Code>
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
              />
            )}
          />
        </div>
        <div style={{ width: '20%', display: 'flex', flexDirection: 'column', gap: '5' }}>
          <VarLabel label="System Variables">
            {systemVariables.map((variable) => (
              <VarItemWrapper key={variable} name={variable} copyText={'"' + variable + '"'} />
            ))}
          </VarLabel>
          <VarLabel label="Schema Variables">
            {recordVariables.map((variable) => (
              <VarItemWrapper key={variable} name={variable} copyText={'"' + variable + '"'} />
            ))}
          </VarLabel>
        </div>
      </Flex>
    </Stack>
  );
}

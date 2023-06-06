import { Controller } from 'react-hook-form';
import { Accordion, Group, List, Title, Text, useMantineColorScheme } from '@mantine/core';

import { colors } from '@config';
import { Button } from '@ui/button';
import { Editor } from '@ui/editor/Editor';
import { useEditor } from '@hooks/useEditor';

function PossibleJSONErrors() {
  return (
    <>
      <Text td="underline">This can be the reason:</Text>
      <List>
        <List.Item>Extra comma (,) at the end or missing comma (,) in between.</List.Item>
        <List.Item>Keys are not quoted into double quote (&quot;).</List.Item>
      </List>
    </>
  );
}

interface OutputEditorProps {
  templateId: string;
}

export default function OutputEditor({ templateId }: OutputEditorProps) {
  const { colorScheme } = useMantineColorScheme();
  const { customization, control, errors, onSaveClick } = useEditor({ templateId });

  return (
    <>
      <Group position="apart">
        <Text fw="normal" color={colors.TXTDark}>
          Customize the format of how data will be sent to your destination.
        </Text>
        <Group>
          <Button onClick={onSaveClick}>Save</Button>
        </Group>
      </Group>

      <Accordion mt="sm" variant="contained" radius={0}>
        <Accordion.Item value="record">
          <Accordion.Control>
            <Title color={colorScheme === 'dark' ? colors.white : colors.black} order={4}>
              Customize individual record
            </Title>
            <Title order={5} fw="normal" color={colors.TXTSecondaryDark}>
              Customize the structure of individual record.
            </Title>
          </Accordion.Control>
          <Accordion.Panel>
            <Controller
              control={control}
              name="recordFormat"
              render={({ field }) => (
                <Editor
                  name="recordItem"
                  id="record-item"
                  value={field.value}
                  onChange={field.onChange}
                  variables={customization?.recordVariables}
                />
              )}
            />
            {errors.recordFormat?.message && <Text color="red">{errors.recordFormat.message}</Text>}
            {errors.recordFormat?.type === 'JSON' && <PossibleJSONErrors />}
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="chunk">
          <Accordion.Control>
            <Title color={colorScheme === 'dark' ? colors.white : colors.black} order={4}>
              Customize chunk Format
            </Title>
            <Title order={5} fw="normal" color={colors.TXTSecondaryDark}>
              Customize the structure of chunk. Imported records are divided into chunks and sent to destination. Chunk
              includes array of record.
            </Title>
          </Accordion.Control>
          <Accordion.Panel>
            <Controller
              control={control}
              name="chunkFormat"
              render={({ field }) => (
                <Editor
                  name="chunkFormat"
                  id="chunk-item"
                  value={field.value}
                  onChange={field.onChange}
                  variables={customization?.chunkVariables}
                />
              )}
            />
            {errors.chunkFormat?.message && <Text color="red">{errors.chunkFormat.message}</Text>}
            {errors.chunkFormat?.type === 'JSON' && <PossibleJSONErrors />}
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </>
  );
}

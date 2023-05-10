import { Controller } from 'react-hook-form';
import { Group, List, Stack, Text } from '@mantine/core';

import { Button } from '@ui/button';
import { Editor } from '@ui/editor/Editor';
import { SectionBlock } from '@ui/section-block';
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
  const { customization, control, errors, onSaveClick } = useEditor({ templateId });

  return (
    <Stack spacing="sm">
      <Group position="apart">
        <Text>Customize how you will receive the data</Text>
        <Group>
          <Button onClick={onSaveClick}>Save</Button>
        </Group>
      </Group>

      <SectionBlock title="Customize individual record Item">
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
      </SectionBlock>

      <SectionBlock title="Customize chunk Format">
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
      </SectionBlock>
    </Stack>
  );
}

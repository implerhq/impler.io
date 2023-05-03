import { Controller, useForm } from 'react-hook-form';
import { Group, List, Stack, Switch, Text } from '@mantine/core';

import { Button } from '@ui/button';
import { Editor } from '@ui/editor/Editor';
import { SectionBlock } from '@ui/section-block';

interface VariableErrorProps {
  variables: string[];
}
function VariableError({ variables }: VariableErrorProps) {
  return (
    <>
      <Text td="underline">Available variables:</Text>
      <List>
        <List.Item>Possible variables are [ {variables.join(', ')} ]</List.Item>
      </List>
    </>
  );
}

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

export default function OutputEditor({}: {
  onChange?: (value: string) => void;
  value?: string;
  height?: string;
  variables?: string[];
}) {
  const recordVariables = ['record.fName', 'record.lName'];
  const chunkVariables = [
    'chunk.data',
    'chunk.totalRecords',
    'chunk.page',
    'chunk.limit',
    'chunk.totalPages',
    'chunk.hasMore',
    'chunk.templateId',
  ];
  const {
    formState: { errors },
    control,
    setError,
    handleSubmit,
  } = useForm<{
    recordFormat: string;
    chunkFormat: string;
  }>({
    defaultValues: {
      recordFormat: `{
  "name": "record.fName",
  "lname": "record.lName"
}`,
      chunkFormat: `{
  "totalRecords": "chunk.totalRecords",
  "page": "chunk.page",
  "limit": "chunk.limit",
  "totalPages": "chunk.totalPages",
  "hasMore": "chunk.hasMore",
  "data": "chunk.data"
}`,
    },
  });
  const validateFormat = (data: string, variables: string[], prefix: string): boolean => {
    try {
      JSON.parse(data);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-throw-literal
      throw { type: 'JSON', message: 'Not a valid JSON!' };
    }
    try {
      const parsed = JSON.parse(data);
      const values = Object.values(parsed);
      const isValid: boolean = values.every((value) => {
        if (typeof value === 'string' && value.startsWith(prefix)) {
          return variables.includes(value);
        } else if (typeof value === 'object') {
          return validateFormat(JSON.stringify(value), variables, prefix);
        }

        return true;
      });
      if (!isValid) throw new Error('Variables are not proper');

      return isValid;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-throw-literal
      throw { type: 'VARIABLES', message: 'Variables are not Proper!' };
    }
  };
  const validateFormats = () => {
    handleSubmit((data) => {
      const { chunkFormat, recordFormat } = data;
      try {
        validateFormat(chunkFormat, chunkVariables, 'chunk.');
      } catch (error) {
        setError('chunkFormat', {
          type: (error as any).type,
          message: (error as Error).message,
        });
      }

      try {
        validateFormat(recordFormat, recordVariables, 'record.');
      } catch (error) {
        setError('recordFormat', {
          type: (error as any).type,
          message: (error as Error).message,
        });
      }
      // eslint-disable-next-line no-console
      console.log(chunkFormat, recordFormat);
    })();
  };

  return (
    <Stack spacing="sm">
      <Group position="apart">
        <Text>Customize how you will receive the data</Text>
        <Group>
          <Switch onLabel="Preview" offLabel="Customize" size="lg" />
          <Button onClick={validateFormats}>Save</Button>
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
              variables={recordVariables}
            />
          )}
        />
        {errors.recordFormat?.message && <Text color="red">{errors.recordFormat.message}</Text>}
        {errors.recordFormat?.type === 'JSON' && <PossibleJSONErrors />}
        {errors.recordFormat?.type === 'VARIABLES' && <VariableError variables={recordVariables} />}
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
              variables={chunkVariables}
            />
          )}
        />
        {errors.chunkFormat?.message && <Text color="red">{errors.chunkFormat.message}</Text>}
        {errors.chunkFormat?.type === 'JSON' && <PossibleJSONErrors />}
        {errors.chunkFormat?.type === 'VARIABLES' && <VariableError variables={chunkVariables} />}
      </SectionBlock>
    </Stack>
  );
}

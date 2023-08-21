import { Prism } from '@mantine/prism';
import { ITemplate } from '@impler/shared';
import { Controller } from 'react-hook-form';
import { Code, Stack, Accordion, Title, useMantineColorScheme } from '@mantine/core';

import { Input } from '@ui/input';
import { Button } from '@ui/button';
import { APIBlock } from '@ui/api-block';
import { NumberInput } from '@ui/number-input';
import { REGULAR_EXPRESSIONS, colors } from '@config';
import { useDestination } from '@hooks/useDestination';

interface DestinationProps {
  template: ITemplate;
  accessToken?: string;
}

export function Destination({ template, accessToken }: DestinationProps) {
  const { colorScheme } = useMantineColorScheme();
  const { register, control, errors, onSubmit, isUpdateImportLoading } = useDestination({ template });

  return (
    <>
      <Accordion variant="contained" radius={0} defaultValue="webhook">
        <Accordion.Item value="webhook">
          <Accordion.Control>
            <Title color={colorScheme === 'dark' ? colors.white : colors.black} order={4}>
              Webhook
            </Title>
            <Title order={5} fw="normal" color={colors.TXTSecondaryDark}>
              Provide webhook to receive data
            </Title>
          </Accordion.Control>
          <Accordion.Panel>
            <form onSubmit={onSubmit}>
              <Stack spacing="xs">
                <Input
                  placeholder="Callback URL"
                  register={register('callbackUrl', {
                    pattern: REGULAR_EXPRESSIONS.URL,
                  })}
                  error={errors.callbackUrl ? 'Please enter valid URL' : undefined}
                />
                <Input placeholder="Auth Header Name" register={register('authHeaderName')} />
                <Controller
                  control={control}
                  name="chunkSize"
                  render={({ field }) => (
                    <NumberInput
                      placeholder="100"
                      register={{
                        value: field.value,
                        onChange: field.onChange,
                      }}
                      error={errors.chunkSize?.message}
                    />
                  )}
                />
                <Button loading={isUpdateImportLoading} type="submit">
                  Save
                </Button>
              </Stack>
            </form>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="api">
          <Accordion.Control>
            <Title color={colorScheme === 'dark' ? colors.white : colors.black} order={4}>
              API
            </Title>
            <Title order={5} fw="normal" color={colors.TXTSecondaryDark}>
              Use API to get data
            </Title>
          </Accordion.Control>
          <Accordion.Panel>
            <Stack spacing="sm">
              <APIBlock
                method="GET"
                title="GET valid data of imported file"
                url="https://api.impler.io/v1/upload/{uploadId}/rows/valid"
              />
              <APIBlock
                method="GET"
                title="Get Invalid data of imported file"
                url="https://api.impler.io/v1/upload/{uploadId}/rows/invalid"
              />
              <Stack spacing="xs">
                <div>
                  <Title order={4}>How to get uploadId?</Title>
                  <Title order={5} fw="normal" color={colorScheme === 'dark' ? colors.TXTGray : colors.TXTLight}>
                    You will get uploadId in <Code>onUploadComplete</Code> callback of <Code>@impler/react</Code>{' '}
                    package, when import is completed.
                  </Title>
                </div>
                <Prism language="tsx">{`import { useImpler } from '@impler/react';
        
const { showWidget, isImplerInitiated } = useImpler({
  templateId: "${template._id}",
  projectId: "${template._projectId}",
  accessToken: "${accessToken}",
  onUploadComplete: ({ _id }) => {
    console.log(_id); // uploadId
  }
});

<button disabled={!isImplerInitiated} onClick={showWidget}>
    Import
</button>`}</Prism>
              </Stack>
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </>
  );
}

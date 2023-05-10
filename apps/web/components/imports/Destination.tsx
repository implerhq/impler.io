import { Prism } from '@mantine/prism';
import { ITemplate } from '@impler/shared';
import { Code, Divider, Stack, Text } from '@mantine/core';

import { REGULAR_EXPRESSIONS, colors } from '@config';
import { Input } from '@ui/input';
import { Button } from '@ui/button';
import { APIBlock } from '@ui/api-block';
import { SectionBlock } from '@ui/section-block';
import { useDestination } from '@hooks/useDestination';

interface DestinationProps {
  template: ITemplate;
}

export function Destination({ template }: DestinationProps) {
  const { register, errors, onSubmit, isUpdateImportLoading } = useDestination({ template });

  return (
    <>
      <Text pb="sm">
        To get imported data you can provide Webhook URL or You can call our API to get valid and invalid data.
      </Text>
      <SectionBlock title="Add Script">
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
            <Button loading={isUpdateImportLoading} type="submit">
              Save
            </Button>
          </Stack>
        </form>
      </SectionBlock>
      <Divider my="sm" variant="dotted" />
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
        <SectionBlock title="How to get uploadId?">
          <Text style={{ lineHeight: '1.5rem', color: colors.TXTSecondaryDark }}>
            You will get uploadId in <Code>onUploadComplete</Code> callback of <Code>@impler/react</Code> package, at
            the time of import is completed.
          </Text>
          <Prism language="tsx">{`import { Import } from '@impler/react';
        \n<Button projectId="<PROJECT_ID>" template="<CODE_OR_ID>" onUploadComplete={(upload) => console.log(upload)}>
        Import\n</Button>`}</Prism>
        </SectionBlock>
      </Stack>
    </>
  );
}

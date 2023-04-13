import { useState } from 'react';
import { Prism } from '@mantine/prism';
import { Code, Divider, Stack, Text } from '@mantine/core';

import { Input } from '@ui/input';
import { Select } from '@ui/select';
import { APIBlock } from '@ui/api-block';
import { SectionBlock } from '@ui/section-block';

export function Destination() {
  const [type, setType] = useState<'webhook' | 'rest'>('webhook');

  return (
    <Stack style={{ width: '100%', maxWidth: '600px' }}>
      <Select
        data={[
          { label: 'Webhook Call', value: 'webhook' },
          { label: 'REST API', value: 'rest' },
        ]}
        register={{
          value: type,
          onChange: (e: React.ChangeEvent<HTMLSelectElement>) => setType(e.target.value as any),
        }}
      />
      <Divider variant="dotted" />
      {type === 'webhook' && (
        <Stack spacing="xs">
          <Input placeholder="Webhook URL" />
          <Input placeholder="Auth Header Name" />
        </Stack>
      )}
      {type === 'rest' && (
        <Stack spacing="sm">
          <APIBlock
            method="GET"
            title="GET valid data of imported file"
            url="https://api.impler.io/v1/upload/{uploadId}/rows/valid"
          />
          <APIBlock
            method="POST"
            title="Get Invalid data of imported file"
            url="https://api.impler.io/v1/upload/{uploadId}/rows/invalid"
          />
          <SectionBlock title="How to get uploadId?">
            <Text style={{ lineHeight: '1.5rem' }}>
              You will get uploadId in <Code>onUploadComplete</Code> callback of <Code>@impler/react</Code> package, at
              the time of import is completed.
            </Text>
            <Prism language="tsx">{`import { Import } from '@impler/react';
        \n<Button projectId="<PROJECT_ID>" template="<CODE_OR_ID>" onUploadComplete={(upload) => console.log(upload)}>
        Import\n</Button>`}</Prism>
          </SectionBlock>
        </Stack>
      )}
    </Stack>
  );
}

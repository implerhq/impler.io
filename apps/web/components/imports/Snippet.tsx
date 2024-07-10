import getConfig from 'next/config';
import { Prism } from '@mantine/prism';
import { Accordion, Code, Text, Title, useMantineColorScheme } from '@mantine/core';

import { CONSTANTS, colors } from '@config';

interface SnippetProps {
  projectId: string;
  templateId: string;
  accessToken?: string;
}

const { publicRuntimeConfig } = getConfig();

export function Snippet({ projectId, templateId, accessToken }: SnippetProps) {
  const { colorScheme } = useMantineColorScheme();

  return (
    <>
      <Accordion variant="contained" radius={0} defaultValue="button">
        <Accordion.Item value="script">
          <Accordion.Control>
            <Title color={colorScheme === 'dark' ? colors.white : colors.black} order={4}>
              1. Add Script
            </Title>
            <Title order={5} fw="normal" color={colors.TXTSecondaryDark}>
              Copy & Paste this snippet to your code before the closing body tag. It will add impler variable in window.
            </Title>
          </Accordion.Control>
          <Accordion.Panel>
            {/* eslint-disable-next-line max-len */}
            <Prism language="markup">{`<script type="text/javascript" src="${publicRuntimeConfig.NEXT_PUBLIC_EMBED_URL}" async></script>`}</Prism>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="install">
          <Accordion.Control>
            <Title color={colorScheme === 'dark' ? colors.white : colors.black} order={4}>
              2. Install the package
            </Title>
            <Title order={5} fw="normal" color={colors.TXTSecondaryDark}>
              Add <Code>@impler/react</Code> in your application by running the following command.
            </Title>
          </Accordion.Control>
          <Accordion.Panel>
            <Prism language="bash">{`npm i @impler/react\n# or\nyarn add @impler/react`}</Prism>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="button">
          <Accordion.Control>
            <Title color={colorScheme === 'dark' ? colors.white : colors.black} order={4}>
              3. Add Import Button
            </Title>
            <Title order={5} fw="normal" color={colors.TXTSecondaryDark}>
              Now add <Code>Import</Code> Button from <Code>@impler/react</Code> which opens the Widget.
            </Title>
          </Accordion.Control>
          <Accordion.Panel>
            <Prism language="tsx">{`import { useImpler } from '@impler/react';
        
const { showWidget, isImplerInitiated } = useImpler({
    projectId: "${projectId}",
    templateId: "${templateId}",
    accessToken: "${accessToken}",
});

<button disabled={!isImplerInitiated} onClick={showWidget}>
    Import
</button>`}</Prism>
            <Text mt="xs" style={{ lineHeight: '1.5rem' }}>
              You can get to know about props on{' '}
              <a href={CONSTANTS.REACT_DOCUMENTATION_URL} target="_blank" rel="noreferrer">
                documentation
              </a>
              .
            </Text>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </>
  );
}

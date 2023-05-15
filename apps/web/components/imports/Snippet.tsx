import { Prism } from '@mantine/prism';
import { Code, Flex, Text } from '@mantine/core';

import { CONSTANTS, colors } from '@config';
import { SectionBlock } from '@ui/section-block';

interface SnippetProps {
  projectId: string;
  templateId: string;
  accessToken?: string;
}

export function Snippet({ projectId, templateId, accessToken }: SnippetProps) {
  return (
    <Flex gap="sm" direction="column">
      <Text>
        You can use <Code>@impler/react</Code> package to add an import widget in your application.
      </Text>
      <SectionBlock title="Add Script">
        <Text style={{ lineHeight: '1.5rem', color: colors.TXTSecondaryDark }}>
          Copy & Paste this snippet to your code before the closing body tag. It will add impler variable in window, so
          you can call its init and show method.
        </Text>
        <Prism language="markup">{`<script type="text/javascript" src="${CONSTANTS.EMBED_URL}" async></script>`}</Prism>
      </SectionBlock>

      <SectionBlock title="Install the Package">
        <Text style={{ lineHeight: '1.5rem', color: colors.TXTSecondaryDark }}>
          Add <Code>@impler/react</Code> in your application by running the following command.
        </Text>
        <Prism language="bash">{`npm i @impler/react\n# or\nyarn add @impler/react`}</Prism>
      </SectionBlock>

      <SectionBlock title="Add Import Button">
        <Text style={{ lineHeight: '1.5rem', color: colors.TXTSecondaryDark }}>
          Now add <Code>Import</Code> Button from <Code>@impler/react</Code> which opens the Widget.
        </Text>
        <Prism language="tsx">{`import { Import } from '@impler/react';
        \n<Button projectId="${projectId}" templateId="${templateId}" accessToken="${accessToken}">\nImport\n</Button>`}</Prism>
        <Text style={{ lineHeight: '1.5rem', color: colors.TXTSecondaryDark }}>
          You can get to know about props on{' '}
          <a href={CONSTANTS.REACT_DOCUMENTATION_URL} target="_blank" rel="noreferrer">
            documentation
          </a>
          .
        </Text>
      </SectionBlock>
    </Flex>
  );
}

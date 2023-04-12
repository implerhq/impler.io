import { Prism } from '@mantine/prism';
import { Code, Flex, Stack, Text, Title, useMantineColorScheme } from '@mantine/core';
import { colors } from '@config';

interface SectionBlockProps extends React.PropsWithChildren {
  title: string;
  isDarkMode?: boolean;
}

const SectionBlock = ({ children, title, isDarkMode }: SectionBlockProps) => {
  return (
    <Stack
      spacing="xs"
      style={{
        backgroundColor: isDarkMode ? colors.BGPrimaryDark : colors.BGPrimaryLight,
        padding: '15px',
      }}
    >
      <Title order={4}>{title}</Title>
      {children}
    </Stack>
  );
};

export function Snippet() {
  const theme = useMantineColorScheme();

  return (
    <Flex gap="sm" direction="column">
      <Text>
        You can use <Code>@impler/react</Code> package to add an import widget in your application.
      </Text>
      <SectionBlock title="Add Script" isDarkMode={theme.colorScheme === 'dark'}>
        <Text style={{ lineHeight: '1.5rem' }}>
          Copy & Paste this snippet to your code before the closing body tag. It will add impler variable in window, so
          you can call its init and show method.
        </Text>
        <Prism language="markup">
          {'<script type="text/javascript" src="https://embed.impler.io/embed.umd.min.js" async></script>'}
        </Prism>
      </SectionBlock>

      <SectionBlock title="Install the Package" isDarkMode={theme.colorScheme === 'dark'}>
        <Text style={{ lineHeight: '1.5rem', color: colors.TXTSecondaryDark }}>
          Add <Code>@impler/react</Code> in your application by running the following command.
        </Text>
        <Prism language="bash">{`npm i @impler/react\n# or\nyarn add @impler/react`}</Prism>
      </SectionBlock>

      <SectionBlock title="Add Import Button" isDarkMode={theme.colorScheme === 'dark'}>
        <Text style={{ lineHeight: '1.5rem' }}>
          Now add <Code>Import</Code> Button from <Code>@impler/react</Code> which opens the Widget.
        </Text>
        <Prism language="tsx">{`import { Import } from '@impler/react';
        \n<Button projectId="<PROJECT_ID>" template="<CODE_OR_ID>">\nImport\n</Button>`}</Prism>
        <Text style={{ lineHeight: '1.5rem' }}>
          You can get to know about props on{' '}
          <a href={process.env.DOCUMENTATION_REACT_PROPS_URL} target="_blank" rel="noreferrer">
            documentation
          </a>
          .
        </Text>
      </SectionBlock>
    </Flex>
  );
}

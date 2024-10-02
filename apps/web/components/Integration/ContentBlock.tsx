import { IntegrationLanguage } from '@config';
import { Prism } from '@mantine/prism';
import {} from '@mantine/prism';

type CodeBlockProps = {
  code: string;
  language?: IntegrationLanguage;
};

export const CodeBlock = ({ code, language = 'javascript' }: CodeBlockProps) => (
  <div style={{ position: 'relative', marginTop: 10 }}>
    <Prism language={language} copyLabel="Copy code" copiedLabel="Copied!">
      {code.trim()}
    </Prism>
  </div>
);

import dynamic from 'next/dynamic';
import { IntegrationLanguage } from '@config';
import { Suspense } from 'react';
import { LoadingOverlay } from '@mantine/core';

type CodeBlockProps = {
  code: string;
  language?: IntegrationLanguage;
};

const Prism = dynamic(() => import('@mantine/prism').then((mod) => mod.Prism));

export const CodeBlock = ({ code, language = 'javascript' }: CodeBlockProps) => (
  <div style={{ position: 'relative', marginTop: 10 }}>
    <Suspense fallback={<LoadingOverlay visible />}>
      <Prism language={language} copyLabel="Copy code" copiedLabel="Copied!">
        {code.trim()}
      </Prism>
    </Suspense>
  </div>
);

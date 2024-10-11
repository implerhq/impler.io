import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { LoadingOverlay } from '@mantine/core';
import { colors, IntegrationLanguage } from '@config';

type CodeBlockProps = {
  code: string;
  language?: IntegrationLanguage;
};

const Prism = dynamic(() => import('@mantine/prism').then((mod) => mod.Prism));

export const CodeBlock = ({ code, language = 'javascript' }: CodeBlockProps) => (
  <div style={{ position: 'relative', marginTop: 10 }}>
    <Suspense fallback={<LoadingOverlay visible />}>
      <Prism
        language={language}
        copyLabel="Copy code"
        copiedLabel="Copied!"
        styles={{
          code: {
            backgroundColor: `${colors.black} !important`,
            border: `1px solid ${colors.DisabledDark} !important`,
            maxHeight: '50vh',
            overflow: 'auto',
          },
        }}
      >
        {code.trim()}
      </Prism>
    </Suspense>
  </div>
);

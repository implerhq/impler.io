import { useState } from 'react';
import dynamic from 'next/dynamic';
import { ActionIcon, Flex, Tooltip } from '@mantine/core';

import { colors } from '@config';
import { ColumnsTable } from './ColumnsTable';
import { BracesIcon } from '@assets/icons/Braces.icon';

const ColumnsEditor = dynamic(() => import('./ColumnsEditor').then((mod) => mod.ColumnsEditor), { ssr: false });

interface SchemaProps {
  templateId: string;
}

export function Schema({ templateId }: SchemaProps) {
  const [showJsonEditor, setShowJsonEditor] = useState(false);

  return (
    <Flex gap="sm" direction="column">
      <Flex justify="flex-end">
        <Tooltip label="Edit JSON" withArrow>
          <ActionIcon radius={0} title="Edit JSON" variant="light" onClick={() => setShowJsonEditor(!showJsonEditor)}>
            <BracesIcon size="md" color={colors.yellow} />
          </ActionIcon>
        </Tooltip>
      </Flex>
      {showJsonEditor ? <ColumnsEditor templateId={templateId} /> : <ColumnsTable templateId={templateId} />}
    </Flex>
  );
}

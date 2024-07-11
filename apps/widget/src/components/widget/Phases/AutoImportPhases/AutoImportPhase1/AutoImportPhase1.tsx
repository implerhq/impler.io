import { TextInput, Text, Stack } from '@mantine/core';
import { Container } from 'components/Common/Container';
import { useState } from 'react';
import { PhasesEnum } from '@types';
import { AutoImportFooter } from 'components/Common/Footer/AutoImportFooter';

interface IAutoImportPhase1Props {
  onNextClick: () => void;
}

export function AutoImportPhase1({ onNextClick }: IAutoImportPhase1Props) {
  const [rssUrlValue, setRssUrlValue] = useState<string>('');

  return (
    <Container>
      <Stack spacing="xs" style={{ height: '100%', justifyContent: 'space-between' }}>
        <div>
          <Text mt="sm" ml="md">
            RSSURL
          </Text>
          <TextInput
            onChange={(event) => setRssUrlValue(String(event.target.value))}
            maw="100%"
            placeholder="Enter the RSS URL"
            size="md"
            p="sm"
            value={rssUrlValue}
            style={{ borderRadius: '10px' }}
          />
        </div>

        <AutoImportFooter
          onNextClick={onNextClick}
          primaryButtonLoading={false}
          onPrevClick={() => {}}
          active={PhasesEnum.CONFIGURE}
        />
      </Stack>
    </Container>
  );
}

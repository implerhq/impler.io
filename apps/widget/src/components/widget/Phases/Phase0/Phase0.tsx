import { useEffect } from 'react';
import { colors } from '@config';
import { Stack, Text, Center } from '@mantine/core';
import { LoadingOverlay } from '@ui/LoadingOverlay';
import { usePhase0 } from '@hooks/Phase0/usePhase0';

interface IPhase0Props {
  onValidationSuccess: () => void;
}

export function Phase0({ onValidationSuccess: goNext }: IPhase0Props) {
  const { isLoading, error, fileError, isWidgetOpened, handleValidate } = usePhase0({
    goNext,
  });

  useEffect(() => {
    if (isWidgetOpened) {
      handleValidate();
    }
  }, [isWidgetOpened]);

  if (isLoading) return <LoadingOverlay visible={isLoading} />;

  if (error || fileError) {
    return (
      <Center sx={{ height: '100%', width: '100%' }}>
        <Stack align="center" spacing="xs" sx={{ maxWidth: '80%' }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="60"
            height="60"
            fill="none"
            stroke={colors.yellow}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <Text
            size="lg"
            weight={600}
            color="dimmed"
            align="center"
            sx={{
              color: colors.yellow,
              fontSize: '18px',
            }}
          >
            {error?.message || fileError}
          </Text>
        </Stack>
      </Center>
    );
  }

  return null;
}

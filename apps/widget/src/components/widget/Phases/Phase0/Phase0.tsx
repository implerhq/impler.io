import { useEffect } from 'react';
import { Alert } from '@mantine/core';
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
      <Alert
        color="yellow"
        style={{
          textAlign: 'center',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%,-50%)',
          maxWidth: '100%',
          border: '.1rem solid #FFC300',
        }}
      >
        {error?.message || fileError}
      </Alert>
    );
  }

  return null;
}

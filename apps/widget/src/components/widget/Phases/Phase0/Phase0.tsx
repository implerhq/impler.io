import { LoadingOverlay } from '@ui/LoadingOverlay';
import { usePhase0 } from '@hooks/Phase0/usePhase0';
import { Alert } from '@mantine/core';
import { useEffect } from 'react';

interface IPhase0Props {
  onValidationSuccess: () => void;
  onError: () => void;
}

export function Phase0(props: IPhase0Props) {
  const { onValidationSuccess: goNext, onError: onError } = props;
  const { isLoading, isError, handleValidate } = usePhase0({
    goNext,
    onError,
  });

  useEffect(() => {
    handleValidate();
  }, []);

  return (
    <>
      {isLoading ? (
        <LoadingOverlay visible={!isLoading} />
      ) : isError ? (
        <Alert color="yellow" style={{ textAlign: 'center' }}>
          {isError}
        </Alert>
      ) : (
        goNext()
      )}
    </>
  );
}

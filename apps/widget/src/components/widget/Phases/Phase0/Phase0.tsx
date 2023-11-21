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
  const { isLoading, isError, handleValidate, isWidgetOpened } = usePhase0({
    goNext,
    onError,
  });

  useEffect(() => {
    (async function () {
      try {
        await handleValidate();
      } catch (error) {}
    })();

    () => {};
  }, [isWidgetOpened, isError]);

  return (
    <>
      {isLoading ? (
        <LoadingOverlay visible={isLoading} />
      ) : isError ? (
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
          {isError}
        </Alert>
      ) : (
        goNext()
      )}
    </>
  );
}

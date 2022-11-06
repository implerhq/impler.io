import { useState } from 'react';
import { Modal } from '@ui/Modal';
import { Container } from './Container';
import { Wrapper } from 'components/Common/Wrapper';
import { Phase1 } from './Phases/Phase1';
import { Phase2 } from './Phases/Phase2';
import { Phase3 } from './Phases/Phase3';
import { ConfirmModal } from './Phases/ConfirmModal';
import { Phase4 } from './Phases/Phase4';

export function Widget() {
  const [phase, setPhase] = useState<number>(1);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const onConfirm = () => {
    setShowConfirmModal(false);
    setPhase(4);
  };

  const onClose = () => {
    window.parent.postMessage({ type: 'CLOSE_WIDGET' }, '*');
  };

  return (
    <Container>
      <Modal opened={true} onClose={onClose}>
        <Wrapper active={phase}>
          {phase === 1 ? (
            <Phase1 onNextClick={() => setPhase(2)} />
          ) : phase === 2 ? (
            <Phase2 onNextClick={() => setPhase(3)} onPrevClick={() => setPhase(1)} />
          ) : phase === 3 ? (
            <Phase3 onNextClick={() => setShowConfirmModal(true)} onPrevClick={() => setPhase(2)} />
          ) : phase === 4 ? (
            <Phase4 rowsCount={1000000} onUploadAgainClick={() => setPhase(1)} />
          ) : null}
          <ConfirmModal
            onConfirm={onConfirm}
            onClose={() => setShowConfirmModal(false)}
            opened={showConfirmModal}
            wrongDataCount={8}
          />
        </Wrapper>
      </Modal>
    </Container>
  );
}

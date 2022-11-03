import { useState } from 'react';
import { Modal } from '@ui/Modal';
import { Container } from './Container';
import { Wrapper } from 'components/Common/Wrapper';
import { Phase1 } from './Phases/Phase1';
import { Phase2 } from './Phases/Phase2';
import { Phase3 } from './Phases/Phase3';
import { ConfirmModal } from './Phases/ConfirmModal';

export function Widget() {
  const [phase, setPhase] = useState<number>(1);

  return (
    <Container>
      <Modal opened={true} onClose={() => {}}>
        <Wrapper active={phase}>
          {phase === 1 ? (
            <Phase1 onNextClick={() => setPhase(2)} />
          ) : phase === 2 ? (
            <Phase2 onNextClick={() => setPhase(3)} onPrevClick={() => setPhase(1)} />
          ) : phase === 3 ? (
            <Phase3 onNextClick={() => setPhase(4)} onPrevClick={() => setPhase(2)} />
          ) : phase === 4 ? (
            <ConfirmModal onClose={() => setPhase(3)} opened wrongDataCount={8} />
          ) : (
            <p>asdf</p>
          )}
        </Wrapper>
      </Modal>
    </Container>
  );
}

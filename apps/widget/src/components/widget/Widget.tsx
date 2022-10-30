import { Container } from './Container';
import { Modal } from '@ui/Modal';

export function Widget() {
  return (
    <Container>
      <Modal title="Upload" opened={true} onClose={() => {}}>
        <div style={{ height: '500px' }}>Widget</div>
      </Modal>
    </Container>
  );
}

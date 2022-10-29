import { Container } from './Container';
import { ModalContainer } from '@ui/ModalContainer';

export function Widget() {
  return (
    <Container>
      <ModalContainer title="Upload" opened={true} onClose={() => {}}>
        <div style={{ height: '500px' }}>Widget</div>
      </ModalContainer>
    </Container>
  );
}

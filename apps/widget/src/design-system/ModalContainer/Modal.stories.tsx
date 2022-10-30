import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ModalContainer } from './ModalContainer';

export default {
  title: 'ModalContainer',
  component: ModalContainer,
} as ComponentMeta<typeof ModalContainer>;

export const Simple: ComponentStory<typeof ModalContainer> = () => (
  <ModalContainer opened={true} onClose={() => {}}>
    Content
  </ModalContainer>
);

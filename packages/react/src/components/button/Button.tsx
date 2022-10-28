import React from 'react';
import styled from 'styled-components';
import { ButtonProps } from './Button.types';

const StyledButton = styled.button`
  color: white;
  font-weight: 700;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  padding-left: 1rem;
  padding-right: 1rem;
  background-color: rgba(59, 130, 246, 1);
  border-radius: 0.25rem;
  cursor: pointer;
  text-transform: none;
  font-family: inherit;
  font-size: 100%;
  line-height: inherit;
  border: none;
`;

export const Button = ({
  children = 'Import',
  className = '',
  disabled = false,
  onClick,
}: ButtonProps): JSX.Element => {
  return (
    <StyledButton id="import" className={className} disabled={disabled} onClick={onClick}>
      {children}
    </StyledButton>
  );
};

import React, { useEffect, useState } from 'react';
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
  &:disabled {
    cursor: not-allowed;
  }
`;

export const Button = ({
  children = 'Import',
  className = '',
  projectId,
  template,
  authHeaderValue,
  extra,
}: ButtonProps): JSX.Element => {
  const [isImplerInitiated, setIsImplerInitiated] = useState(false);

  useEffect(() => {
    if (window.impler && projectId) {
      window.impler.init(projectId);
      setIsImplerInitiated(true);
    }
  }, []);

  const onButtonClick = async () => {
    if (window.impler) {
      const payload: any = {};
      if (template) payload.template = template;
      if (extra) {
        if (typeof extra === 'object') payload.extra = JSON.stringify(extra);
        else payload.extra = extra;
      }
      if (authHeaderValue) {
        if (typeof authHeaderValue === 'function' && authHeaderValue.constructor.name === 'AsyncFunction') {
          payload.authHeaderValue = await authHeaderValue();
        } else if (typeof authHeaderValue === 'function') {
          payload.authHeaderValue = authHeaderValue();
        } else {
          payload.authHeaderValue = authHeaderValue;
        }
      }

      window.impler.show(payload);
    }
  };

  return (
    <StyledButton id="import" className={className} disabled={!isImplerInitiated} onClick={onButtonClick}>
      {children}
    </StyledButton>
  );
};

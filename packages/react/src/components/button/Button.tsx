import { IInitPayload, IShowPayload } from '@impler/shared';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { logger } from '../../utils';
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
  accessToken,
  extra,
}: ButtonProps): JSX.Element => {
  const [isImplerInitiated, setIsImplerInitiated] = useState(false);

  useEffect(() => {
    if (window.impler && projectId) {
      const initPayload: IInitPayload = { accessToken, template };
      window.impler.init(projectId, initPayload);
      setIsImplerInitiated(true);
      // eslint-disable-next-line no-console
    } else if (!window.impler) logger.logError('IMPLER_UNDEFINED_ERROR');
    else if (!projectId) logger.logError('PROJECTID_NOT_SPECIFIED');
  }, []);

  const onButtonClick = async () => {
    if (window.impler) {
      const payload: IShowPayload = {};
      if (extra) {
        if (typeof extra === 'object') payload.extra = JSON.stringify(extra);
        else payload.extra = extra;
      }
      if (authHeaderValue) {
        if (typeof authHeaderValue === 'function' && authHeaderValue.constructor.name === 'AsyncFunction') {
          payload.authHeaderValue = await authHeaderValue();
        } else if (typeof authHeaderValue === 'function') {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
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

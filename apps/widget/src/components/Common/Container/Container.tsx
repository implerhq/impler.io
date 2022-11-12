import { useEffect, useState, PropsWithChildren } from 'react';
import * as WebFont from 'webfontloader';
import { useParams } from 'react-router-dom';
import { Global } from '@emotion/react';
import { API_URL, colors } from '@config';
import { Provider } from '../Provider';
import { ParentWindow } from '@util';
import { useAuthentication } from '@hooks/useAuthentication';
import { ApiService } from '@impler/client';
import { EventTypesEnum, MessageHandlerDataType } from '@types';
import { IInitPayload, IShowPayload } from '@impler/shared';

let api: ApiService;

export function Container({ children }: PropsWithChildren<{}>) {
  if (!api) api = new ApiService(API_URL);
  const { projectId = '' } = useParams<{ projectId: string }>();
  const [showWidget, setShowWidget] = useState<boolean>(false);
  const [primaryPayload, setPrimaryPayload] = useState<IInitPayload>();
  const [secondaryPayload, setSecondaryPayload] = useState<IShowPayload>();
  const { isAuthenticated, refetch } = useAuthentication({ api, projectId, template: primaryPayload?.template });

  useEffect(() => {
    WebFont.load({
      google: {
        families: ['Lato'],
      },
    });
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV === 'test') {
      // eslint-disable-next-line
      (window as any).initHandler = messageEventHandler;
    }

    window.addEventListener('message', messageEventHandler);

    ParentWindow.Ready();

    return () => window.removeEventListener('message', messageEventHandler);
  }, []);

  function messageEventHandler({ data }: { data?: MessageHandlerDataType }) {
    if (data && data.type === EventTypesEnum.INIT_IFRAME) {
      setPrimaryPayload(data.value);
      if (data.value?.accessToken) {
        api.setAuthorizationToken(data.value.accessToken);
      }
      refetch();
    }
    if (data && data.type === EventTypesEnum.SHOW_WIDGET) {
      setShowWidget(true);
      setSecondaryPayload(data.value);
    }
  }

  if (!isAuthenticated || !showWidget) return null;

  return (
    <>
      <Global
        styles={{
          body: {
            backgroundColor: 'transparent',
          },
          '*': {
            boxSizing: 'border-box',
            margin: 0,
            padding: 0,
          },
          /* width */
          '::-webkit-scrollbar': {
            width: '7px',
            height: '7px',
          },

          /* Track */
          '::-webkit-scrollbar-track': {
            boxShadow: 'inset 0 0 3px grey',
            borderRadius: '10px',
          },

          /* Handle */
          '::-webkit-scrollbar-thumb': {
            background: colors.primary,
            borderRadius: '10px',
          },
        }}
      />
      {primaryPayload ? (
        <Provider
          // api
          api={api}
          // impler-context
          projectId={projectId}
          template={primaryPayload.template}
          accessToken={primaryPayload.accessToken}
          authHeaderValue={secondaryPayload?.authHeaderValue}
          extra={secondaryPayload?.extra}
        >
          {children}
        </Provider>
      ) : null}
    </>
  );
}

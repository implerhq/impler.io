import { useEffect, useState, PropsWithChildren } from 'react';
import * as WebFont from 'webfontloader';
import { useParams } from 'react-router-dom';
import { Global } from '@emotion/react';
import { useQueryClient } from '@tanstack/react-query';
import { Notifications } from '@mantine/notifications';
import { MantineProvider } from '@mantine/core';
import { logAmplitudeEvent } from '@amplitude';

import { Provider } from '../Provider';
import { ApiService } from '@impler/client';
import { MessageHandlerDataType } from '@types';
import { generateShades, ParentWindow } from '@util';
import { useAuthentication } from '@hooks/useAuthentication';
import { IInitPayload, IShowPayload, EventTypesEnum } from '@impler/shared';
import { API_URL, colors, mantineConfig, variables } from '@config';

let api: ApiService;

export function Container({ children }: PropsWithChildren<{}>) {
  if (!api) api = new ApiService(API_URL);
  const queryClient = useQueryClient();
  const { projectId = '' } = useParams<{ projectId: string }>();
  const [showWidget, setShowWidget] = useState<boolean>(false);
  const [primaryPayload, setPrimaryPayload] = useState<IInitPayload>();
  const [secondaryPayload, setSecondaryPayload] = useState<IShowPayload>({ primaryColor: colors.primary });
  const { isAuthenticated, refetch } = useAuthentication({ api, projectId });

  useEffect(() => {
    WebFont.load({
      google: {
        families: ['Poppins'],
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
      queryClient.resetQueries();
      queryClient.invalidateQueries();
      logAmplitudeEvent('OPEN', { hasExtra: data.value.extra !== undefined });
      setShowWidget(true);
      setSecondaryPayload({ ...data.value, primaryColor: data.value.primaryColor || colors.primary });
    }
  }

  if (!(isAuthenticated && showWidget)) return null;

  return (
    <>
      <Global
        styles={{
          body: {
            backgroundColor: 'transparent !important',
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
            background: secondaryPayload.primaryColor,
            borderRadius: '10px',
          },
          ...(secondaryPayload?.colorScheme && {
            ':root': {
              colorScheme: secondaryPayload.colorScheme,
            },
          }),
        }}
      />
      {primaryPayload ? (
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            ...mantineConfig,
            colors: {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              primary: generateShades(secondaryPayload.primaryColor),
            },
            primaryColor: 'primary',
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            primaryShade: variables.colorIndex,
          }}
        >
          <Provider
            schema={secondaryPayload?.schema}
            title={secondaryPayload?.title}
            // api
            api={api}
            // impler-context
            projectId={projectId}
            data={secondaryPayload.data}
            templateId={secondaryPayload.templateId}
            accessToken={primaryPayload.accessToken}
            authHeaderValue={secondaryPayload?.authHeaderValue}
            extra={secondaryPayload?.extra}
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            primaryColor={secondaryPayload.primaryColor!}
          >
            {children}
            <Notifications />
          </Provider>
        </MantineProvider>
      ) : null}
    </>
  );
}

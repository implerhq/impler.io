import * as WebFont from 'webfontloader';
import { Global } from '@emotion/react';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { useEffect, useState, PropsWithChildren } from 'react';

import { Provider } from '../Provider';
import { ApiService } from '@impler/client';
import { MessageHandlerDataType } from '@types';
import { generateShades, ParentWindow } from '@util';
import { IShowPayload, EventTypesEnum } from '@impler/shared';
import { API_URL, colors, mantineConfig, variables } from '@config';

let api: ApiService;

export function Container({ children }: PropsWithChildren<{}>) {
  if (!api) api = new ApiService(API_URL);
  const [secondaryPayload, setSecondaryPayload] = useState<IShowPayload>({
    uuid: '',
    host: '',
    projectId: '',
    accessToken: '',
    primaryColor: colors.primary,
  });
  const [showWidget, setShowWidget] = useState<boolean>(false);

  useEffect(() => {
    WebFont.load({
      google: {
        families: ['Poppins'],
      },
    });
  }, []);

  useEffect(() => {
    window.addEventListener('message', messageEventHandler);

    ParentWindow.Ready();

    return () => window.removeEventListener('message', messageEventHandler);
  }, []);

  function messageEventHandler({ data }: { data?: MessageHandlerDataType }) {
    if (data && data.type === EventTypesEnum.SHOW_WIDGET) {
      if (data.value.accessToken) {
        api.setAuthorizationToken(data.value.accessToken);
      }
      setShowWidget(true);
      setSecondaryPayload({ ...data.value, primaryColor: data.value.primaryColor || colors.primary });
    }
  }

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
        <Notifications />
        <Provider
          showWidget={showWidget}
          host={secondaryPayload.host}
          setShowWidget={setShowWidget}
          output={secondaryPayload?.output}
          schema={secondaryPayload?.schema}
          title={secondaryPayload?.title}
          // api
          api={api}
          // impler-context
          data={secondaryPayload.data}
          extra={secondaryPayload?.extra}
          projectId={secondaryPayload.projectId}
          templateId={secondaryPayload.templateId}
          authHeaderValue={secondaryPayload?.authHeaderValue}
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          primaryColor={secondaryPayload.primaryColor!}
        >
          {children}
        </Provider>
      </MantineProvider>
    </>
  );
}

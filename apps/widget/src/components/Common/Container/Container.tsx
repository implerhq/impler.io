import * as WebFont from 'webfontloader';
import { Global } from '@emotion/react';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { useEffect, useState, PropsWithChildren } from 'react';

import { Provider } from '../Provider';
import { ApiService } from '@impler/client';
import { MessageHandlerDataType } from '@types';
import { generateShades, ParentWindow, deepMerge } from '@util';
import { API_URL, colors, mantineConfig, variables } from '@config';
import { IWidgetShowPayload, WidgetEventTypesEnum, WIDGET_TEXTS } from '@impler/shared';

let api: ApiService;

export function Container({ children }: PropsWithChildren<{}>) {
  if (!api) api = new ApiService(API_URL);
  const [secondaryPayload, setSecondaryPayload] = useState<IWidgetShowPayload>({
    uuid: '',
    host: '',
    texts: WIDGET_TEXTS,
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
    if (data && data.type === WidgetEventTypesEnum.SHOW_WIDGET) {
      if (data.value.accessToken) {
        api.setAuthorizationToken(data.value.accessToken);
      }
      setShowWidget(true);
      setSecondaryPayload({
        ...data.value,
        primaryColor: data.value.primaryColor || colors.primary,
        texts: deepMerge(WIDGET_TEXTS, data.value.texts),
      });
    } else if (data && data.type === WidgetEventTypesEnum.CLOSE_WIDGET) {
      setShowWidget(false);
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
          '.tippy-box[data-theme~="custom"]': {
            color: 'black',
            backgroundColor: 'white',
            border: `2px solid ${secondaryPayload.primaryColor}`,
            boxShadow: '0 0 10px rgba(0,0,0,0.2)',
            borderRadius: 5,
          },
          '.tippy-box[data-theme~="custom"][data-placement^="top"] > .tippy-arrow::before': {
            borderTopColor: secondaryPayload.primaryColor,
          },
          '.tippy-box[data-theme~="custom"][data-placement^="bottom"] > .tippy-arrow::before': {
            borderBottomColor: secondaryPayload.primaryColor,
          },
          '.tippy-box[data-theme~="custom"][data-placement^="left"] > .tippy-arrow::before': {
            borderLeftColor: secondaryPayload.primaryColor,
          },
          '.tippy-box[data-theme~="custom"][data-placement^="right"] > .tippy-arrow::before': {
            borderRightColor: secondaryPayload.primaryColor,
          },
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
          texts={secondaryPayload.texts as typeof WIDGET_TEXTS}
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

import * as WebFont from 'webfontloader';
import { Global } from '@emotion/react';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { useEffect, useState, PropsWithChildren, useMemo } from 'react';

import { ApiService } from '@api';
import { Provider } from '../Provider';
import { MessageHandlerDataType } from '@types';
import { WIDGET_TEXTS, isObject } from '@impler/client';
import { generateShades, ParentWindow, deepMerge } from '@util';
import { API_URL, colors, mantineConfig, variables } from '@config';
import { IWidgetShowPayload, WidgetEventTypesEnum } from '@impler/shared';

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
        accessToken: data.value.accessToken,
        host: data.value.host,
        projectId: data.value.projectId,
        uuid: data.value.uuid,
        extra: isObject(data.value.extra) ? JSON.stringify(data.value.extra) : data.value.extra,
        templateId: data.value.templateId,
        authHeaderValue: data.value.authHeaderValue,
        primaryColor: data.value.primaryColor || colors.primary,
        colorScheme: data.value.colorScheme,
        title: data.value.title,
        texts: deepMerge(WIDGET_TEXTS, data.value.texts),
        schema:
          typeof data.value.schema === 'string'
            ? data.value.schema
            : Array.isArray(data.value.schema)
            ? JSON.stringify(data.value.schema)
            : undefined,
        data:
          typeof data.value.data === 'string'
            ? data.value.data
            : Array.isArray(data.value.data)
            ? JSON.stringify(data.value.data)
            : undefined,
        output:
          typeof data.value.output === 'string'
            ? data.value.output
            : isObject(data.value.output)
            ? JSON.stringify(data.value.output)
            : undefined,
      });
    } else if (data && data.type === WidgetEventTypesEnum.CLOSE_WIDGET) {
      setShowWidget(false);
    }
  }

  const primaryColorShades = useMemo(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    () => generateShades(secondaryPayload.primaryColor),
    [secondaryPayload.primaryColor]
  );

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
          globalStyles: () => ({
            ':root': {
              // common
              '--border-radius': '0.25rem',
              '--label-color': '#868e96',
              '--error-color': '#f03e3e',
              '--border-color': colors.lightDeem,
              '--primary-color': secondaryPayload.primaryColor,

              '--primary-background': '#FFF',
              '--secondary-background': colors.lightDeem,
              '--primary-background-hover': '#FAFAFA',
              '--secondary-background-hover': '#F4F4F4',

              // counts
              '--counts-background': '#f1f3f5',
              '--counts-border-radius': '2rem',
              '--counts-active-background': '#ffffff',

              // stepper
              '--stepper-background': '#f1f3f5',
              '--stepper-completed-background': colors.success,
              '--stepper-progress-background': '#f1f3f5',
              '--stepper-icon-color': '#495057',
              '--stepper-icon-progress-color': '#495057',
              '--stepper-icon-completed-color': colors.white,
              '--stepper-border-color': '#f1f3f5',
              '--stepper-completed-border-color': colors.success,
              '--stepper-progress-border-color': secondaryPayload.primaryColor,
              '--stepper-border-radius': '0px',
              '--stepper-color': '#666',

              /*
               * button
               *
               * '--button-primary-color': '#fff',
               * '--button-primary-background': secondaryPayload.primaryColor,
               * '--button-primary-background-hover': primaryColorShades?.[6],
               * '--button-secondary-color': secondaryPayload.primaryColor,
               * '--button-secondary-background': '#fff',
               * '--button-secondary-background-hover': '#a8c6ff59',
               */
            },
          }),
          components: {
            Dropzone: {
              styles: {
                root: {
                  borderRadius: 'var(--border-radius)',
                  backgroundColor: `var(--secondary-background)`,
                  '&:hover': {
                    backgroundColor: `var(--secondary-background-hover)`,
                  },
                },
              },
            },
            InputWrapper: {
              styles: {
                label: {
                  color: 'var(--label-color)',
                },
              },
            },
            Input: {
              styles: {
                input: {
                  borderColor: 'var(--border-color)',
                  borderRadius: 'var(--border-radius)',
                },
              },
            },
            Checkbox: {
              styles: {
                input: {
                  borderColor: 'var(--border-color)',
                  borderRadius: 'var(--border-radius)',
                },
              },
            },
            Stepper: {
              styles: {
                stepLabel: {
                  color: 'var(--stepper-color)',
                  fontWeight: 600,
                },
                stepIcon: {
                  borderColor: 'var(--stepper-border-color)',
                  backgroundColor: 'var(--stepper-background)',
                  '&[data-completed]': {
                    color: 'var(--stepper-icon-completed-color) !important',
                    backgroundColor: 'var(--stepper-completed-background) !important',
                    borderColor: 'var(--stepper-completed-border-color) !important',
                  },
                  '&[data-progress]': {
                    backgroundColor: 'var(--stepper-progress-background) !important',
                    borderColor: 'var(--stepper-progress-border-color) !important',
                    color: 'var(--stepper-icon-progress-color) !important',
                  },
                },
                stepCompletedIcon: {
                  svg: {
                    fill: 'var(--stepper-icon-completed-color) !important',
                  },
                },
              },
            },
            /*
             * Button: {
             *   styles: {
             *     root: {
             *       borderRadius: 'var(--border-radius)',
             *       backgroundColor: 'var(--button-primary-background)',
             *       '&:hover': {
             *         backgroundColor: 'var(--button-primary-background-hover)',
             *       },
             *       '&[data-color=red]': {
             *         backgroundColor: 'var(--button-secondary-background)',
             *         borderColor: 'var(--error-color)',
             *         '.mantine-Button-label': {
             *           color: 'var(--error-color)',
             *         },
             *         '&:hover': {
             *           backgroundColor: 'var(--button-secondary-background-hover)',
             *         },
             *       },
             *       '&[data-variant=outline]': {
             *         backgroundColor: 'var(--button-secondary-background)',
             *         '.mantine-Button-label': {
             *           color: 'var(--button-secondary-color)',
             *         },
             *         '&:hover': {
             *           backgroundColor: 'var(--button-secondary-background-hover)',
             *         },
             *       },
             *       '&:focus': {
             *         outline: '0.125rem solid var(--button-primary-background)',
             *       },
             *     },
             *     label: {
             *       color: 'var(--button-primary-color)',
             *     },
             *     icon: {
             *       svg: {
             *         fill: 'var(--button-primary-color)',
             *       },
             *     },
             *   },
             * },
             */
          },
          colors: {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            primary: primaryColorShades,
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

import * as WebFont from 'webfontloader';
import { Global } from '@emotion/react';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { generateColors } from '@mantine/colors-generator';
import { useEffect, useState, PropsWithChildren, useMemo } from 'react';

import { ApiService } from '@api';
import { Provider } from '../Provider';
import { MessageHandlerDataType } from '@types';
import { ParentWindow, deepMerge } from '@util';
import { WIDGET_TEXTS, isObject } from '@impler/client';
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
        families: [secondaryPayload.appearance?.fontFamily ?? 'Poppins'],
      },
    });
  }, [secondaryPayload.appearance?.fontFamily]);

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
        sampleFile: data.value.sampleFile,
        projectId: data.value.projectId,
        uuid: data.value.uuid,
        extra: isObject(data.value.extra) ? JSON.stringify(data.value.extra) : data.value.extra,
        templateId: data.value.templateId,
        authHeaderValue: data.value.authHeaderValue,
        primaryColor: data.value.primaryColor || colors.primary,
        colorScheme: data.value.colorScheme,
        title: data.value.title,
        texts: deepMerge(WIDGET_TEXTS, data.value.texts),
        config: data.value.config,
        appearance: data.value.appearance,
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

  const primaryColor = secondaryPayload.appearance?.primaryColor ?? secondaryPayload.primaryColor ?? colors.primary;

  const primaryButtonConfig = secondaryPayload.appearance?.primaryButtonConfig;
  const secondaryButtonConfig = secondaryPayload.appearance?.secondaryButtonConfig;

  const primaryColorShades = useMemo(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    () => generateColors(primaryColor),
    [primaryColor]
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
            background: primaryColor,
            borderRadius: '10px',
          },

          ':root': {
            ...(secondaryPayload?.colorScheme
              ? {
                  colorScheme: secondaryPayload.colorScheme,
                }
              : {}),

            //common
            '--border-radius': secondaryPayload.appearance?.borderRadius || '0.25rem',
            '--label-color': '#868e96',
            '--error-color': '#f03e3e',
            '--border-color': colors.lightDeem,
            '--background-color': secondaryPayload.appearance?.widget?.backgroundColor ?? colors.white,

            // stepper
            '--stepper-background': '#f1f3f5',
            '--stepper-completed-background': colors.success,
            '--stepper-progress-background': '#f1f3f5',
            '--stepper-icon-color': '#495057',
            '--stepper-icon-progress-color': '#495057',
            '--stepper-icon-completed-color': colors.white,
            '--stepper-border-color': '#f1f3f5',
            '--stepper-completed-border-color': colors.success,
            '--stepper-progress-border-color': primaryColor,
            '--stepper-border-radius': '0px',
            '--stepper-color': '#666',

            // button

            //Primary Button Variables
            '--button-primary-color': primaryButtonConfig?.textColor ?? colors.white,
            '--button-primary-background': primaryButtonConfig?.backgroundColor ?? primaryColor,
            '--button-primary-background-hover': primaryButtonConfig?.hoverBackground ?? primaryColorShades?.[7],
            '--button-primary-border-color': primaryButtonConfig?.borderColor ?? 'transparent',
            '--button-primary-border-hover': primaryButtonConfig?.hoverBorderColor ?? 'transparent',
            '--button-primary-shadow': primaryButtonConfig?.buttonShadow ?? 'none',

            // Secondary Button Variables
            '--button-secondary-color': secondaryButtonConfig?.textColor ?? primaryColor,
            '--button-secondary-background': secondaryButtonConfig?.backgroundColor ?? colors.white,
            '--button-secondary-background-hover': secondaryButtonConfig?.hoverBackground ?? primaryColorShades?.[0],
            '--button-secondary-border-color': secondaryButtonConfig?.borderColor ?? primaryColor,
            '--button-secondary-border-hover': secondaryButtonConfig?.hoverBorderColor ?? primaryColor,
            '--button-secondary-shadow': secondaryButtonConfig?.buttonShadow ?? 'none',

            // counts
            '--counts-background': '#f1f3f5',
            '--counts-border-radius': '2rem',
            '--counts-active-background': '#ffffff',
          },
          '.tippy-box[data-theme~="custom"]': {
            color: 'black',
            backgroundColor: 'white',
            border: `2px solid ${primaryColor}`,
            boxShadow: '0 0 10px rgba(0,0,0,0.2)',
            borderRadius: 5,
          },
          '.tippy-box[data-theme~="custom"][data-placement^="top"] > .tippy-arrow::before': {
            borderTopColor: primaryColor,
          },
          '.tippy-box[data-theme~="custom"][data-placement^="bottom"] > .tippy-arrow::before': {
            borderBottomColor: primaryColor,
          },
          '.tippy-box[data-theme~="custom"][data-placement^="left"] > .tippy-arrow::before': {
            borderLeftColor: primaryColor,
          },
          '.tippy-box[data-theme~="custom"][data-placement^="right"] > .tippy-arrow::before': {
            borderRightColor: primaryColor,
          },
        }}
      />
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          ...mantineConfig,
          fontFamily: `${secondaryPayload.appearance?.fontFamily || 'Poppins'}, sans-serif`,
          globalStyles: () => ({
            '*': {
              color: secondaryPayload.colorScheme, // textColor
            },
          }),
          components: {
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

            Modal: {
              styles: {
                content: {
                  backgroundColor: 'var(--background-color)',
                },
              },
            },
            Button: {
              styles: {
                root: {
                  borderRadius: 'var(--border-radius)',

                  /*
                   *'&[data-variant=filled]': {
                   *backgroundColor: 'var(--button-primary-background)',
                   *borderColor: 'var(--button-primary-border-color)',
                   *border: '1px solid var(--button-primary-border-color)',
                   *'.mantine-Button-label': {
                   *  color: 'var(--button-primary-color)',
                   *},
                   *'&:hover': {
                   *  backgroundColor: 'var(--button-primary-background-hover)',
                   *  borderColor: 'var(--button-primary-border-hover)',
                   *  border: '1px solid var(--button-primary-border-hover)',
                   *  boxShadow: 'var(--button-primary-shadow)',
                   *},
                   *},
                   */

                  '&:not([data-variant])': {
                    backgroundColor: 'var(--button-primary-background)',
                    borderColor: 'var(--button-primary-border-color)',
                    color: 'var(--button-primary-color)',
                    border: '1px solid var(--button-primary-border-color)',

                    '&:hover': {
                      backgroundColor: 'var(--button-primary-background-hover)',
                      borderColor: 'var(--button-primary-border-hover)',
                      boxShadow: 'var(--button-primary-shadow)',
                    },
                  },

                  '&[data-variant=outline]': {
                    backgroundColor: 'var(--button-secondary-background)',
                    borderColor: 'var(--button-secondary-border-color)',
                    border: '1px solid var(--button-secondary-border-color)',
                    '.mantine-Button-label': {
                      color: 'var(--button-secondary-color)',
                    },
                    boxShadow: 'var(--button-secondary-shadow)',
                    '&:hover': {
                      backgroundColor: 'var(--button-secondary-background-hover)',
                      borderColor: 'var(--button-secondary-border-hover)',
                      border: '1px solid var(--button-secondary-border-hover)',
                      boxShadow: 'var(--button-secondary-shadow)',
                    },
                  },

                  '&[data-color="red"]': {
                    backgroundColor: colors.lightRed,
                    borderColor: 'var(--error-color)',
                    '&:hover': {
                      backgroundColor: colors.red,
                    },
                    '&[data-disabled]': {
                      backgroundColor: `${colors.gray} !important`,
                      borderColor: `${colors.white} !important`,
                      cursor: 'not-allowed',
                      '.mantine-Button-label': {
                        color: `${colors.softGrey} !important`,
                      },
                    },
                    '.mantine-Button-label': {
                      color: colors.white,
                    },
                  },

                  '&:focus': {
                    outline: '0.125rem solid var(--button-primary-background)',
                  },
                },

                label: {
                  color: 'var(--button-primary-color)',
                },

                icon: {
                  svg: {
                    fill: 'var(--button-primary-color)',
                  },
                },
              },
            },

            Dropzone: {
              styles: {
                root: {
                  '&[data-has-error]': {
                    borderColor: 'var(--error-color)',
                    color: 'var(--error-color)',
                    text: {
                      color: 'var(--error-color)',
                    },
                  },
                  '&:hover': {
                    backgroundColor: 'lightgrey',
                  },
                  button: {
                    '&[data-variant=filled]': {
                      backgroundColor: 'var(--button-primary-background)',
                      '.mantine-Button-label': {
                        color: 'var(--button-primary-color)',
                      },
                      '&:hover': {
                        backgroundColor: 'var(--button-primary-background-hover)',
                      },
                    },
                  },
                },
              },
            },
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
          config={secondaryPayload.config}
          appearance={secondaryPayload.appearance}
          // api
          api={api}
          // impler-context
          data={secondaryPayload.data}
          extra={secondaryPayload?.extra}
          projectId={secondaryPayload.projectId}
          templateId={secondaryPayload.templateId}
          authHeaderValue={secondaryPayload?.authHeaderValue}
          sampleFile={secondaryPayload?.sampleFile}
          primaryColor={secondaryPayload.primaryColor ?? secondaryPayload.appearance?.primaryColor ?? primaryColor}
        >
          {children}
        </Provider>
      </MantineProvider>
    </>
  );
}

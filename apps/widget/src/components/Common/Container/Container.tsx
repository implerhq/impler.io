import * as WebFont from 'webfontloader';
import { Global } from '@emotion/react';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { generateColors } from '@mantine/colors-generator';
import { useEffect, useState, PropsWithChildren, useMemo } from 'react';

import { ApiService } from '@api';
import { Provider } from '../Provider';
import { MessageHandlerDataType } from '@types';
import { ParentWindow, deepMerge, getContrastingTextColor, getSecondaryTextColor, isColorDark } from '@util';
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
        maxRecords: data.value.maxRecords,
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
  const backgroundColor = secondaryPayload.appearance?.widget?.backgroundColor ?? colors.white;

  // Dynamic text colors based on background
  const textColor = getContrastingTextColor(backgroundColor);
  const secondaryTextColor = getSecondaryTextColor(backgroundColor);

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
            '--label-color': secondaryTextColor,
            '--error-color': '#f03e3e',
            '--border-color': isColorDark(backgroundColor) ? '#444' : colors.lightDeem,
            '--background-color': backgroundColor,
            '--text-color': textColor,
            '--secondary-text-color': secondaryTextColor,

            // Table-specific hover colors (much more subtle)
            '--table-hover-background': primaryColorShades[2],

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
            '--button-secondary-background':
              secondaryButtonConfig?.backgroundColor ?? (isColorDark(backgroundColor) ? '#4a4a4a' : colors.white),
            '--button-secondary-background-hover':
              secondaryButtonConfig?.hoverBackground ??
              (isColorDark(backgroundColor) ? '#5a5a5a' : primaryColorShades?.[0]),
            '--button-secondary-border-color': secondaryButtonConfig?.borderColor ?? primaryColor,
            '--button-secondary-border-hover': secondaryButtonConfig?.hoverBorderColor ?? primaryColor,
            '--button-secondary-shadow': secondaryButtonConfig?.buttonShadow ?? 'none',

            // counts
            '--counts-background': isColorDark(backgroundColor) ? '#3a3a3a' : '#f1f3f5',
            '--counts-border-radius': '2rem',
            '--counts-active-background': backgroundColor,
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
              color: textColor, // Use the calculated text color
            },
            body: {
              backgroundColor: backgroundColor,
              color: textColor,
            },
            // Additional global styles for better text contrast
            'h1, h2, h3, h4, h5, h6': {
              color: textColor,
            },
            'p, span, div': {
              color: textColor,
            },
            label: {
              color: secondaryTextColor,
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

            DirectEntryView: {
              styles: () => ({
                root: {
                  backgroundColor: isColorDark(backgroundColor) ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                  border: `2px dashed ${isColorDark(backgroundColor) ? '#555' : '#d1d5db'}`,
                  borderRadius: '8px',
                  padding: '24px',
                  transition: 'all 0.2s ease',
                  color: isColorDark(backgroundColor) ? '#a0a0a0' : '#6b7280',
                  minHeight: '200px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',

                  '&:hover': {
                    backgroundColor: isColorDark(backgroundColor) ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
                    borderColor: primaryColor,
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  },

                  // Style any text elements inside
                  '& .mantine-Text-root': {
                    color: 'inherit',
                  },

                  // Style icons if present
                  '& svg': {
                    color: 'inherit',
                    opacity: 0.7,
                  },

                  // Style any buttons inside the DirectEntryView
                  '& button': {
                    '&[data-variant=filled]': {
                      backgroundColor: 'var(--button-primary-background)',
                      color: 'var(--button-primary-color)',
                      border: 'none',

                      '&:hover': {
                        backgroundColor: 'var(--button-primary-background-hover)',
                      },
                    },
                    '&[data-variant=outline]': {
                      backgroundColor: 'var(--button-secondary-background)',
                      borderColor: 'var(--button-secondary-border-color)',
                      color: 'var(--button-secondary-color)',

                      '&:hover': {
                        backgroundColor: 'var(--button-secondary-background-hover)',
                      },
                    },
                  },
                },
              }),
            },
            // Replace your existing Dropzone styles with this:
            Dropzone: {
              styles: () => ({
                root: {
                  // Use a more visible background with better contrast
                  backgroundColor: isColorDark(backgroundColor)
                    ? 'rgba(255, 255, 255, 0.05)' // Very light white overlay for dark themes
                    : 'rgba(0, 0, 0, 0.02)', // Very light dark overlay for light themes

                  border: `2px dashed ${isColorDark(backgroundColor) ? '#555' : '#d1d5db'}`,
                  borderRadius: '8px',
                  padding: '24px',
                  transition: 'all 0.2s ease',

                  // Text color with better contrast
                  color: isColorDark(backgroundColor) ? '#a0a0a0' : '#6b7280',

                  // Ensure minimum contrast
                  minHeight: '200px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',

                  '&[data-has-error]': {
                    borderColor: 'var(--error-color)',
                    backgroundColor: isColorDark(backgroundColor)
                      ? 'rgba(240, 62, 62, 0.1)'
                      : 'rgba(240, 62, 62, 0.05)',
                    color: 'var(--error-color)',
                  },

                  '&:hover': {
                    backgroundColor: isColorDark(backgroundColor)
                      ? 'rgba(255, 255, 255, 0.08)' // Slightly more visible on hover
                      : 'rgba(0, 0, 0, 0.04)',
                    borderColor: primaryColor,
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  },

                  // Style the button inside dropzone
                  '& button': {
                    '&[data-variant=filled]': {
                      backgroundColor: 'var(--button-primary-background)',
                      color: 'var(--button-primary-color)',
                      border: 'none',

                      '&:hover': {
                        backgroundColor: 'var(--button-primary-background-hover)',
                      },
                    },
                  },

                  // Style text elements inside dropzone
                  '& .mantine-Text-root': {
                    color: 'inherit',
                  },

                  // Style icon if present
                  '& svg': {
                    color: 'inherit',
                    opacity: 0.7,
                  },
                },
              }),
            },

            // Add these new component styles for the manual entry section:
            Card: {
              styles: {
                root: {
                  backgroundColor: 'var(--background-color)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-color)',
                },
              },
            },
            Table: {
              styles: (theme) => ({
                root: {
                  borderRadius: theme.radius.md,
                  overflow: 'hidden',
                  fontSize: theme.fontSizes.sm,
                  backgroundColor: 'transparent',
                  color: 'var(--text-color)',
                },

                thead: {
                  backgroundColor: 'var(--stepper-background)',
                },

                'thead th': {
                  backgroundColor: 'var(--stepper-background)',
                  color: 'var(--text-color)',
                  fontWeight: 600,
                  borderBottom: `1px solid var(--border-color)`,
                  padding: '12px',
                  textAlign: 'left',
                },

                'tbody td': {
                  color: 'var(--text-color)',
                  padding: '12px',
                  borderBottom: `1px solid var(--border-color)`,
                  backgroundColor: 'var(--background-color)',
                },

                'tbody tr': {
                  transition: 'background-color 0.2s ease',

                  '&:nth-of-type(even)': {
                    backgroundColor: 'var(--stepper-background)',
                  },

                  // Updated hover with much more subtle color
                  '&:hover': {
                    backgroundColor: 'var(--table-hover-background)',
                    // Ensure text remains visible
                    color: 'var(--text-color)',

                    '& td': {
                      color: 'var(--text-color)',
                    },
                  },
                },

                /*
                 * Optional: selected row style
                 * 'tbody tr[data-selected="true"]': {
                 *   backgroundColor: 'var(--button-primary-background)',
                 *   color: 'var(--button-primary-color)',
                 *   '&:hover': {
                 *     backgroundColor: 'var(--button-primary-background-hover)',
                 *   },
                 * },
                 */
              }),
            },
            Input: {
              styles: {
                input: {
                  borderColor: 'var(--border-color)',
                  backgroundColor: 'var(--background-color)',
                  color: 'var(--text-color)',
                  '&:focus': {
                    borderColor: 'var(--button-primary-background)',
                  },
                  '&::placeholder': {
                    color: 'var(--secondary-text-color)',
                  },
                },
              },
            },

            Alert: {
              styles: {
                root: {
                  backgroundColor: primaryColorShades[0],
                  borderColor: primaryColorShades[2],
                  color: primaryColorShades[7],
                },
              },
            },
            ProgressRing: {
              styles: {
                root: {
                  '--rp-section-color': 'var(--mantine-color-primary-filled)',
                },
              },
            },
            SegmentedControl: {
              styles: (theme) => ({
                root: {
                  backgroundColor: theme.fn.rgba(theme.colors[theme.primaryColor][5], 0.06),
                  borderRadius: 'var(--border-radius)',
                  padding: '4px',
                  border: `1px solid var(--border-color)`,
                },

                control: {
                  borderRadius: 'calc(var(--border-radius) - 2px)',
                  border: 'none !important',
                  transition: 'all 0.2s ease',
                  color: 'var(--text-color) !important',

                  '&:not([data-active])': {
                    backgroundColor: 'transparent',
                    color: 'var(--text-color) !important',

                    '&:hover': {
                      backgroundColor: isColorDark(backgroundColor)
                        ? 'rgba(255, 255, 255, 0.05)'
                        : 'rgba(0, 0, 0, 0.03)',
                    },
                  },

                  '&[data-active]': {
                    backgroundColor: 'var(--button-primary-background) !important',
                    color: 'var(--button-primary-color) !important',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',

                    '&:hover': {
                      backgroundColor: 'var(--button-primary-background-hover) !important',
                    },
                  },
                },

                controlActive: {
                  backgroundColor: 'var(--button-primary-background) !important',
                  color: 'var(--button-primary-color) !important',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                },

                label: {
                  fontWeight: 500,
                  fontSize: theme.fontSizes.sm,
                  padding: '8px 16px',
                  transition: 'color 0.2s ease',
                  color: 'var(--text-color) !important',
                },

                labelActive: {
                  color: 'var(--button-primary-color) !important',
                  fontWeight: 600,
                },
              }),
            },

            FindReplaceModal: {
              styles: (theme) => ({
                root: {
                  borderRadius: theme.radius.md,
                  overflow: 'hidden',
                  fontSize: theme.fontSizes.sm,
                  backgroundColor: 'var(--background-color)',
                  color: 'var(--text-color)',
                },
                header: {
                  backgroundColor: 'var(--background-color)',
                  color: 'var(--text-color)',
                  borderBottom: `1px solid var(--border-color)`,
                },
                title: {
                  color: 'var(--text-color)',
                  fontWeight: 600,
                },
                body: {
                  backgroundColor: 'var(--background-color)',
                  color: 'var(--text-color)',
                },
                close: {
                  color: 'var(--text-color)',
                  '&:hover': {
                    backgroundColor: 'var(--stepper-background)',
                  },
                },
              }),
            },

            // Also update your Modal component styles to ensure proper theming:
            Modal: {
              styles: {
                content: {
                  backgroundColor: 'var(--background-color)',
                  color: 'var(--text-color)',
                },
                header: {
                  backgroundColor: 'var(--background-color)',
                  color: 'var(--text-color)',
                  borderBottom: `1px solid var(--border-color)`,
                },
                title: {
                  color: 'var(--text-color)',
                  fontWeight: 600,
                },
                body: {
                  backgroundColor: 'var(--background-color)',
                  color: 'var(--text-color)',
                },
                close: {
                  color: 'var(--text-color)',
                  '&:hover': {
                    backgroundColor: 'var(--stepper-background)',
                  },
                },
              },
            },

            // Add/update TextInput and Select components to use your CSS variables:
            TextInput: {
              styles: {
                input: {
                  borderColor: 'var(--border-color)',
                  backgroundColor: 'var(--background-color)',
                  color: 'var(--text-color)',
                  '&:focus': {
                    borderColor: 'var(--button-primary-background)',
                  },
                  '&::placeholder': {
                    color: 'var(--secondary-text-color)',
                  },
                },
                label: {
                  color: 'var(--label-color)',
                  fontWeight: 500,
                },
              },
            },

            Select: {
              styles: {
                input: {
                  borderColor: 'var(--border-color)',
                  backgroundColor: 'var(--background-color)',
                  color: 'var(--text-color)',
                  '&:focus': {
                    borderColor: 'var(--button-primary-background)',
                  },
                },
                label: {
                  color: 'var(--label-color)',
                  fontWeight: 500,
                },
                item: {
                  backgroundColor: 'var(--background-color)',
                  color: 'var(--text-color)',
                  '&:hover': {
                    backgroundColor: 'var(--stepper-background)',
                  },
                  '&[data-selected]': {
                    backgroundColor: 'var(--button-primary-background)',
                    color: 'var(--button-primary-color)',
                  },
                },
                dropdown: {
                  backgroundColor: 'var(--background-color)',
                  borderColor: 'var(--border-color)',
                },
              },
            },

            // Add Checkbox component styling:
            Checkbox: {
              styles: {
                input: {
                  borderColor: 'var(--border-color)',
                  backgroundColor: 'var(--background-color)',
                  '&:checked': {
                    backgroundColor: 'var(--button-primary-background)',
                    borderColor: 'var(--button-primary-background)',
                  },
                },
                label: {
                  color: 'var(--text-color)',
                  fontWeight: 500,
                },
              },
            },

            // Just add this to your Container.tsx components section
            Pagination: {
              styles: () => ({
                item: {
                  backgroundColor: 'var(--background-color)',
                  color: 'var(--text-color)',
                  border: '1px solid var(--border-color)',

                  '&[data-active="true"]': {
                    backgroundColor: 'var(--button-primary-background)',
                    color: 'var(--button-primary-color)',
                    border: '1px solid var(--button-primary-background)',
                  },

                  '&:hover:not([data-active="true"])': {
                    backgroundColor: 'var(--stepper-background)',
                  },
                },

                control: {
                  backgroundColor: 'var(--background-color)',
                  color: 'var(--text-color)',
                  border: '1px solid var(--border-color)',

                  '&:hover:not(:disabled)': {
                    backgroundColor: 'var(--button-primary-background)',
                    color: 'var(--button-primary-color)',
                    border: '1px solid var(--button-primary-background)',
                  },

                  '&:disabled': {
                    backgroundColor: 'var(--stepper-background)',
                    color: 'var(--secondary-text-color)',
                    opacity: 0.5,
                    cursor: 'not-allowed',
                  },
                },
              }),
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
          maxRecords={secondaryPayload.maxRecords}
          primaryColor={secondaryPayload.primaryColor ?? secondaryPayload.appearance?.primaryColor ?? primaryColor}
        >
          {children}
        </Provider>
      </MantineProvider>
    </>
  );
}

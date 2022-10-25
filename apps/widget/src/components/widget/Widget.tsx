import { useEffect, useState } from 'react';
import * as WebFont from 'webfontloader';
import { API_URL } from '../../config';
import { createGlobalStyle } from 'styled-components';
import { WidgetProvider } from './WidgetProvider';
import { IUserDataPayload } from '@impler/shared';

interface IWidgetProps {
  projectId: string;
}

export function Widget(props: IWidgetProps) {
  const [userDataPayload, setUserDataPayload] = useState<IUserDataPayload>();
  const [backendUrl, setBackendUrl] = useState(API_URL);
  // const [theme, setTheme] = useState<>({});
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const [fontFamily, setFontFamily] = useState<string>('Lato');
  const [frameInitialized, setFrameInitialized] = useState(false);

  useEffect(() => {
    WebFont.load({
      google: {
        families: [fontFamily],
      },
    });
  }, [fontFamily]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handler = ({ data }: any) => {
      if (data && data.type === 'INIT_IFRAME') {
        setUserDataPayload(data.value);

        if (data.value.backendUrl) {
          setBackendUrl(data.value.backendUrl);
        }

        setFrameInitialized(true);
      }
    };

    if (process.env.NODE_ENV === 'test') {
      // eslint-disable-next-line
      (window as any).initHandler = handler;
    }

    window.addEventListener('message', handler);

    window.parent.postMessage({ type: 'WIDGET_READY' }, '*');

    return () => window.removeEventListener('message', handler);
  }, []);

  if (!userDataPayload) return null;

  return (
    <>
      <GlobalStyle fontFamily={fontFamily} />
      {frameInitialized ? (
        <WidgetProvider
          // api
          backendUrl={backendUrl}
          // impler-context
          projectId={props.projectId}
          template={userDataPayload.template}
          accessToken={userDataPayload.accessToken}
          authHeaderValue={userDataPayload.authHeaderValue}
          extra={userDataPayload.extra}
        >
          <h1>Widget</h1>
        </WidgetProvider>
      ) : null}
    </>
  );
}

const GlobalStyle = createGlobalStyle<{ fontFamily: string }>`
  body {
    font-family: ${({ fontFamily }) => fontFamily}, Helvetica, sans-serif;
  }
`;

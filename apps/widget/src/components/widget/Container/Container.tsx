import { useEffect, useState, PropsWithChildren } from 'react';
import * as WebFont from 'webfontloader';
import { useParams } from 'react-router-dom';
import { IUserDataPayload } from '@impler/shared';
import { Global } from '@emotion/react';
import { API_URL, colors } from '@config';
import { Provider } from '../Provider';
import { ParentWindow } from '@util';

export function Container({ children }: PropsWithChildren) {
  const { projectId = '' } = useParams<{ projectId: string }>();
  const [userDataPayload, setUserDataPayload] = useState<IUserDataPayload>();
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
        setFrameInitialized(true);
      }
      if (data && data.type === 'SHOW_WIDGET') {
        setUserDataPayload(data.value);
      }
    };

    if (process.env.NODE_ENV === 'test') {
      // eslint-disable-next-line
      (window as any).initHandler = handler;
    }

    window.addEventListener('message', handler);

    ParentWindow.Ready();

    return () => window.removeEventListener('message', handler);
  }, []);

  if (!userDataPayload) return null;

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
      {frameInitialized ? (
        <Provider
          // api
          backendUrl={API_URL}
          // impler-context
          projectId={projectId}
          template={userDataPayload.template}
          accessToken={userDataPayload.accessToken}
          authHeaderValue={userDataPayload.authHeaderValue}
          extra={userDataPayload.extra}
        >
          {children}
        </Provider>
      ) : null}
    </>
  );
}

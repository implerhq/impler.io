import { useEffect, useState, PropsWithChildren } from 'react';
import * as WebFont from 'webfontloader';
import { useParams } from 'react-router-dom';
import { Global } from '@emotion/react';
import { API_URL, colors } from '@config';
import { Provider } from '../Provider';
import { ParentWindow } from '@util';
import { Modal } from '@ui/Modal';
import { Layout } from 'components/Common/Layout';
import { MessageHandlerDataType } from '@types';
import { IInitPayload, IShowPayload } from '@impler/shared';
interface IContainerProps {
  phase: number;
}

export function Container({ children, phase }: PropsWithChildren<IContainerProps>) {
  const { projectId = '' } = useParams<{ projectId: string }>();
  const [primaryPayload, setPrimaryPayload] = useState<IInitPayload>();
  const [secondaryPayload, setSecondaryPayload] = useState<IShowPayload>();
  const [frameInitialized, setFrameInitialized] = useState(false);

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
    if (data && data.type === 'INIT_IFRAME') {
      setFrameInitialized(true);
      setPrimaryPayload(data.value);
    }
    if (data && data.type === 'SHOW_WIDGET') {
      setSecondaryPayload(data.value);
    }
  }

  const onClose = () => {
    ParentWindow.Close();
  };

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
      {frameInitialized && primaryPayload ? (
        <Provider
          // api
          backendUrl={API_URL}
          // impler-context
          projectId={projectId}
          template={primaryPayload.template}
          accessToken={primaryPayload.accessToken}
          authHeaderValue={secondaryPayload?.authHeaderValue}
          extra={secondaryPayload?.extra}
        >
          <Modal opened={true} onClose={onClose}>
            <Layout active={phase}>{children}</Layout>
          </Modal>
        </Provider>
      ) : null}
    </>
  );
}

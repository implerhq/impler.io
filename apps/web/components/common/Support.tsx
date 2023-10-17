import getConfig from 'next/config';
import Tracker from '@openreplay/tracker';
import { useEffect, useRef } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import TawkMessengerReact from '@tawk.to/tawk-messenger-react';

const { publicRuntimeConfig } = getConfig();

interface SupportProps {
  profile?: IProfileData;
}

let tracker: Tracker;
if (publicRuntimeConfig.NEXT_PUBLIC_OPENREPLAY_KEY) {
  tracker = new Tracker({
    __DISABLE_SECURE_MODE: true,
    projectKey: publicRuntimeConfig.NEXT_PUBLIC_OPENREPLAY_KEY,
    network: {
      sessionTokenHeader: 'X-OpenReplay-Session-Token',
      failuresOnly: true,
      ignoreHeaders: ['Cookie'],
      captureInIframes: true,
      capturePayload: true,
    },
  });
}

export function Support({ profile }: SupportProps) {
  const twakRef = useRef<any>();

  useEffect(() => {
    if (tracker) {
      tracker.start();
    }
    if (profile) {
      if (tracker) {
        tracker.setUserID(profile.email);
        tracker.setMetadata('lastname', profile.lastName);
        tracker.setMetadata('firstname', profile.firstName);
      }
      twakRef.current?.setAttributes({
        id: profile._id,
        name: profile.firstName,
        email: profile.email,
      });
    }
  }, [profile]);

  return (
    <>
      {publicRuntimeConfig.NEXT_PUBLIC_TAWK_PROPERTY_ID && publicRuntimeConfig.NEXT_PUBLIC_TAWK_WIDGET_ID ? (
        <TawkMessengerReact
          propertyId={publicRuntimeConfig.NEXT_PUBLIC_TAWK_PROPERTY_ID}
          widgetId={publicRuntimeConfig.NEXT_PUBLIC_TAWK_WIDGET_ID}
          ref={twakRef}
          onLoad={() => {
            if (typeof window !== 'undefined' && profile) {
              twakRef.current?.setAttributes({
                id: profile._id,
                name: profile.firstName,
                email: profile.email,
              });
            }
          }}
        />
      ) : null}
    </>
  );
}

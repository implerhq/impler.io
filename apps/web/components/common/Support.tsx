import { useRef } from 'react';
import Script from 'next/script';
import getConfig from 'next/config';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import TawkMessengerReact from '@tawk.to/tawk-messenger-react';

const { publicRuntimeConfig } = getConfig();

interface SupportProps {
  profile?: IProfileData;
}

export function Support({}: SupportProps) {
  const twakRef = useRef<any>();

  return (
    <>
      {publicRuntimeConfig.NEXT_PUBLIC_TAWK_PROPERTY_ID && publicRuntimeConfig.NEXT_PUBLIC_TAWK_WIDGET_ID ? (
        <TawkMessengerReact
          propertyId={publicRuntimeConfig.NEXT_PUBLIC_TAWK_PROPERTY_ID}
          widgetId={publicRuntimeConfig.NEXT_PUBLIC_TAWK_WIDGET_ID}
          ref={twakRef}
        />
      ) : null}
      {publicRuntimeConfig.NEXT_PUBLIC_ONBOARDING_TOKEN && (
        <Script
          id="usetifulScript"
          src="https://www.usetiful.com/dist/usetiful.js"
          data-token={publicRuntimeConfig.NEXT_PUBLIC_ONBOARDING_TOKEN}
          async
        />
      )}
    </>
  );
}

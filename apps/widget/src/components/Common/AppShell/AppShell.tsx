import { PropsWithChildren } from 'react';
import * as Sentry from '@sentry/react';

export function AppShell({ children }: PropsWithChildren<{}>) {
  return (
    <Sentry.ErrorBoundary
      fallback={({ error, eventId }) => (
        <>
          Sorry, but something went wrong. <br />
          Our team been notified about it and we will look at it asap.
          <br />
          <code>
            <small style={{ color: 'lightGrey' }}>
              Event Id: {eventId}.
              <br />
              {error.toString()}
            </small>
          </code>
        </>
      )}
    >
      {children}
    </Sentry.ErrorBoundary>
  );
}

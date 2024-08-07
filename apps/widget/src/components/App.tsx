import { useState } from 'react';
import * as Sentry from '@sentry/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { Widget } from './widget';
import { initAmplitude } from '@amplitude';
import { AppShell } from './Common/AppShell';
import { Container } from './Common/Container';
import { WidgetShell } from './ApplicationShell';
import { CONTEXT_PATH, variables, SENTRY_DSN, ENV, AMPLITUDE_ID } from '@config';

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: ENV,
    tracesSampleRate: 1.0,
  });
}

if (AMPLITUDE_ID) {
  initAmplitude(AMPLITUDE_ID);
}

export function App() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            retry: false,
            staleTime: variables.twentyFourHoursInMs,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <Router basename={CONTEXT_PATH}>
        <Routes>
          <Route
            path="/widget"
            element={
              <AppShell>
                <WidgetShell>
                  <Container>
                    <Widget />
                  </Container>
                </WidgetShell>
              </AppShell>
            }
          />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

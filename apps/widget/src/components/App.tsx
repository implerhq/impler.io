import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NotificationsProvider } from '@mantine/notifications';
import { MantineProvider } from '@mantine/core';
import { CONTEXT_PATH, mantineConfig, variables, SENTRY_DSN, ENV } from '@config';
import { WidgetShell } from './ApplicationShell';
import { Container } from './Common/Container';
import { Widget } from './widget';
import { AppShell } from './Common/AppShell';

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    integrations: [new Integrations.BrowserTracing()],
    environment: ENV,
    /*
     * Set tracesSampleRate to 1.0 to capture 100%
     * of transactions for performance monitoring.
     * We recommend adjusting this value in production
     */
    tracesSampleRate: 1.0,
  });
}

export function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        retry: false,
        staleTime: variables.twentyFourHoursInMs,
      },
    },
  });

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS theme={{ ...mantineConfig }}>
      <NotificationsProvider>
        <QueryClientProvider client={queryClient}>
          <Router basename={CONTEXT_PATH}>
            <Routes>
              <Route
                path="/:projectId"
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
      </NotificationsProvider>
    </MantineProvider>
  );
}

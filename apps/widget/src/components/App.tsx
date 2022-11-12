import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NotificationsProvider } from '@mantine/notifications';
import { MantineProvider } from '@mantine/core';
import { CONTEXT_PATH, mantineConfig, variables } from '@config';
import { WidgetShell } from './ApplicationShell';
import { Container } from './Common/Container';
import { Widget } from './widget';

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
                  <WidgetShell>
                    <Container>
                      <Widget />
                    </Container>
                  </WidgetShell>
                }
              />
            </Routes>
          </Router>
        </QueryClientProvider>
      </NotificationsProvider>
    </MantineProvider>
  );
}

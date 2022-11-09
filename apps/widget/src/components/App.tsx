import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NotificationsProvider } from '@mantine/notifications';
import { MantineProvider } from '@mantine/core';
import { CONTEXT_PATH, mantineConfig } from '@config';
import { WidgetShell } from './ApplicationShell';
import { Widget } from './widget';

const milliseconds = 1000,
  hours = 24,
  seconds = 60,
  minutes = 60,
  twentyFourHoursInMs = milliseconds * minutes * seconds * hours;
export function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        retry: false,
        staleTime: twentyFourHoursInMs,
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
                    <Widget />
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

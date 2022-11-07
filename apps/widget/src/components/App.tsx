import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MantineProvider } from '@mantine/core';
import { CONTEXT_PATH, mantineConfig } from '@config';
import { WidgetShell } from './ApplicationShell';
import { Widget } from './widget';

export function App() {
  const queryClient = new QueryClient();

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS theme={{ ...mantineConfig }}>
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
    </MantineProvider>
  );
}

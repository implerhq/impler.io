import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { CONTEXT_PATH, mantineConfig } from '@config';
import { WidgetShell } from './ApplicationShell';
import { Widget } from './widget';

export function App() {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS theme={{ ...mantineConfig }}>
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
    </MantineProvider>
  );
}

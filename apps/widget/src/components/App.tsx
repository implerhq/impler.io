import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { CONTEXT_PATH } from '@config';
import { WidgetShell } from './ApplicationShell';
import { Widget } from './widget';

export function App() {
  return (
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
  );
}

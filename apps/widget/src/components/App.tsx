import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { WidgetShell } from './ApplicationShell';
import { NotificationCenterWidgetContainer } from './widget';
import { CONTEXT_PATH } from '../config';

export function App() {
  return (
    <Router basename={CONTEXT_PATH}>
      <Routes>
        <Route
          path="/:projectId"
          element={
            <WidgetShell>
              <NotificationCenterWidgetContainer />
            </WidgetShell>
          }
        />
      </Routes>
    </Router>
  );
}

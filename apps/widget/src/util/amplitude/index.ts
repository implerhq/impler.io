import { AMPLITUDE } from '@config';

export const initAmplitude = (id: string) => {
  window.amplitude?.init(id, undefined, {
    defaultTracking: { sessions: true, formInteractions: true },
  });
  // const sessionId = window.amplitude.getInstance().getSessionId();
};

export const identifyImportIntent = ({}: { templateId?: string; projectId: string }) => {
  logAmplitudeEvent('IMPORT_INTENT');
};

export const startAmplitudeSession = (id: string) => {
  window.amplitude?.setSessionId(id);
};

export const logAmplitudeEvent = (eventType: keyof typeof AMPLITUDE, eventProperties?: any) => {
  window.amplitude?.track({ event_type: eventType, eventProperties });
};

export const resetAmplitude = () => {
  window.amplitude?.flush();
  window.amplitude?.reset();
};

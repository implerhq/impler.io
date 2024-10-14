import { AMPLITUDE } from '@config';

export const initAmplitude = (id: string) => {
  window.amplitude?.init(id, {
    autocapture: {
      attribution: false,
      pageViews: false,
      sessions: false,
      formInteractions: false,
      fileDownloads: false,
      elementInteractions: false,
    },
  });
  // const sessionId = window.amplitude.getInstance().getSessionId();
};

export const identifyImportIntent = (props: { templateId?: string; projectId: string }) => {
  logAmplitudeEvent('IMPORT_INTENT', props);
};

export const startAmplitudeSession = (id: number) => {
  window.amplitude?.setSessionId(id);
};

export const logAmplitudeEvent = (eventType: keyof typeof AMPLITUDE, eventProperties?: any) => {
  window.amplitude?.track({ event_type: eventType, event_properties: eventProperties });
  if (eventProperties && eventProperties.email) window.amplitude?.setUserId(eventProperties.email);
};

export const resetAmplitude = () => {
  window.amplitude?.flush();
  window.amplitude?.reset();
};

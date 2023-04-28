import { AMPLITUDE } from '@config';

export const initAmplitude = (id: string) => {
  window.amplitude?.init(id, undefined, {
    defaultTracking: { sessions: true, formInteractions: true },
  });
  // const sessionId = window.amplitude.getInstance().getSessionId();
};

export const logAmplitudeEvent = (eventName: keyof typeof AMPLITUDE, eventProperties?: any) => {
  window.amplitude?.logEvent(eventName, eventProperties);
};

export const setAmplitudeUserId = (userId: string) => {
  window.amplitude?.setUserId(userId);
};

export const resetAmplitude = () => {
  window.amplitude?.reset();
};

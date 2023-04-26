import { AMPLITUDE } from '@config';

export const initAmplitude = (id: string) => {
  console.log(window.amplitude.reset());
  console.log('initializing');
  window.amplitude?.init(id, undefined, {
    defaultTracking: { sessions: true, pageViews: true, formInteractions: true, fileDownloads: true },
  });
};

export const logAmplitudeEvent = (eventName: keyof typeof AMPLITUDE, eventProperties?: any) => {
  console.log(window.amplitude?.invoked);
  window.amplitude?.logEvent(eventName, eventProperties);
};

export const logAmplitudePageView = (pageName: string, pageProperties: any) => {
  window.amplitude?.logEvent(pageName, pageProperties);
};

export const setAmplitudeUserId = (userId: string) => {
  window.amplitude?.setUserId(userId);
};

export const resetAmplitude = () => {
  window.amplitude?.reset();
};

import { colors, TEXTS, ENV, SENTRY_DSN } from '@config';
import { NotificationContent } from '@types';
import { showNotification } from '@mantine/notifications';
import { captureMessage } from '@sentry/react';
import { ENVTypesEnum } from '@impler/shared';

const autoCloseDuration = 5000;
export function showError(data: NotificationContent | keyof typeof TEXTS.NOTIFICATIONS) {
  let notificationData: NotificationContent;
  if (typeof data === 'string') {
    notificationData = TEXTS.NOTIFICATIONS[data];
  } else {
    notificationData = data;
  }
  showNotification({
    color: '#FFFFFF',
    autoClose: autoCloseDuration,
    title: notificationData.title,
    message: notificationData.message,
    styles: () => ({
      root: {
        '&::before': {
          backgroundColor: colors.red,
        },
      },
      title: {
        fontWeight: 'bold',
      },
    }),
  });
  if (ENV === ENVTypesEnum.PROD && SENTRY_DSN) captureMessage(typeof data === 'string' ? data : data.message);
}

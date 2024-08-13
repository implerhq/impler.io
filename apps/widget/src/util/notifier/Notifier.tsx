import { captureMessage } from '@sentry/react';
import { showNotification } from '@mantine/notifications';

import { colors, ENV, SENTRY_DSN } from '@config';
import { ENVTypesEnum, WIDGET_TEXTS } from '@impler/shared';
import { NotificationContent } from '@types';

const autoCloseDuration = 5000;
export function showError(data: NotificationContent | keyof typeof WIDGET_TEXTS.NOTIFICATIONS) {
  let notificationData: NotificationContent;
  if (typeof data === 'string') {
    notificationData = WIDGET_TEXTS.NOTIFICATIONS[data];
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

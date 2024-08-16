import { captureMessage } from '@sentry/react';
import { showNotification } from '@mantine/notifications';

import { colors, ENV, SENTRY_DSN } from '@config';
import { ENVTypesEnum } from '@impler/shared';
import { NotificationContent } from '@types';

const autoCloseDuration = 5000;
export function showError(notificationData: NotificationContent) {
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
  if (ENV === ENVTypesEnum.PROD && SENTRY_DSN) captureMessage(notificationData.message);
}

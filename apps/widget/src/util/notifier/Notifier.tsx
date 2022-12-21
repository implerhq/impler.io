import { colors, TEXTS } from '@config';
import { NotificationContent } from '@types';
import { showNotification } from '@mantine/notifications';

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
}

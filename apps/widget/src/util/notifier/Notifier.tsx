import { colors, TEXTS } from '@config';
import { showNotification } from '@mantine/notifications';

const autoCloseDuration = 5000;
export function showError(type: keyof typeof TEXTS.NOTIFICATIONS) {
  const notificationData = TEXTS.NOTIFICATIONS[type];
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

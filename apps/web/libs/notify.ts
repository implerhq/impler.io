import { NOTIFICATION_KEYS } from '@config';
import { notifications } from '@mantine/notifications';

const Messages: Record<string, NotifyProps> = {
  [NOTIFICATION_KEYS.IMPORT_UPDATED]: {
    title: 'Import details updated',
    message: 'Import details has been updated',
  },
  [NOTIFICATION_KEYS.IMPORT_CREATED]: {
    title: 'Import record created',
    message: 'Import record has been created successfully',
  },
  [NOTIFICATION_KEYS.IMPORT_DELETED]: {
    title: 'Import record deleted',
    message: 'Import record has been deleted successfully',
  },
  [NOTIFICATION_KEYS.DESTINATION_UPDATED]: {
    title: 'Destination details updated',
    message: 'Destination details has been updated',
  },
  [NOTIFICATION_KEYS.OUTPUT_UPDATED]: {
    title: 'Schema updated',
    message: 'Output schema has been updated',
  },
  [NOTIFICATION_KEYS.REGENERATED]: {
    title: 'Access token is re-generated',
    message: 'New access-token is re-generated and updated in the project',
    color: 'green',
  },
  [NOTIFICATION_KEYS.COLUMNS_UPDATED]: {
    title: 'Columns updated',
    message: 'Columns has been updated',
    color: 'green',
  },
};

interface NotifyProps {
  title?: string;
  message: string;
  withCloseButton?: boolean;
  autoClose?: number;
  color?: string;
}

export function notify(key: keyof typeof Messages, options?: NotifyProps) {
  notifications.show({ ...Messages[key], ...options });
}

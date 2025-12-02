import { ReactNode } from 'react';
import { NOTIFICATION_KEYS } from '@config';
import { notifications } from '@mantine/notifications';

const Messages: Record<string, NotifyProps | ((data?: any) => NotifyProps)> = {
  [NOTIFICATION_KEYS.MEMBERSHIP_PURCHASED]: {
    title: 'Membership Upgraded',
    message: 'Thankyou for Upgrading your membership',
  },

  [NOTIFICATION_KEYS.IMPORT_UPDATED]: {
    title: 'Import details updated',
    message: 'Import details has been updated',
  },
  [NOTIFICATION_KEYS.IMPORT_CREATED]: {
    title: 'Import created',
    message: 'Import has been created successfully',
  },
  [NOTIFICATION_KEYS.IMPORT_DUPLICATED]: {
    title: 'Import duplicated',
    message: 'Import has been duplicated successfully',
  },
  [NOTIFICATION_KEYS.IMPORT_DELETED]: {
    title: 'Import deleted',
    message: 'Import has been deleted successfully',
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
  [NOTIFICATION_KEYS.VALIDATIONS_UPDATED]: {
    title: 'Validations updated',
    message: 'Validations has been updated',
    color: 'green',
  },
  [NOTIFICATION_KEYS.ERROR_OCCURED]: {
    title: 'Something went wrong!',
    message: 'Something is not right! Our team is informed about it, please try again after some time.',
    color: 'red',
  },
  [NOTIFICATION_KEYS.CARD_ADDED]: {
    title: 'Card Added',
    message: 'New card is added to the system.',
    color: 'green',
  },
  [NOTIFICATION_KEYS.CARD_REMOVED]: {
    title: 'Card Removed',
    message: 'Card is removed from the system.',
  },
  [NOTIFICATION_KEYS.COLUMN_ERRROR]: {
    title: 'Issue with column data',
    message: 'It looks like column data is not correct. Please fix it and try again.',
    color: 'red',
  },
  // Change this to a simple string key, not a function call
  SUBSCRIPTION_FEATURE_NOT_INCLUDED_IN_CURRENT_PLAN: (data?: { featureName?: string }) => ({
    title: 'Subscription plan does not support this feature',
    message: data?.featureName
      ? `${data.featureName} is not available in your current plan. Please upgrade to use this feature.`
      : 'Your subscription plan does not support this feature. Please upgrade to continue.',
    color: 'red',
  }),
};

interface NotifyProps {
  title?: string;
  message: string | ReactNode;
  withCloseButton?: boolean;
  autoClose?: number;
  color?: string;
}

export function notify(key: string, options?: NotifyProps & { featureName?: string }) {
  const messageConfig = Messages[key];

  // Check if it's a function (dynamic message)
  const config = typeof messageConfig === 'function' ? messageConfig(options) : messageConfig;

  notifications.show({ ...config, ...options });
}

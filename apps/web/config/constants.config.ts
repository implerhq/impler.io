export const CONSTANTS = {
  PLAN_CODE_QUERY_KEY: 'plan_code',
  GITHUB_LOGIN_URL: '/v1/auth/github',
  AUTH_COOKIE_NAME: 'authentication',
  AUTHENTICATION_ERROR_CODE: 'AuthenticationError',
  PROFILE_STORAGE_NAME: 'profile',
  REACT_DOCUMENTATION_URL: 'https://docs.impler.io/widget/react-component#props',
  PAYMENT_SUCCCESS_CODE: 'success',
  PAYMENT_FAILED_CODE: 'failed',
  PAYMENT_SUCCESS_MESSAGE:
    // eslint-disable-next-line max-len
    'Congratulations! Your subscription has been activated, and benefits have been added to your account. We hope you will love the experience. If you need anything, feel free to contact the support team.',
  PAYMENT_FAILED_MESSAGE:
    'An error occurred with the payment. No amount has been deducted. Please try again later or contact the support team.',
  SUBSCRIPTION_ACTIVATED_TITLE: 'Subscription activated',
  SUBSCRIPTION_FAILED_TITLE: 'Payment failed',
};

export const VARIABLES = {
  DEFAULT_ICON_SIZE: 24,
  ZERO: 0,
  ONE: 1,
  TWO: 2,
  TEN: 10,
  TWENTY: 20,
  THIRTY: 30,
  FORTY: 40,
  FIFTY: 50,
  TWO_HUNDREDS: 200,
  THREE_HUNDREDS: 300,
};

export const MODAL_KEYS = {
  SELECT_CARD: 'SELECT_CARD',
  PAYMENT_SUCCEED: 'successfull_payment',

  IMPORT_DUPLICATE: 'IMPORT_DUPLICATE',
  IMPORT_CREATE: 'IMPORT_CREATE',
  IMPORT_UPDATE: 'IMPORT_UPDATE',
  COLUMN_UPDATE: 'COLUMN_UPDATE',
  COLUMN_DELETE: 'COLUMN_DELETE',

  VALIDATIONS_OUTPUT: 'VALIDATIONS_OUTPUT',
  PAYMENT_PLANS: 'PAYMENT_PLANS',
  PAYMENT_DETAILS_ADD: 'PAYMENT_PLANS',
};

export const MODAL_TITLES = {
  IMPORT_DUPLICATE: 'Duplicate Import',
  IMPORT_CREATE: 'Start with a new Import',
  IMPORT_UPDATE: 'Update Import',
  IMPORT_DELETE: 'Delete Import',
  COLUMN_UPDATE: 'Configure Column',
  COLUMN_DELETE: 'Delete Column',

  VALIDATIONS_OUTPUT: 'Test code output',
};

export const API_KEYS = {
  CHECKOUT: 'CHECKOUT',

  APPLY_COUPON_CODE: 'APPLY_COUPON_CODE',

  TRANSACTION_HISTORY: 'TRANSACTION_HISTORY',

  PAYMENT_METHOD_DELETE: 'PAYMENT_METHOD_DELETE',
  PAYMENT_METHOD_LIST: 'PAYMENT_METHOD_LIST',

  ADD_PAYMENT_METHOD: 'ADD_PAYMENT_METHOD',
  SAVE_INTENT_ID: 'SAVE_SETUP_INTENT_ID',

  FETCH_ACTIVE_SUBSCRIPTION: 'FETCH_ACTIVE_SUBSCRIPTION',
  CANCEL_SUBSCRIPTION: 'CANCEL_SUBSCRIPTION',

  PROJECT_SWITCH: 'PROJECT_SWITCH',
  PROJECTS_LIST: 'PROJECT_LIST',
  PROJECT_CREATE: 'PROJECT_CREATE',
  PROJECT_ENVIRONMENT: 'PROJECT_ENVIRONMENT',

  LOGOUT: 'LOGOUT',
  SIGNIN: 'SIGNIN',
  SIGNUP: 'SIGNUP',
  RESET_PASSWORD: 'RESET_PASSWORD',
  REQUEST_FORGOT_PASSWORD: 'REQUEST_FORGOT_PASSWORD',

  IMPORTS_LIST: 'IMPORTS_LIST',
  TEMPLATES_LIST: 'TEMPLATES_LIST',
  TEMPLATES_CREATE: 'TEMPLATES_CREATE',
  TEMPLATE_DETAILS: 'TEMPLATE_DETAILS',
  TEMPLATE_UPDATE: 'TEMPLATE_UPDATE',
  TEMPLATE_DELETE: 'TEMPLATE_DELETE',
  TEMPLATES_DUPLICATE: 'TEMPLATES_DUPLICATE',
  TEMPLATE_COLUMNS_LIST: 'TEMPLATE_COLUMNS_LIST',
  TEMPLATE_CUSTOMIZATION_GET: 'CUSTOMIZATION_GET',
  TEMPLATE_COLUMNS_UPDATE: 'TEMPLATE_COLUMNS_UPDATE',
  TEMPLATE_CUSTOMIZATION_UPDATE: 'CUSTOMIZATION_UPDATE',
  TEMPLATE_CUSTOMIZATION_SYNC: 'CUSTOMIZATION_SYNC',

  COLUMN_CREATE: 'COLUMN_CREATE',
  COLUMN_UPDATE: 'COLUMN_UPDATE',
  COLUMN_DELETE: 'COLUMN_DELETE',

  DESTINATION_FETCH: 'DESTINATION_FETCH',
  DESTINATION_UPDATE: 'DESTINATION_UPDATE',
  BUBBLEIO_MAP_COLUMNS: 'BUBBLEIO_MAP_COLUMNS',

  VALIDATIONS: 'VALIDATIONS',
  VALIDATIONS_UPDATE: 'VALIDATIONS_UPDATE',

  ACTIVITY_HISTORY: 'ACTIVITY_HISTORY',
  ACTIVITY_SUMMARY: 'ACTIVITY_SUMMARY',

  ME: 'ME',
  REGENERATE: 'REGENERATE',
  IMPORT_COUNT: 'IMPORT_COUNT',
  DONWLOAD_ORIGINAL_FILE: 'DOWNLOAD_ORIGINAL_FILE',
};

export const NOTIFICATION_KEYS = {
  ERROR_ADDING_PAYMENT_METHOD: 'ERROR_ADDING_PAYMENT_METHOD',
  NO_PAYMENT_METHOD_FOUND: 'NO_PAYMENT_METHOD_FOUND',

  ERROR_AUTHORIZING_PAYMENT_METHOD: 'ERROR_AUTHORIZING_PAYMENT_METHOD',

  PAYMENT_INTENT_ID_UPDATED: 'PAYMENT_INTENT_ID_UPDATED',

  MEMBERSHIP_CANCELLED: 'MEMBERSHIP_CANCELLED',
  MEMBERSHIP_PURCHASED: 'MEMBERSHIP_PURCHASED',

  IMPORT_DUPLICATED: 'IMPORT_DUPLICATED',
  IMPORT_UPDATED: 'IMPORT_UPDATED',
  IMPORT_CREATED: 'IMPORT_CREATED',
  IMPORT_DELETED: 'IMPORT_DELETED',

  PROJECT_CREATED: 'PROJECT_CREATED',
  OUTPUT_UPDATED: 'OUTPUT_UPDATED',
  DESTINATION_UPDATED: 'DESTINATION_UPDATED',

  COLUMNS_UPDATED: 'COLUMNS_UPDATED',
  VALIDATIONS_UPDATED: 'VALIDATIONS_UPDATED',
  REGENERATED: 'REGENERATED',

  ERROR_OCCURED: 'ERROR_OCCURED',

  CARD_ADDED: 'CARD_ADDED',
  CARD_REMOVED: 'CARD_REMOVED',

  COLUMN_ERRROR: 'COLUMN_ERRROR',
};

export const ROUTES = {
  HOME: '/',
  SIGNUP: '/auth/signup',
  SIGNIN: '/auth/signin',
  SIGNIN_ONBOARDING: '/auth/onboard',
  REQUEST_FORGOT_PASSWORD: '/auth/reset/request',
  IMPORTS: '/imports',
  SETTINGS: '/settings',
  ACTIVITIES: '/activities',
  ADD_CARD: '/settings?tab=addcard&action=addcardmodal',
};

export const REGULAR_EXPRESSIONS = {
  URL: /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/gm,
};

export const COLUMN_TYPES = [
  {
    label: 'String',
    value: 'String',
  },
  {
    label: 'Number',
    value: 'Number',
  },
  {
    label: 'Double',
    value: 'Double',
  },
  {
    label: 'Select',
    value: 'Select',
  },
  {
    label: 'Date',
    value: 'Date',
  },
  {
    label: 'Regular Expression',
    value: 'Regex',
  },
  {
    label: 'Email',
    value: 'Email',
  },
  {
    label: 'Image',
    value: 'Image',
  },
  {
    label: 'Any',
    value: 'Any',
  },
];

export const DELIMITERS = [
  {
    label: 'Comma (,)',
    value: ',',
  },
  {
    label: 'Semicolon (;)',
    value: ';',
  },
];

export const TEXTS = {
  SEO_TITLE: 'CSV Excel Import Experience for SaaS',
  SEO_DESCRIPTION:
    // eslint-disable-next-line max-len
    "Build the best CSV Excel Import Experience for SaaS in 10 Minutes. Onboard customers' data with a hassle-free data importer in your app.",
};

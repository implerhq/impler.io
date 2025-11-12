import { MongoAbility } from '@casl/ability';
import { ReactIcon } from '@assets/icons/React.icon';
import { BubbleIcon } from '@assets/icons/Bubble.icon';
import { AngularIcon } from '@assets/icons/Angular.icon';
import { JavaScriptIcon } from '@assets/icons/Javascript.icon';
import { UserRolesEnum, IntegrationEnum, ColumnTypesEnum } from '@impler/shared';
import { Plan } from '@components/UpgradePlan/Plans';
import SuperworksLogo from '@assets/images/companies/Superworks.svg';
import AklamioLogo from '@assets/images/companies/aklamio.svg';
import ArthaLogo from '@assets/images/companies/artha.svg';
import NasscomLogo from '@assets/images/companies/nasscom.svg';
import NirvanaLogo from '@assets/images/companies/nirvana.svg';
import OmnivaLogo from '@assets/images/companies/omniva.svg';
import OrbitLogo from '@assets/images/companies/orbit.svg';
import UbicoLogo from '@assets/images/companies/ubico.svg';
import React from 'react';

export const CONSTANTS = {
  IMPLER_DOCUMENTATION: 'https://docs.impler.io',
  IMPLER_CAL_QUICK_MEETING: 'https://cal.com/impler/quick-chat',
  EXPLORE_PLANS_QUERY_LEY: 'explore_plans',
  PLAN_CODE_QUERY_KEY: 'plan_code',
  GITHUB_LOGIN_URL: '/v1/auth/github',
  AUTH_COOKIE_NAME: 'authentication',
  INVITATION_URL_COOKIE: 'redirectUrl',
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
  SUBSCRIPTION_CANCELLED_MESSAGE: (expiryDate: string): string =>
    `Your subscription is cancelled. Your current subscription will continue till ${expiryDate}. You won't be charged again.`,
  SAMPLE_IMPORT_NAME: 'Product Data Import',
  SIDEBAR_COLLAPSED_KEY: 'SIDE_BAR_COLLAPSED',
  VARIABLES_SHOW_WELCOME_IMPORTER_STORAGE_KEY: 'VARIABLES_SHOW_WELCOME_IMPORTER_STORAGE_KEY',
};

export enum CancellationModeEnum {
  END_OF_PERIOD = 'endOfPeriod',
  IMMEDIATE = 'immediate',
}

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
  CHANGE_CARD: 'CHANGE_CARD',
  PAYMENT_SUCCEED: 'successfull_payment',

  IMPORT_DUPLICATE: 'IMPORT_DUPLICATE',
  IMPORT_CREATE: 'IMPORT_CREATE',
  IMPORT_UPDATE: 'IMPORT_UPDATE',
  COLUMN_UPDATE: 'COLUMN_UPDATE',
  COLUMN_DELETE: 'COLUMN_DELETE',
  INTEGRATION_DETAILS: 'Integration Details',

  VALIDATIONS_OUTPUT: 'VALIDATIONS_OUTPUT',
  PAYMENT_PLANS: 'PAYMENT_PLANS',
  PAYMENT_DETAILS_ADD: 'PAYMENT_PLANS',

  INVITE_MEMBERS: 'INVITE_MEMBERS',
  ACCEPT_INVITATION: 'ACCEPT_INVITATION',
  MANAGE_PROJECT_MODAL: 'MANAGE_PROJECT_MODAL',
  CONFIRM_PROJECT_DELETE: 'CONFIRM_PROJECT_DELETE',
  CONFIRM_REMOVE_TEAM_MEMBER: 'CONFIRM_REMOVE_TEAM_MEMBER',

  VIEW_IMPORT_HISTORY: 'VIEW_IMPORT_HISTORY',
  WELCOME_IMPORTER: 'WELCOME_IMPORTER',
  WELCOME_CONFIGURE_STEP: 'WELCOME_CONFIGURE_STEP',
};

interface IntegrateOption {
  key: string;
  name: IntegrationEnum;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

export const INTEGRATE_IMPORT: IntegrateOption[] = [
  { name: IntegrationEnum.JAVASCRIPT, Icon: JavaScriptIcon, key: IntegrationEnum.JAVASCRIPT },
  { name: IntegrationEnum.REACT, Icon: ReactIcon, key: IntegrationEnum.REACT },
  { name: IntegrationEnum.ANGULAR, Icon: AngularIcon, key: IntegrationEnum.ANGULAR },
  { name: IntegrationEnum.BUBBLE, Icon: BubbleIcon, key: IntegrationEnum.BUBBLE },
];

export const INTEGRATION_GUIDE = [
  { value: IntegrationEnum.JAVASCRIPT, label: IntegrationEnum.JAVASCRIPT },
  { value: IntegrationEnum.ANGULAR, label: IntegrationEnum.ANGULAR },
  { value: IntegrationEnum.REACT, label: IntegrationEnum.REACT },
  { value: IntegrationEnum.BUBBLE, label: IntegrationEnum.BUBBLE },
];

export type IntegrationLanguage = 'javascript' | 'jsx' | 'typescript' | 'markup' | 'bash';

export const MODAL_TITLES = {
  IMPORT_DUPLICATE: 'Duplicate Import',
  IMPORT_CREATE: 'Start with a new Import',
  IMPORT_UPDATE: 'Update Import',
  IMPORT_DELETE: 'Delete Import',
  COLUMN_UPDATE: 'Configure Column',
  COLUMN_DELETE: 'Delete Column',
  INTEGRATION_DETAILS: 'Integrate',

  VALIDATIONS_OUTPUT: 'Test code output',
};

export const API_KEYS = {
  RESEND_OTP: 'RESEND_OTP',
  VERIFY_EMAIL: 'VERIFY_EMAIL',

  ONBOARD_USER: 'ONBOARD_USER',

  CHECKOUT: 'CHECKOUT',

  APPLY_COUPON_CODE: 'APPLY_COUPON_CODE',

  SUBSCRIBE: 'SUBSCRIBE',
  TRANSACTION_HISTORY: 'TRANSACTION_HISTORY',

  PAYMENT_METHOD_DELETE: 'PAYMENT_METHOD_DELETE',
  PAYMENT_METHOD_LIST: 'PAYMENT_METHOD_LIST',

  ADD_PAYMENT_METHOD: 'ADD_PAYMENT_METHOD',
  UPDATE_SUBSCRIPTION_PAYMENT_METHOD: 'UPDATE_PAYMENT_METHOD',
  SAVE_INTENT_ID: 'SAVE_SETUP_INTENT_ID',

  FETCH_ACTIVE_SUBSCRIPTION: 'FETCH_ACTIVE_SUBSCRIPTION',
  CANCEL_SUBSCRIPTION: 'CANCEL_SUBSCRIPTION',

  PROJECT_SWITCH: 'PROJECT_SWITCH',
  PROJECTS_LIST: 'PROJECT_LIST',
  PROJECT_CREATE: 'PROJECT_CREATE',
  PROJECT_DELETE: 'PROJECT_DELETE',
  PROJECT_ENVIRONMENT: 'PROJECT_ENVIRONMENT',
  PROJECT_INVITATION: 'PROJECT_INVITATION',
  SENT_TEAM_INVITATIONS: 'SENT_TEAM_INVITATIONS',
  GET_TEAM_INVITATIONS: 'GET_TEAM_INVITATIONS',
  ACCEPT_TEAM_INVITATION: 'INVITATION_ACCEPTED',
  DECLINE_TEAM_INVITATION: 'DECLINE_TEAM_INVITATION',
  LIST_TEAM_MEMBERS: 'LIST_TEAM_MEMBERS',
  UPDATE_TEAM_MEMBER_ROLE: 'UPDATE_TEAM_MEMBER_ROLE',
  DELETE_TEAM_MEMBER: 'DELETE_TEAM_MEMBER',
  REVOKE_INVITATION: 'REVOKE_INVITATION',
  TEAM_MEMBER_META: 'TEAM_MEMBER_META',

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
  TEMPLATE_SCHEMA_GET: 'TEMPLATE_SCHEMA_GET',
  TEMPLATE_SAMPLE_CREATE: 'TEMPLATE_SAMPLE_CREATE',
  TEMPLATE_SAMPLE_GET: 'TEMPLATE_SAMPLE_GET',

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
  ACTIVITY_RETRY: 'ACTIVITY_RETRY',
  ACTIVITY_WEBHOOK_LOGS: 'ACTIVITY_WEBHOOK_LOGS',

  ME: 'ME',
  UPDATE_ME_INFO: 'UPDATE_ME_INFO',
  REGENERATE: 'REGENERATE',
  IMPORT_COUNT: 'IMPORT_COUNT',
  DONWLOAD_ORIGINAL_FILE: 'DOWNLOAD_ORIGINAL_FILE',
};

export const NOTIFICATION_KEYS = {
  OTP_CODE_RESENT_SUCCESSFULLY: 'OTP_CODE_RESENT_SUCCESSFULLY',
  ERROR_ADDING_PAYMENT_METHOD: 'ERROR_ADDING_PAYMENT_METHOD',
  NO_PAYMENT_METHOD_FOUND: 'NO_PAYMENT_METHOD_FOUND',

  ERROR_AUTHORIZING_PAYMENT_METHOD: 'ERROR_AUTHORIZING_PAYMENT_METHOD',

  PAYMENT_INTENT_ID_UPDATED: 'PAYMENT_INTENT_ID_UPDATED',
  PAYMENT_METHOD_UPDATED: 'PAYMENT_METHOD_UPDATED',
  ERROR_SAVING_INTENT_ID: 'ERROR_SAVING_INTENT_ID',
  ERROR_UPDATING_PAYMENT_METHOD: 'ERROR_UPDATING_PAYMENT_METHOD',

  MEMBERSHIP_CANCELLED: 'MEMBERSHIP_CANCELLED',
  MEMBERSHIP_PURCHASED: 'MEMBERSHIP_PURCHASED',
  ERROR_CREATE_CHECKOUT_SESSION: 'ERROR_CREATE_PAYMENT_SESSION',
  ERROR_FETCHING_SUBSCRIPTION_DETAILS: 'ERROR_FETCHING_SUBSCRIPTION_DETAILS',

  IMPORT_DUPLICATED: 'IMPORT_DUPLICATED',
  IMPORT_UPDATED: 'IMPORT_UPDATED',
  IMPORT_CREATED: 'IMPORT_CREATED',
  IMPORT_DELETED: 'IMPORT_DELETED',

  PROJECT_CREATED: 'PROJECT_CREATED',
  PROJECT_DELETED: 'PROJECT_DELETED',
  PROJECT_SWITCHED: 'PROJECT_SWITCHED',
  OUTPUT_UPDATED: 'OUTPUT_UPDATED',
  DESTINATION_UPDATED: 'DESTINATION_UPDATED',

  COLUMNS_UPDATED: 'COLUMNS_UPDATED',
  VALIDATIONS_UPDATED: 'VALIDATIONS_UPDATED',
  REGENERATED: 'REGENERATED',

  ERROR_OCCURED: 'ERROR_OCCURED',

  CARD_ADDED: 'CARD_ADDED',
  CARD_REMOVED: 'CARD_REMOVED',
  PURCHASE_FAILED: 'PURCHASE_FAILED',
  NO_CARD_SELECTED: 'NO_CARD_SELECTED',

  COLUMN_ERRROR: 'COLUMN_ERRROR',
  INVITATION_ACCEPTED: 'INVITATION_ACCEPTED',

  VALID_INVITATION: 'VALID_INVITATION',
  ERROR_FETCHING_INVITATION: 'ERROR_FETCHING_INVITATION',
  TEAM_MEMBER_ROLE_UPDATED: 'TEAM_MEMBER_ROLE_UPDATED',
  ERROR_CHANGING_MEMBER_ROLE: 'ERROR_CHANGING_MEMBER_ROLE',
  TEAM_MEMBER_DELETED: 'TEAM_MEMBER_DELETED',
  ERROR_DELETING_TEAM_MEMBER: 'ERROR_DELETING_TEAM_MEMBER',
  ERROR_INVITING_TEAM_MEMBER: 'ERROR_INVITING_TEAM_MEMBER',
  ERROR_LISTING_TEAM_MEMBERS: 'ERROR_LISTING_TEAM_MEMBERS',
  INVITATION_LINK_COPIED: 'INVITATION_LINK_COPIED',
  INVITATION_DELETED: 'INVITATION_DELETED',
  ERROR_DELETING_INVITATION: 'INVITATION_DELETED',
  PERMISSION_DENIED_WHILE_DELETING_PROJECT: 'PERMISSION_DENIED_WHILE_DELETING_PROJECT',
  SUBSCRIPTION_FEATURE_NOT_INCLUDED_IN_CURRENT_PLAN: 'SUBSCRIPTION_FEATURE_NOT_INCLUDED_IN_CURRENT_PLAN',
} as const;

export const ROUTES = {
  HOME: '/',
  SIGNUP: '/auth/signup',
  SIGNIN: '/auth/signin',
  SIGNUP_ONBOARDING: '/auth/onboard',
  ONBOARD_TEMPLATE: '/auth/template',
  OTP_VERIFY: '/auth/verify',
  RESET_PASSWORD: '/auth/reset',
  REQUEST_FORGOT_PASSWORD: '/auth/reset/request',
  IMPORTS: '/imports',
  SETTINGS: '/settings',
  TEAM_MEMBERS: '/team-members',
  ACTIVITIES: '/activities',
  ADD_CARD: '/settings?tab=addcard&action=addcardmodal',
  EXPLORE_PLANS: '/?explore_plans=true',
  TRANSACTIONS: '/transactions',
  INVITATION: '/auth/invitation/:id',
  SUBSCRIPTION_STATUS: '/subscription-status',
  PAYMENT_CANCEL: '/payment-cancel',
};

export const REGULAR_EXPRESSIONS = {
  URL: /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/gm,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
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

export const IMPORT_MODES = [
  { value: 'manual', label: 'Manual' },
  { value: 'automatic', label: 'Automatic' },
];

export const INVITATION_FORM_ROLES = [UserRolesEnum.ADMIN, UserRolesEnum.FINANCE, UserRolesEnum.TECH];

export const TAB_KEYS = {
  MEMBERS: 'members',
  SENT_INVITATIONS: 'sentinvitation',
  INVITATION_REQUESTS: 'invitation-requests',
};

export const TAB_TITLES = {
  [TAB_KEYS.MEMBERS]: 'Members',
  [TAB_KEYS.SENT_INVITATIONS]: 'Sent Invitations',
  [TAB_KEYS.INVITATION_REQUESTS]: 'Invitation Requests',
};

export const MEMBER_ROLE = [UserRolesEnum.ADMIN, UserRolesEnum.TECH, UserRolesEnum.FINANCE];

export enum ActionsEnum {
  MANAGE = 'manage',
  READ = 'read',
  CREATE = 'create',
  UPDATE = 'update',
  BUY = 'buy',
}

export enum SubjectsEnum {
  HOMEPAGE = 'Homepage',
  IMPORTS = 'Imports',
  ANALYTICS = 'Analytics',
  SETTINGS = 'Settings',
  PLAN = 'Plan',
  FILE = 'File',
  TEAM_MEMBERS = 'TeamMembers',
  ACCESS_TOKEN = 'AccessToken',
  CARDS = 'Cards',
  ROLE = 'Role',
  ALL = 'all',
  DOCUMENTATION = 'Documentation',
}

export const ROLE_BADGES = {
  [UserRolesEnum.ADMIN]: 'cyan',
  [UserRolesEnum.TECH]: 'blue',
  [UserRolesEnum.FINANCE]: 'green',
};

export type AppAbility = MongoAbility<[ActionsEnum, SubjectsEnum]>;

export const ROLE_BASED_ACCESS = {
  [UserRolesEnum.ADMIN]: [{ action: ActionsEnum.MANAGE, subject: SubjectsEnum.ALL }],
  [UserRolesEnum.TECH]: [
    { action: ActionsEnum.READ, subject: SubjectsEnum.HOMEPAGE },
    { action: ActionsEnum.CREATE, subject: SubjectsEnum.IMPORTS },
    { action: ActionsEnum.READ, subject: SubjectsEnum.IMPORTS },
    { action: ActionsEnum.READ, subject: SubjectsEnum.ANALYTICS },
    { action: ActionsEnum.READ, subject: SubjectsEnum.SETTINGS },
    { action: ActionsEnum.READ, subject: SubjectsEnum.ACCESS_TOKEN },
    { action: ActionsEnum.READ, subject: SubjectsEnum.TEAM_MEMBERS },
    { action: ActionsEnum.READ, subject: SubjectsEnum.DOCUMENTATION },
  ],
  [UserRolesEnum.FINANCE]: [
    { action: ActionsEnum.READ, subject: SubjectsEnum.HOMEPAGE },
    { action: ActionsEnum.UPDATE, subject: SubjectsEnum.CARDS },
    { action: ActionsEnum.READ, subject: SubjectsEnum.SETTINGS },
    { action: ActionsEnum.BUY, subject: SubjectsEnum.PLAN },
  ],
};

export const DOCUMENTATION_REFERENCE_LINKS = {
  columnDescription: 'https://docs.impler.io/features/column-description',
  defaultValue: 'https://docs.impler.io/platform/default-value',
  primaryValidation: 'https://docs.impler.io/validations/base',
  multiSelectDropDown: 'https://docs.impler.io/features/multiselect-dropdown',
  freezeColumns: 'https://docs.impler.io/features/freeze-columns',
  frontendEndCallback: 'https://docs.impler.io/data-retrieval/using-frontend-callback',
  webhook: 'https://docs.impler.io/data-retrieval/using-webhook',
  bubbleIo: 'https://docs.impler.io/importer/bubble.io-embed',
  subscriptionInformation: 'https://docs.impler.io/platform/how-subscription-works',
  customValidation: 'https://docs.impler.io/features/custom-validation',
  rangeValidator: 'https://docs.impler.io/validations/advanced#range',
  autoImport: 'https://docs.impler.io/features/automated-import',
  imageImport: 'https://docs.impler.io/features/import-excel-with-image',
  advancedValidations: 'https://docs.impler.io/validations/advanced',
  teamMembers: 'https://docs.impler.io/platform/make-your-team',
  lengthValidator: 'https://docs.impler.io/validations/advanced#length',
  outputCustomization: 'https://docs.impler.io/features/output-customization',
  uniqueWithValidator: 'https://docs.impler.io/validations/advanced#unique-across-multiple-fields',
  webhookAuthentication: 'https://docs.impler.io/data-retrieval/using-webhook#authentication',
};

export const COMPANY_SIZES = [
  { value: 'Only me', label: 'Only me' },
  { value: '1-5', label: '1-5' },
  { value: '6-10', label: '6-10' },
  { value: '50-99', label: '50-99' },
  { value: '100+', label: '100+' },
];

export const ROLES = [
  { value: 'Engineer', label: 'Engineer' },
  { value: 'Engineering Manager', label: 'Engineering Manager' },
  { value: 'Architect', label: 'Architect' },
  { value: 'Product Manager', label: 'Product Manager' },
  { value: 'Designer', label: 'Designer' },
  { value: 'Founder', label: 'Founder' },
  { value: 'Marketing Manager', label: 'Marketing Manager' },
  { value: 'Student', label: 'Student' },
  { value: 'CXO (CTO/CEO/Other...)', label: 'CXO (CTO/CEO/Other...)' },
];

export const HOW_HEARD_ABOUT_US = [
  { value: 'Apollo', label: 'Apollo' },
  { value: 'Recommendation', label: 'Recommendation' },
  { value: 'Social Media', label: 'Social Media' },
  { value: 'Google Search', label: 'Google Search' },
  { value: 'Bubble.io', label: 'Bubble.io' },
  { value: 'Colleague', label: 'Colleague' },
  { value: 'Linkedin', label: 'Linkedin' },
  { value: 'Invitation', label: 'Invitation' },
  { value: 'AI (ChatGPT, Perplexity, Claude ...)', label: 'AI (ChatGPT, Perplexity, Claude ...)' },
];

export const PLACEHOLDERS = {
  email: 'johndoe@acme.inc',
  password: '********',
  project: 'Acme Inc',
  fullName: 'John Doe',
  companySize: 'Only me',
  role: 'Engineer, Manager, Founder...',
  source: 'Google Search, AI (ChatGPT, Perplexity, Claude ...), Recommendation...',
  about: 'Google Search',
  importName: 'Products, Employees, Assets...',
};

export const DATE_FORMATS = {
  SHORT: 'DD/MM/YYYY',
  LONG: 'DD MMM YYYY',
};

export const MEMBERSHIP_CANCELLATION_REASONS = [
  'Not liking service',
  'Building my own data importer',
  'No more need of data importer',
  'Moving to another service provider',
  'Something else',
];

export enum PLANCODEENUM {
  GROWTH = 'GROWTH-MONTHLY',
  GROWTH_YEARLY = 'GROWTH-YEARLY',
  STARTER = 'STARTER',
  FREE_FOREVER = 'FREE_FOREVER',
}
export const plans: { monthly: Plan[]; yearly: Plan[] } = {
  monthly: [
    {
      name: 'Starter (Default)',
      code: 'STARTER',
      rowsIncluded: 2500,
      price: 0,
      extraChargeOverheadTenThusandRecords: 1,
      removeBranding: false,
      recordsImportedPerDollar: null,
      costPerRecordImport: null,
      costPerExtraRecordImport: null,
      sellingPriceOf5KRecordsImport: null,
      content: {
        'Rows Included': [{ check: true, title: '2.5K' }],
        'Team Members': [{ check: false, title: '0', tooltipLink: DOCUMENTATION_REFERENCE_LINKS.teamMembers }],
        Features: [
          { check: false, title: 'Theming' },
          { check: true, title: 'Custom Validation', tooltipLink: DOCUMENTATION_REFERENCE_LINKS.customValidation },
          {
            check: true,
            title: 'Output Customization',
            tooltipLink: DOCUMENTATION_REFERENCE_LINKS.outputCustomization,
          },
          {
            check: false,
            title: 'Advanced Validations',
            tooltipLink: DOCUMENTATION_REFERENCE_LINKS.advancedValidations,
          },
          { check: false, title: 'Remove Branding' },
          { check: false, title: 'Auto Import', tooltipLink: DOCUMENTATION_REFERENCE_LINKS.autoImport },
          { check: false, title: 'Image Import', tooltipLink: DOCUMENTATION_REFERENCE_LINKS.imageImport },
        ],
      },
    },
    {
      name: 'Growth',
      code: 'GROWTH-MONTHLY',
      price: 42,
      rowsIncluded: 50000,
      extraChargeOverheadTenThusandRecords: 12.6,
      removeBranding: true,
      recordsImportedPerDollar: 1190,
      costPerRecordImport: 0.00084,
      costPerExtraRecordImport: 0.00126,
      sellingPriceOf5KRecordsImport: 64,
      content: {
        'Rows Included': [{ check: true, title: '50K' }],
        'Team Members': [{ check: true, title: '4', tooltipLink: DOCUMENTATION_REFERENCE_LINKS.teamMembers }],
        Features: [
          { check: true, title: 'Theming' },
          { check: true, title: 'Custom Validation', tooltipLink: DOCUMENTATION_REFERENCE_LINKS.customValidation },
          {
            check: true,
            title: 'Output Customization',
            tooltipLink: DOCUMENTATION_REFERENCE_LINKS.outputCustomization,
          },
          {
            check: true,
            title: 'Advanced Validations',
            tooltipLink: DOCUMENTATION_REFERENCE_LINKS.advancedValidations,
          },
          { check: false, title: 'Remove Branding' },
          { check: false, title: 'Auto Import', tooltipLink: DOCUMENTATION_REFERENCE_LINKS.autoImport },
          { check: false, title: 'Image Import', tooltipLink: DOCUMENTATION_REFERENCE_LINKS.imageImport },
        ],
      },
    },
    {
      name: 'Scale',
      code: 'SCALE-MONTHLY',
      price: 90,
      rowsIncluded: 150000,
      extraChargeOverheadTenThusandRecords: 9,
      removeBranding: true,
      recordsImportedPerDollar: 1667,
      costPerRecordImport: 0.0006,
      costPerExtraRecordImport: 0.0009,
      sellingPriceOf5KRecordsImport: 64,
      content: {
        'Rows Included': [{ check: true, title: '150K' }],
        'Team Members': [{ check: true, title: '10', tooltipLink: DOCUMENTATION_REFERENCE_LINKS.teamMembers }],
        Features: [
          { check: true, title: 'Theming' },
          { check: true, title: 'Custom Validation', tooltipLink: DOCUMENTATION_REFERENCE_LINKS.customValidation },
          {
            check: true,
            title: 'Output Customization',
            tooltipLink: DOCUMENTATION_REFERENCE_LINKS.outputCustomization,
          },
          { check: true, title: 'Remove Branding' },
          {
            check: true,
            title: 'Advanced Validations',
            tooltipLink: DOCUMENTATION_REFERENCE_LINKS.advancedValidations,
          },
          { check: true, title: 'Auto Import', tooltipLink: DOCUMENTATION_REFERENCE_LINKS.autoImport },
          { check: true, title: 'Image Import', tooltipLink: DOCUMENTATION_REFERENCE_LINKS.imageImport },
        ],
      },
    },
  ],
  yearly: [
    {
      name: 'Starter (Default)',
      code: 'STARTER',
      rowsIncluded: 2500,
      price: 0,
      extraChargeOverheadTenThusandRecords: 1,
      removeBranding: false,
      recordsImportedPerDollar: null,
      costPerRecordImport: null,
      costPerExtraRecordImport: null,
      sellingPriceOf5KRecordsImport: null,
      content: {
        'Rows Included': [{ check: true, title: '2.5K' }],
        'Team Members': [{ check: false, title: '0', tooltipLink: DOCUMENTATION_REFERENCE_LINKS.teamMembers }],
        Features: [
          { check: false, title: 'Theming' },
          { check: true, title: 'Custom Validation', tooltipLink: DOCUMENTATION_REFERENCE_LINKS.customValidation },
          {
            check: true,
            title: 'Output Customization',
            tooltipLink: DOCUMENTATION_REFERENCE_LINKS.outputCustomization,
          },
          {
            check: false,
            title: 'Advanced Validations',
            tooltipLink: DOCUMENTATION_REFERENCE_LINKS.advancedValidations,
          },
          { check: false, title: 'Remove Branding' },
          { check: false, title: 'Auto Import', tooltipLink: DOCUMENTATION_REFERENCE_LINKS.autoImport },
          { check: false, title: 'Image Import', tooltipLink: DOCUMENTATION_REFERENCE_LINKS.imageImport },
        ],
      },
    },
    {
      name: 'Growth',
      code: 'GROWTH-YEARLY',
      price: 420,
      rowsIncluded: 50000,
      extraChargeOverheadTenThusandRecords: 126,
      removeBranding: true,
      recordsImportedPerDollar: 1190,
      costPerRecordImport: 0.0084,
      costPerExtraRecordImport: 0.0126,
      sellingPriceOf5KRecordsImport: null,
      content: {
        'Rows Included': [{ check: true, title: '50K' }],
        'Team Members': [{ check: true, title: '4', tooltipLink: DOCUMENTATION_REFERENCE_LINKS.teamMembers }],
        Features: [
          { check: true, title: 'Theming' },
          { check: true, title: 'Custom Validation', tooltipLink: DOCUMENTATION_REFERENCE_LINKS.customValidation },
          {
            check: true,
            title: 'Output Customization',
            tooltipLink: DOCUMENTATION_REFERENCE_LINKS.outputCustomization,
          },
          {
            check: true,
            title: 'Advanced Validations',
            tooltipLink: DOCUMENTATION_REFERENCE_LINKS.advancedValidations,
          },
          { check: false, title: 'Remove Branding' },
          { check: false, title: 'Auto Import', tooltipLink: DOCUMENTATION_REFERENCE_LINKS.autoImport },
          { check: false, title: 'Image Import', tooltipLink: DOCUMENTATION_REFERENCE_LINKS.imageImport },
        ],
      },
    },
    {
      name: 'Scale',
      code: 'SCALE-YEARLY',
      price: 900,
      rowsIncluded: 150000,
      extraChargeOverheadTenThusandRecords: 90,
      removeBranding: true,
      recordsImportedPerDollar: 1667,
      costPerRecordImport: 0.006,
      costPerExtraRecordImport: 0.009,
      sellingPriceOf5KRecordsImport: null,
      content: {
        'Rows Included': [{ check: true, title: '150K' }],
        'Team Members': [{ check: true, title: '10', tooltipLink: DOCUMENTATION_REFERENCE_LINKS.teamMembers }],
        Features: [
          { check: true, title: 'Theming' },
          { check: true, title: 'Custom Validation', tooltipLink: DOCUMENTATION_REFERENCE_LINKS.customValidation },
          {
            check: true,
            title: 'Output Customization',
            tooltipLink: DOCUMENTATION_REFERENCE_LINKS.outputCustomization,
          },
          { check: true, title: 'Remove Branding' },
          {
            check: true,
            title: 'Advanced Validations',
            tooltipLink: DOCUMENTATION_REFERENCE_LINKS.advancedValidations,
          },
          { check: true, title: 'Auto Import', tooltipLink: DOCUMENTATION_REFERENCE_LINKS.autoImport },
          { check: true, title: 'Image Import', tooltipLink: DOCUMENTATION_REFERENCE_LINKS.imageImport },
        ],
      },
    },
  ],
};

export const sampleColumns = [
  {
    name: 'Product Name/ID',
    key: 'Product Name/ID *',
    description: 'The name or ID of the product purchased',
    type: ColumnTypesEnum.STRING,
    isRequired: true,
    isUnique: false,
  },
  {
    name: 'Quantity',
    key: 'Quantity *',
    description: 'The amount of the product purchased',
    type: ColumnTypesEnum.NUMBER,
    isRequired: true,
    isUnique: false,
  },
  {
    name: 'Unit Price',
    key: 'Unit Price *',
    description: 'The price of a single unit of the product',
    type: ColumnTypesEnum.NUMBER,
    isRequired: true,
    isUnique: false,
  },
  {
    name: 'Total Price',
    key: 'Total Price',
    description: 'The total cost of the products purchased',
    type: ColumnTypesEnum.NUMBER,
    isRequired: false,
    isUnique: false,
  },
  {
    name: 'Category',
    key: 'Category',
    description: 'The category of the product',
    type: ColumnTypesEnum.SELECT,
    isRequired: false,
    isUnique: false,
  },
];

export const companyLogos = [
  { id: 'superworks', src: SuperworksLogo, alt: 'Superworks' },
  { id: 'aklamio', src: AklamioLogo, alt: 'Aklamio' },
  { id: 'artha', src: ArthaLogo, alt: 'Artha' },
  { id: 'nasscom', src: NasscomLogo, alt: 'Nasscom' },
  { id: 'nirvana', src: NirvanaLogo, alt: 'Nirvana' },
  { id: 'omniva', src: OmnivaLogo, alt: 'Omniva' },
  { id: 'orbit', src: OrbitLogo, alt: 'Orbit' },
  { id: 'ubico', src: UbicoLogo, alt: 'Ubico' },
];
export const defaultWidgetAppereanceThemeYellow = {
  widget: {
    backgroundColor: '#1c1917',
  },
  fontFamily: 'Inter, sans-serif',
  borderRadius: '12px',
  primaryButtonConfig: {
    backgroundColor: '#f59e0b',
    textColor: '#1c1917',
    hoverBackground: '#fbbf24',
    hoverTextColor: '#1c1917',
    borderColor: 'transparent',
    hoverBorderColor: 'transparent',
    buttonShadow: '0 4px 16px rgba(245, 158, 11, 0.4)',
  },
  secondaryButtonConfig: {
    backgroundColor: '#292524',
    textColor: '#fcd34d',
    hoverBackground: '#3c2d2a',
    hoverTextColor: '#fed7aa',
    borderColor: '#44403c',
    hoverBorderColor: '#f59e0b',
    buttonShadow: 'none',
  },
};

export const defaultWidgetAppereanceThemeDark = {
  widget: {
    backgroundColor: '#000000',
    background: 'linear-gradient(135deg, #000000 0%, #0a0a0a 50%, #1a1a1a 100%)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0px 0px 50px rgba(0, 0, 0, 0.9), inset 0px 2px 10px rgba(255, 255, 255, 0.02)',
  },
  primaryColor: '#ffffff',
  fontFamily: 'JetBrains Mono, Consolas, monospace',
  borderRadius: '4px',
  primaryButtonConfig: {
    backgroundColor: '#1a1a1a',
    textColor: '#ffffff',
    hoverBackground: '#333333',
    hoverTextColor: '#ffffff',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    hoverBorderColor: '#ffffff',
    buttonShadow: '0px 8px 32px rgba(0, 0, 0, 0.8), 0px 0px 20px rgba(255, 255, 255, 0.1)',
    transform: 'translateY(-2px)',
  },
  secondaryButtonConfig: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    textColor: '#666666',
    hoverBackground: 'rgba(26, 26, 26, 0.9)',
    hoverTextColor: '#ffffff',
    borderColor: 'rgba(102, 102, 102, 0.3)',
    hoverBorderColor: '#1a1a1a',
    buttonShadow: '0px 4px 16px rgba(0, 0, 0, 0.6)',
  },
};

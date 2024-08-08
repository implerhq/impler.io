import getConfig from 'next/config';
import { API_KEYS, VARIABLES } from '@config';

interface Route {
  url: (...rest: string[]) => string;
  method: string;
}

const routes: Record<string, Route> = {
  [API_KEYS.PAYMENT_METHOD_LIST]: {
    url: () => `/v1/user/payment-methods`,
    method: 'GET',
  },
  [API_KEYS.PAYMENT_METHOD_DELETE]: {
    url: (paymentMethodId: string) => `/v1/user/payment-methods/${paymentMethodId}`,
    method: 'DELETE',
  },
  [API_KEYS.TRANSACTION_HISTORY]: {
    url: () => `/v1/user/transactions/history`,
    method: 'GET',
  },
  [API_KEYS.APPLY_COUPON_CODE]: {
    url: (coponCode, planCode) => `/v1/user/coupons/${coponCode}/apply/${planCode}`,
    method: 'GET',
  },

  [API_KEYS.CHECKOUT]: {
    url: () => `/v1/user/checkout`,
    method: 'GET',
  },

  [API_KEYS.ADD_PAYMENT_METHOD]: {
    url: (paymentMethodId: string) => `/v1/user/setup-intent/${paymentMethodId}`,
    method: 'PUT',
  },
  [API_KEYS.SAVE_INTENT_ID]: {
    url: (intentId: string) => `/v1/user/confirm-payment-intent-id/${intentId}`,
    method: 'PUT',
  },

  [API_KEYS.FETCH_ACTIVE_SUBSCRIPTION]: {
    url: () => `/v1/user/subscription`,
    method: 'GET',
  },
  [API_KEYS.CANCEL_SUBSCRIPTION]: {
    url: () => `/v1/user/subscription`,
    method: 'DELETE',
  },
  [API_KEYS.ONBOARD_USER]: {
    url: () => '/v1/auth/onboard',
    method: 'POST',
  },

  [API_KEYS.PROJECTS_LIST]: {
    url: () => '/v1/project',
    method: 'GET',
  },
  [API_KEYS.PROJECT_CREATE]: {
    url: () => '/v1/project',
    method: 'POST',
  },
  [API_KEYS.PROJECT_SWITCH]: {
    url: (projectId) => `/v1/project/switch/${projectId}`,
    method: 'PUT',
  },
  [API_KEYS.PROJECT_ENVIRONMENT]: {
    url: (projectId) => `/v1/project/${projectId}/environment`,
    method: 'GET',
  },
  [API_KEYS.LOGOUT]: {
    url: () => '/v1/auth/logout',
    method: 'GET',
  },
  [API_KEYS.SIGNIN]: {
    url: () => '/v1/auth/login',
    method: 'POST',
  },
  [API_KEYS.SIGNUP]: {
    url: () => '/v1/auth/register',
    method: 'POST',
  },
  [API_KEYS.REQUEST_FORGOT_PASSWORD]: {
    url: () => '/v1/auth/forgot-password/request',
    method: 'POST',
  },
  [API_KEYS.RESET_PASSWORD]: {
    url: () => `/v1/auth/forgot-password/reset`,
    method: 'POST',
  },
  [API_KEYS.ME]: {
    url: () => `/v1/auth/me`,
    method: 'GET',
  },
  [API_KEYS.IMPORT_COUNT]: {
    url: () => `/v1/user/import-count`,
    method: 'GET',
  },

  [API_KEYS.IMPORTS_LIST]: {
    url: (projectId) => `/v1/project/${projectId}/imports`,
    method: 'GET',
  },
  [API_KEYS.TEMPLATES_LIST]: {
    url: (projectId) => `/v1/project/${projectId}/templates`,
    method: 'GET',
  },
  [API_KEYS.TEMPLATES_CREATE]: {
    url: () => `/v1/template`,
    method: 'POST',
  },
  [API_KEYS.TEMPLATE_UPDATE]: {
    url: (templateId) => `/v1/template/${templateId}`,
    method: 'PUT',
  },
  [API_KEYS.TEMPLATES_DUPLICATE]: {
    url: (templateId) => `/v1/template/${templateId}/duplicate`,
    method: 'POST',
  },
  [API_KEYS.TEMPLATE_COLUMNS_UPDATE]: {
    url: (templateId) => `/v1/template/${templateId}/columns`,
    method: 'PUT',
  },
  [API_KEYS.TEMPLATE_DELETE]: {
    url: (templateId) => `/v1/template/${templateId}`,
    method: 'DELETE',
  },
  [API_KEYS.TEMPLATE_DETAILS]: {
    url: (templateId) => `/v1/template/${templateId}`,
    method: 'GET',
  },
  [API_KEYS.TEMPLATE_COLUMNS_LIST]: {
    url: (templateId) => `/v1/template/${templateId}/columns`,
    method: 'GET',
  },
  [API_KEYS.TEMPLATE_CUSTOMIZATION_GET]: {
    url: (templateId) => `/v1/template/${templateId}/customizations`,
    method: 'GET',
  },
  [API_KEYS.TEMPLATE_CUSTOMIZATION_UPDATE]: {
    url: (templateId) => `/v1/template/${templateId}/customizations`,
    method: 'PUT',
  },
  [API_KEYS.TEMPLATE_CUSTOMIZATION_SYNC]: {
    url: (templateId) => `/v1/template/${templateId}/customizations/sync`,
    method: 'PUT',
  },

  // Destination
  [API_KEYS.DESTINATION_FETCH]: {
    url: (templateId) => `/v1/template/${templateId}/destination`,
    method: 'GET',
  },
  [API_KEYS.DESTINATION_UPDATE]: {
    url: (templateId) => `/v1/template/${templateId}/destination`,
    method: 'PUT',
  },
  [API_KEYS.BUBBLEIO_MAP_COLUMNS]: {
    url: (templateId) => `/v1/template/${templateId}/map-bubble-io-columns`,
    method: 'PUT',
  },

  // Column
  [API_KEYS.COLUMN_CREATE]: {
    url: (templateId) => `/v1/column/${templateId}`,
    method: 'POST',
  },
  [API_KEYS.COLUMN_UPDATE]: {
    url: (columnId) => `/v1/column/${columnId}`,
    method: 'PUT',
  },
  [API_KEYS.COLUMN_DELETE]: {
    url: (columnId) => `/v1/column/${columnId}`,
    method: 'DELETE',
  },

  // Activity
  [API_KEYS.ACTIVITY_HISTORY]: {
    url: (projectId) => `/v1/activity/${projectId}/history`,
    method: 'GET',
  },
  [API_KEYS.ACTIVITY_SUMMARY]: {
    url: (projectId) => `/v1/activity/${projectId}/summary`,
    method: 'GET',
  },

  // Security
  [API_KEYS.REGENERATE]: {
    url: () => `/v1/environment/api-keys/regenerate`,
    method: 'GET',
  },

  // Validations
  [API_KEYS.VALIDATIONS]: {
    url: (templateId) => `/v1/template/${templateId}/validations`,
    method: 'GET',
  },
  [API_KEYS.VALIDATIONS_UPDATE]: {
    url: (templateId) => `/v1/template/${templateId}/validations`,
    method: 'PUT',
  },

  // Activity
  [API_KEYS.DONWLOAD_ORIGINAL_FILE]: {
    url: (uploadId) => `/v1/upload/${uploadId}/files/original`,
    method: 'GET',
  },
};

function handleResponseStatusAndContentType(response: Response) {
  const contentType = response.headers.get('content-type');

  if (contentType === null) return Promise.resolve(null);
  else if (contentType.startsWith('application/json;')) return response.json();
  else if (contentType.startsWith('text/plain;')) return response.text();
  else if (contentType.startsWith('text/csv')) return response.text();
  else if (contentType.startsWith('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
    return response.arrayBuffer();
  } else throw new Error(`Unsupported response content-type: ${contentType}`);
}

function queryObjToString(obj?: Record<string, string | number | undefined>): string {
  const str = [];
  for (const key in obj)
    if (obj.hasOwnProperty(key) && typeof obj[key] !== 'undefined') {
      str.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key] as any));
    }

  return str.join('&');
}

const { publicRuntimeConfig } = getConfig();

export async function commonApi<T>(
  key: keyof typeof API_KEYS,
  {
    parameters,
    body,
    cookie,
    headers,
    query,
    baseUrl,
    credentials = 'include',
  }: {
    parameters?: string[];
    body?: any;
    credentials?: 'include' | 'omit' | 'same-origin' | undefined;
    headers?: Record<string, string>;
    cookie?: string;
    query?: Record<string, string | number | undefined>;
    baseUrl?: string;
  }
) {
  try {
    const route = routes[key];
    let url = (baseUrl || publicRuntimeConfig.NEXT_PUBLIC_API_BASE_URL) + route.url(...(parameters || []));
    url = url + '?' + queryObjToString(query);
    const method = route.method;

    const response = await fetch(url, {
      method,
      body: JSON.stringify(body),
      ...(credentials ? { credentials: credentials } : {}),
      headers: {
        'Content-Type': 'application/json',
        ...(headers ? headers : {}),
        ...(cookie ? { Cookie: cookie } : {}),
      },
    });

    if (response.status >= VARIABLES.TWO_HUNDREDS && response.status < VARIABLES.THREE_HUNDREDS) {
      return (await handleResponseStatusAndContentType(response)) as T;
    }

    throw await handleResponseStatusAndContentType(response);
  } catch (error) {
    throw error;
  }
}

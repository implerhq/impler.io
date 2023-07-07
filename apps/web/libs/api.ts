import getConfig from 'next/config';
import { API_KEYS, VARIABLES } from '@config';

interface Route {
  url: (params: any) => string;
  method: string;
}

const routes: Record<string, Route> = {
  [API_KEYS.PROJECTS_LIST]: {
    url: () => '/v1/project',
    method: 'GET',
  },
  [API_KEYS.PROJECT_CREATE]: {
    url: () => '/v1/project',
    method: 'POST',
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
  [API_KEYS.IMPORTS_LIST]: {
    url: (projectId) => `/v1/activity/${projectId}/history`,
    method: 'GET',
  },
  [API_KEYS.IMPORT_SUMMARY]: {
    url: (projectId) => `/v1/activity/${projectId}/summary`,
    method: 'GET',
  },
  [API_KEYS.REGENERATE]: {
    url: () => `/v1/environment/api-keys/regenerate`,
    method: 'GET',
  },
};

function handleResponseStatusAndContentType(response: Response) {
  const contentType = response.headers.get('content-type');

  if (contentType === null) return Promise.resolve(null);
  else if (contentType.startsWith('application/json;')) return response.json();
  else if (contentType.startsWith('text/plain;')) return response.text();
  else throw new Error(`Unsupported response content-type: ${contentType}`);
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
  }: {
    parameters?: string[];
    body?: any;
    headers?: Record<string, string>;
    cookie?: string;
    query?: Record<string, string | number | undefined>;
  }
) {
  try {
    const route = routes[key];
    let url = publicRuntimeConfig.NEXT_PUBLIC_API_BASE_URL + route.url(parameters);
    url = url + '?' + queryObjToString(query);
    const method = route.method;

    const response = await fetch(url, {
      method,
      body: JSON.stringify(body),
      credentials: 'include',
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

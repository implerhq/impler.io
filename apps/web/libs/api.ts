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
};

function handleResponseStatusAndContentType(response: Response) {
  const contentType = response.headers.get('content-type');

  if (contentType === null) return Promise.resolve(null);
  else if (contentType.startsWith('application/json;')) return response.json();
  else if (contentType.startsWith('text/plain;')) return response.text();
  else throw new Error(`Unsupported response content-type: ${contentType}`);
}

export async function commonApi<T>(
  key: keyof typeof API_KEYS,
  {
    parameters,
    body,
    cookie,
    headers,
  }: { parameters?: string[]; body?: any; headers?: Record<string, string>; cookie?: string }
) {
  try {
    const route = routes[key];
    const url = process.env.NEXT_PUBLIC_API_BASE_URL + route.url(parameters);
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

    throw new Error(response.statusText);
  } catch (error) {
    throw error;
  }
}

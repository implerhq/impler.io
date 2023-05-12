export enum ImplerComponentEnum {
  WEB,
  API,
  WIDGET,
}

export function getContextPath(component: ImplerComponentEnum) {
  let contextPath = '';

  if (process.env.GLOBAL_CONTEXT_PATH) {
    contextPath += process.env.GLOBAL_CONTEXT_PATH + '/';
  }

  switch (component) {
    case ImplerComponentEnum.API:
      if (process.env.API_CONTEXT_PATH) {
        contextPath += process.env.API_CONTEXT_PATH + '/';
      }
      break;
    case ImplerComponentEnum.WEB:
      if (process.env.WEB_CONTEXT_PATH) {
        contextPath += process.env.WEB_CONTEXT_PATH + '/';
      }
      break;
    case ImplerComponentEnum.WIDGET:
      if (process.env.WIDGET_CONTEXT_PATH) {
        contextPath += process.env.WIDGET_CONTEXT_PATH + '/';
      }
      break;
  }

  return contextPath;
}

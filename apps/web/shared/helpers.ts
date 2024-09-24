import { constructQueryString, SCREENS } from '@impler/shared';
import { ROUTES } from '@config';

export function formatUrl(template: string, params: any[], query: Record<string, any> = {}): string {
  let paramIndex = 0;

  const formattedRoute = template.replace(/:(\w+)/g, (match) => {
    if (paramIndex < params.length) {
      return String(params[paramIndex++]);
    }

    return match;
  });

  return formattedRoute + constructQueryString(query);
}

export function handleRouteBasedOnScreenResponse(
  screen: SCREENS,
  push: (url: string) => void,
  parameters: string[] = []
) {
  switch (screen) {
    case SCREENS.VERIFY:
      push(formatUrl(ROUTES.OTP_VERIFY, parameters));
      break;
    case SCREENS.ONBOARD:
      push(ROUTES.SIGNUP_ONBOARDING);
      break;
    case SCREENS.INVIATAION:
      push(formatUrl(ROUTES.INVITATION, parameters));
      break;
    case SCREENS.HOME:
    default:
      push(ROUTES.HOME);
      break;
  }
}

import { SCREENS } from '@impler/shared';
import { ROUTES } from '@config';

export function handleRouteBasedOnScreenResponse(screen: SCREENS, push: (url: string) => void) {
  switch (screen) {
    case SCREENS.VERIFY:
      push(ROUTES.OTP_VERIFY);
      break;
    case SCREENS.ONBOARD:
      push(ROUTES.SIGNUP_ONBOARDING);
      break;
    case SCREENS.HOME:
    default:
      push(ROUTES.HOME);
      break;
  }
}

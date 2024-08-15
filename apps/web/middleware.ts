import jwtDecode from 'jwt-decode';
import { CONSTANTS, ROUTES } from '@config';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const cookie = request.cookies.get(CONSTANTS.AUTH_COOKIE_NAME);
  if (!cookie) {
    if (
      ![ROUTES.SIGNIN, ROUTES.SIGNUP, ROUTES.REQUEST_FORGOT_PASSWORD].includes(path) &&
      !path.startsWith(ROUTES.RESET_PASSWORD)
    ) {
      return NextResponse.redirect(new URL(ROUTES.SIGNIN, request.url));
    } else return;
  }
  const token = cookie?.value.split(' ')[1];
  const profileData = jwtDecode<IProfileData>(token as unknown as string);

  if (!profileData.isEmailVerified)
    if (path !== ROUTES.OTP_VERIFY) return NextResponse.redirect(new URL(ROUTES.OTP_VERIFY, request.url));
    else return;
  else if (!profileData.accessToken)
    if (path !== ROUTES.SIGNUP_ONBOARDING) return NextResponse.redirect(new URL(ROUTES.SIGNUP_ONBOARDING, request.url));
    else return;
  else if ([ROUTES.SIGNIN, ROUTES.OTP_VERIFY, ROUTES.SIGNUP_ONBOARDING, ROUTES.SIGNUP].includes(path))
    return NextResponse.redirect(new URL(ROUTES.HOME, request.url));
  else if ((path == ROUTES.SIGNUP, [ROUTES.SIGNUP] && !cookie))
    return NextResponse.redirect(new URL(ROUTES.SIGNUP, request.url));
  // else if (path !== ROUTES.HOME)
}

// Configuration for matching paths
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon-light.ico|favicon-dark.ico|images).*)'],
};

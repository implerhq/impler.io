import { CONSTANTS, ROUTES } from '@config';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  if (!request.cookies.get(CONSTANTS.AUTH_COOKIE_NAME))
    return NextResponse.redirect(new URL(ROUTES.SIGNIN, request.url));
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/((?!auth*|api|_next/static|_next/image|favicon-light.ico|favicon-dark.ico).*)'],
};

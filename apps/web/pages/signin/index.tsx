import jwt from 'jwt-decode';
import { useEffect } from 'react';
import getConfig from 'next/config';
import { useRouter } from 'next/router';

import { CONSTANTS, ROUTES } from '@config';
import { Signin } from '@components/signin';
import { OnboardLayout } from '@layouts/OnboardLayout';

const { publicRuntimeConfig } = getConfig();

export default function SigninPage() {
  const { query, push } = useRouter();

  useEffect(() => {
    if (query?.token) {
      localStorage.setItem(CONSTANTS.PROFILE_STORAGE_NAME, JSON.stringify(jwt(query.token as string)));
      if (query.showAddProject) {
        push(ROUTES.SIGNIN_ONBOARDING);
      } else push(ROUTES.HOME);
    }
  }, [query, push]);

  return <Signin API_URL={publicRuntimeConfig.NEXT_PUBLIC_API_BASE_URL} error={query?.error as string} />;
}

SigninPage.Layout = OnboardLayout;

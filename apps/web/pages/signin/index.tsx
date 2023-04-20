import jwt from 'jwt-decode';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

import { CONSTANTS, ROUTES } from '@config';
import { Signin } from '@components/signin';
import { OnboardLayout } from '@layouts/OnboardLayout';

interface SigninPageProps {
  API_URL: string;
}

export default function SigninPage({ API_URL }: SigninPageProps) {
  const { query, push } = useRouter();

  useEffect(() => {
    if (query?.token) {
      localStorage.setItem(CONSTANTS.PROFILE_STORAGE_NAME, JSON.stringify(jwt(query.token as string)));
      if (query.showAddProject) {
        push(ROUTES.SIGNIN_ONBOARDING);
      } else push(ROUTES.HOME);
    }
  }, [query, push]);

  return <Signin API_URL={API_URL} error={query?.error as string} />;
}

export function getServerSideProps() {
  return {
    props: {
      API_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    },
  };
}

SigninPage.Layout = OnboardLayout;

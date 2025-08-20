import jwt from 'jwt-decode';
import { useEffect } from 'react';
import getConfig from 'next/config';
import { useRouter } from 'next/router';

import { track } from '@libs/amplitude';
import { ROUTES } from '@config';
import { Signin } from '@components/signin';
import { OnboardLayout } from '@layouts/OnboardLayout';

const { publicRuntimeConfig } = getConfig();

export default function SigninPage() {
  const { query, push } = useRouter();

  useEffect(() => {
    if (query?.token) {
      const profileData = jwt<IProfileData>(query.token as string);
      track({
        name: 'GITHUB CONTINUE',
        properties: {
          email: profileData.email,
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          id: profileData._id,
          profilePicture: profileData.profilePicture,
        },
      });
      if (query.showAddProject) {
        (window as any).dataLayer?.push({ event: 'github_signup' });
        push(ROUTES.SIGNUP_ONBOARDING);
      } else push(ROUTES.HOME);
    }
  }, [query, push]);

  return (
    <OnboardLayout>
      <Signin API_URL={publicRuntimeConfig.NEXT_PUBLIC_API_BASE_URL} error={query?.error as string} />
    </OnboardLayout>
  );
}

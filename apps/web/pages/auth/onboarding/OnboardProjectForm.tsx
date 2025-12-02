import { useEffect, useRef } from 'react';
import { useOnboardUserProjectForm } from '@hooks/useOnboardUserProjectForm';
import { useAppState } from 'store/app.context';
import { capitalizeFirstLetter } from '@shared/utils';

export default function OnboardProjectForm() {
  const { profileInfo } = useAppState();
  const { onboardUser } = useOnboardUserProjectForm({});
  const hasSubmitted = useRef(false);

  useEffect(() => {
    if (!hasSubmitted.current && profileInfo?.firstName) {
      hasSubmitted.current = true;
      const defaultValues = {
        projectName: `${capitalizeFirstLetter(profileInfo.firstName)}'s Project`,
        companySize: '1-10',
        role: 'developer',
        source: 'search',
      };
      onboardUser(defaultValues);
    }
  }, [onboardUser, profileInfo?.firstName]);

  return null;
}

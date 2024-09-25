import { useMutation } from '@tanstack/react-query';

import { commonApi } from '@libs/api';
import { track } from '@libs/amplitude';
import { API_KEYS } from '@config';

interface UseLogoutProps {
  onLogout: () => void;
}

export function useLogout({ onLogout }: UseLogoutProps) {
  const { mutate: logout } = useMutation(() => commonApi(API_KEYS.LOGOUT as any, {}), {
    onSuccess: () => {
      track({ name: 'LOGOUT', properties: {} });
      onLogout();
    },
  });

  return {
    logout,
  };
}

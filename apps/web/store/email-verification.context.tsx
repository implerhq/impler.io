import { createContext, PropsWithChildren, useContext, useCallback, useState } from 'react';
import { useAppState } from './app.context';

interface EmailVerificationContextType {
  triggerWobble: () => void;
  isEmailVerified: boolean;
  isWobbling: boolean;
}

const EmailVerificationContext = createContext<EmailVerificationContextType | undefined>(undefined);

export function EmailVerificationProvider({ children }: PropsWithChildren) {
  const { profileInfo } = useAppState();
  const [isWobbling, setIsWobbling] = useState(false);

  const triggerWobble = useCallback(() => {
    if (!profileInfo?.isEmailVerified) {
      setIsWobbling(true);
      setTimeout(() => setIsWobbling(false), 500);
    }
  }, [profileInfo?.isEmailVerified]);

  return (
    <EmailVerificationContext.Provider
      value={{
        triggerWobble,
        isEmailVerified: profileInfo?.isEmailVerified || false,
        isWobbling,
      }}
    >
      {children}
    </EmailVerificationContext.Provider>
  );
}

export function useEmailVerification() {
  const context = useContext(EmailVerificationContext);
  if (!context) {
    throw new Error('useEmailVerification must be used within EmailVerificationProvider');
  }

  return context;
}

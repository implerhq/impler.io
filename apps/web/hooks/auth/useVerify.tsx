import { useRouter } from 'next/router';
import { useState, useEffect, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';

import { commonApi } from '@libs/api';
import { notify } from '@libs/notify';
import { useApp } from '@hooks/useApp';
import { API_KEYS, NOTIFICATION_KEYS, ROUTES } from '@config';
import { IErrorObject, IScreenResponse, SCREENS } from '@impler/shared';
import { handleRouteBasedOnScreenResponse } from '@shared/helpers';

interface IVerifyFormData {
  otp: string;
}

const RESEND_SECONDS = 10;

export function useVerify() {
  const { push } = useRouter();
  const { profile } = useApp();
  const timerRef = useRef<any>();
  const [countdown, setCountdown] = useState(RESEND_SECONDS);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const { mutate: verify, isLoading: isVerificationLoading } = useMutation<
    IScreenResponse,
    IErrorObject,
    IVerifyFormData
  >((body) => commonApi<IScreenResponse>(API_KEYS.VERIFY_EMAIL as any, { body }), {
    onSuccess: (data) => {
      handleRouteBasedOnScreenResponse(data.screen as SCREENS, push);
    },
    onError: (errorObject: IErrorObject) => {
      notify(NOTIFICATION_KEYS.OTP_CODE_RESENT_SUCCESSFULLY, {
        color: 'red',
        title: 'Verfication code is invalid!',
        message: errorObject.message,
      });
    },
  });

  const { mutate: resendOTP } = useMutation([API_KEYS.RESEND_OTP], () => commonApi(API_KEYS.RESEND_OTP as any, {}), {
    onSuccess: () => {
      notify(NOTIFICATION_KEYS.OTP_CODE_RESENT_SUCCESSFULLY, {
        color: 'green',
        title: 'Verification code sent!',
        message: (
          <>
            Verification code sent successully to <b>{profile?.email}</b>
          </>
        ),
      });

      setCountdown(RESEND_SECONDS);
      setIsButtonDisabled(true);
      timerRef.current = setInterval(onCountDownProgress, 1000);
    },
  });

  const onCountDownProgress = () => {
    setCountdown((prevCountdown) => {
      if (prevCountdown === 0) {
        setIsButtonDisabled(false); // Enable the button when countdown reaches zero
        clearInterval(timerRef.current);
      }

      return Math.max(0, prevCountdown - 1);
    });
  };

  useEffect(() => {
    timerRef.current = setInterval(onCountDownProgress, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (profile?.isEmailVerified) push(ROUTES.HOME);
  }, [profile, push]);

  return {
    verify,
    profile,
    resendOTP,
    countdown,
    isButtonDisabled,
    isVerificationLoading,
  };
}

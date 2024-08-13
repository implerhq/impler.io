import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useState, useEffect, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';

import { commonApi } from '@libs/api';
import { notify } from '@libs/notify';
import { useApp } from '@hooks/useApp';
import { API_KEYS, NOTIFICATION_KEYS } from '@config';
import { IErrorObject, IScreenResponse, SCREENS } from '@impler/shared';
import { handleRouteBasedOnScreenResponse } from '@shared/helpers';

interface IVerifyFormData {
  otp: string;
}

const RESEND_SECONDS = 120;
const OTP_LENGTH = 6;

export function useVerify() {
  const { push } = useRouter();
  const timerRef = useRef<any>();
  const [formError, setFormError] = useState<string>();
  const [countdown, setCountdown] = useState(RESEND_SECONDS);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [error, setError] = useState<IErrorObject | undefined>(undefined);

  const {
    control,
    handleSubmit,
    formState: {},
  } = useForm<IVerifyFormData>();

  const { profile } = useApp();

  const { mutate: verify, isLoading: isVerificationLoading } = useMutation<
    IScreenResponse,
    IErrorObject,
    IVerifyFormData
  >((body) => commonApi<IScreenResponse>(API_KEYS.VERIFY_EMAIL as any, { body }), {
    onSuccess: (data) => {
      handleRouteBasedOnScreenResponse(data.screen as SCREENS, push);
    },
    onError: (errorObject: IErrorObject) => {
      if (errorObject.error === 'OTPVerificationFailed') {
        setError(errorObject);
      }
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

  const handleVerify = handleSubmit((otpFormData: IVerifyFormData) => {
    if (!otpFormData.otp || otpFormData.otp.length !== OTP_LENGTH) {
      setFormError('Please enter a valid 6-digit OTP');

      return;
    }
    setFormError(undefined);
    verify(otpFormData);
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

  return {
    control,
    handleVerify,
    resendOTP,
    error,
    formError,
    setFormError,
    isVerificationLoading,
    isButtonDisabled,
    countdown,
  };
}

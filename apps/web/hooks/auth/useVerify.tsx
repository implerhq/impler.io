import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';

import { commonApi } from '@libs/api';
import { API_KEYS } from '@config';
import { IErrorObject, IScreenResponse, SCREENS } from '@impler/shared';
import { handleRouteBasedOnScreenResponse } from '@shared/helpers';

interface IVerifyFormData {
  otp: string;
}

export function useVerify() {
  const { push } = useRouter();
  const [error, setError] = useState<IErrorObject | undefined>(undefined);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const {
    control,
    handleSubmit,
    formState: {},
  } = useForm<IVerifyFormData>();

  const { mutate: verify, isLoading: isVerificationLoading } = useMutation<
    IScreenResponse,
    IErrorObject,
    IVerifyFormData
  >((body) => commonApi<IScreenResponse>(API_KEYS.VERIFY_EMAIL as any, { body }), {
    onSuccess: (data) => {
      if (!data) return;

      handleRouteBasedOnScreenResponse(data.screen as SCREENS, push);
    },
    onError: (errorObject: IErrorObject) => {
      if (errorObject.error === 'OTPVerificationFalid') {
        setError(errorObject);
      }
    },
  });

  const { refetch: resendOTP } = useQuery([API_KEYS.RESEND_OTP], () => commonApi(API_KEYS.RESEND_OTP as any, {}), {
    enabled: false,
    onSuccess: () => {
      setCountdown(120);
      setIsButtonDisabled(true);
    },
  });

  const handleVerify = handleSubmit((otpFormData: IVerifyFormData) => {
    verify(otpFormData);
  });

  const handleResendCode = () => {
    resendOTP();
  };

  useEffect(() => {
    if (countdown === 0) {
      setIsButtonDisabled(false);

      return;
    }

    const timer = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  return {
    control,
    handleVerify,
    handleResendCode,
    error,
    isVerificationLoading,
    isButtonDisabled,
    countdown,
  };
}

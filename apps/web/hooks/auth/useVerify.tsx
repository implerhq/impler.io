import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useState, useEffect, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { commonApi } from '@libs/api';
import { notify } from '@libs/notify';
import { useApp } from '@hooks/useApp';
import { API_KEYS, NOTIFICATION_KEYS } from '@config';
import { handleRouteBasedOnScreenResponse } from '@shared/helpers';
import { IErrorObject, IScreenResponse, SCREENS } from '@impler/shared';

interface IVerifyFormData {
  otp: string;
}
interface IUpdateEmailFormData {
  fullName: string;
  email: string;
  password: string;
}

enum ScreenStatesEnum {
  VERIFY = 'verify',
  UPDATE_EMAIL = 'updateEmail',
}

const RESEND_SECONDS = 10;

export function useVerify() {
  const { push } = useRouter();
  const { profile } = useApp();
  const timerRef = useRef<any>();
  const {
    reset,
    setError,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IUpdateEmailFormData>();
  const queryClient = useQueryClient();
  const [countdown, setCountdown] = useState(RESEND_SECONDS);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [state, setState] = useState<ScreenStatesEnum>(ScreenStatesEnum.VERIFY);

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
  const { mutate: updateEmail, isLoading: isUpdateEmailLoading } = useMutation<
    unknown,
    IErrorObject,
    IUpdateEmailFormData,
    (string | undefined)[]
  >([API_KEYS.UPDATE_ME_INFO], (data) => commonApi(API_KEYS.UPDATE_ME_INFO as any, { body: data }), {
    onSuccess: (_response, data) => {
      reset();
      setState(ScreenStatesEnum.VERIFY);
      queryClient.invalidateQueries([API_KEYS.ME]);
      notify(NOTIFICATION_KEYS.OTP_CODE_RESENT_SUCCESSFULLY, {
        color: 'green',
        title: 'Verification code sent!',
        message: (
          <>
            Verification code sent successully to <b>{data?.email}</b>
          </>
        ),
      });
    },
    onError(error) {
      setError('email', {
        type: 'manual',
        message: error.message,
      });
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

  return {
    state,
    verify,
    errors,
    profile,
    register,
    setState,
    resendOTP,
    countdown,
    ScreenStatesEnum,
    isButtonDisabled,
    isUpdateEmailLoading,
    isVerificationLoading,
    updateEmail: handleSubmit((data) => updateEmail(data)),
  };
}

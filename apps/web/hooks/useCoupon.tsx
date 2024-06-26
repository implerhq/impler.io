import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';

import { API_KEYS } from '@config';
import { commonApi } from '@libs/api';
import { IErrorObject } from '@impler/shared';

interface UseCouponProps {
  planCode: string;
}
interface CouponFormInputs {
  couponCode: string;
}

export function useCoupon({ planCode }: UseCouponProps) {
  const [appliedCouponCode, setAppliedCouponCode] = useState<string>();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<CouponFormInputs>();

  const { mutate: applyCoupon, isLoading: isApplyCouponLoading } = useMutation<any, IErrorObject, string>(
    [API_KEYS.APPLY_COUPON_CODE],
    (couponCode) => commonApi(API_KEYS.APPLY_COUPON_CODE as any, { parameters: [couponCode, planCode] }),
    {
      onSuccess: (coponCode) => {
        setAppliedCouponCode(coponCode.couponData.code);
      },
      onError: (error: IErrorObject) => {
        setError('couponCode', {
          message: error.message,
        });
      },
    }
  );
  const applyCouponSubmit = (coponData: CouponFormInputs) => applyCoupon(coponData.couponCode);

  return {
    errors,
    register,
    applyCoupon,
    handleSubmit,
    appliedCouponCode,
    applyCouponSubmit,
    setAppliedCouponCode,
    isApplyCouponLoading,
  };
}

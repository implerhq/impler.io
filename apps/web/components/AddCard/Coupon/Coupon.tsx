import React from 'react';
import { Alert, Group, TextInput } from '@mantine/core';
import { CheckIcon } from '@assets/icons/Check.icon';
import { useCoupon } from '@hooks/useCoupon';
import { Button } from '@ui/button';

interface CouponProps {
  planCode: string;
  couponCode: string | undefined;
  setAppliedCouponCode: (couponCode?: string) => void;
}

export const Coupon = ({ planCode, couponCode, setAppliedCouponCode }: CouponProps) => {
  const { register, errors, applyCouponSubmit, handleSubmit, isApplyCouponLoading } = useCoupon({
    planCode,
    setAppliedCouponCode,
  });

  return (
    <div>
      {couponCode ? (
        <Alert
          fw="bolder"
          color="green"
          variant="outline"
          withCloseButton
          onClose={() => setAppliedCouponCode(undefined)}
          icon={<CheckIcon color="white" size="md" />}
        >
          {`Coupon ${couponCode} is applied!`}
        </Alert>
      ) : (
        <form onSubmit={handleSubmit(applyCouponSubmit)}>
          <Group spacing={0} align="flex-start">
            <TextInput
              placeholder="Enter coupon code"
              style={{ flexGrow: 1 }}
              {...register('couponCode')}
              error={errors.couponCode?.message}
            />
            <Button type="submit" compact loading={isApplyCouponLoading}>
              Apply
            </Button>
          </Group>
        </form>
      )}
    </div>
  );
};

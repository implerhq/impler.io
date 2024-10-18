import React from 'react';
import { Checkbox, Flex, Text, Center } from '@mantine/core';
import { Button } from '@ui/button';
import { useForm, Controller } from 'react-hook-form';
import { useCancelPlan } from '@hooks/useCancelPlan';
import { useAppState } from 'store/app.context';
import { modals } from '@mantine/modals';
import { PlanCancelDetails } from './illustrations/PlanCancelDetails';
import { MEMBERSHIP_CANCELLATION_REASONS } from '@config';

type FormData = {
  reasons: string[];
};

export function CancelSubscriptionModal() {
  const { profileInfo } = useAppState();
  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: { reasons: [] },
  });
  const { cancelPlan, isCancelPlanLoading } = useCancelPlan({
    email: profileInfo!.email,
  });

  const onSubmit = () => {
    cancelPlan();
  };

  return (
    <>
      <Text size="xl" weight={700} align="center">
        Cancel Subscription
      </Text>

      <Center>
        <PlanCancelDetails />
      </Center>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Text weight={500} mb="xs">
          Reasons
        </Text>
        <Flex direction="column" gap="xs">
          {MEMBERSHIP_CANCELLATION_REASONS.map((reason) => (
            <Controller
              key={reason}
              name="reasons"
              control={control}
              render={({ field }) => (
                <Checkbox
                  label={reason}
                  value={reason}
                  checked={field.value.includes(reason)}
                  onChange={() => {
                    const newReasons = field.value.includes(reason)
                      ? field.value.filter((resn) => resn !== reason)
                      : [...field.value, reason];
                    field.onChange(newReasons);
                  }}
                />
              )}
            />
          ))}
        </Flex>

        <Flex mt="xl" gap="md">
          <Button onClick={() => modals.closeAll()} fullWidth variant="outline">
            Close
          </Button>
          <Button type="submit" loading={isCancelPlanLoading} fullWidth>
            Cancel Subscription
          </Button>
        </Flex>
      </form>
    </>
  );
}

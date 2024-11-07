import React from 'react';
import { Checkbox, Flex, Text, Center, Stack } from '@mantine/core';
import { Button } from '@ui/button';
import { Controller } from 'react-hook-form';
import { modals } from '@mantine/modals';
import { PlanCancelDetails } from './illustrations/PlanCancelDetails';
import { colors } from '@config';
import { MEMBERSHIP_CANCELLATION_REASONS } from '@impler/shared';

interface CancelSubscriptionModalProps {
  control: any;
  handleSubmit: any;
  isCancelPlanLoading: boolean;
}

export function CancelSubscriptionModal({ control, handleSubmit, isCancelPlanLoading }: CancelSubscriptionModalProps) {
  return (
    <Stack spacing="lg">
      <Text color={colors.white} size="md" weight={700} align="center">
        Cancel Subscription
      </Text>

      <Center>
        <PlanCancelDetails />
      </Center>

      <form onSubmit={handleSubmit}>
        <Flex direction="column" gap="xs">
          <Text color={colors.white} weight={600}>
            Reasons
          </Text>
          {MEMBERSHIP_CANCELLATION_REASONS.map((reason) => (
            <Controller
              key={reason}
              name="reasons"
              control={control}
              render={({ field }) => (
                <Checkbox
                  label={<Text color="white">{reason}</Text>}
                  value={reason}
                  checked={Array.isArray(field.value) && field.value.includes(reason)}
                  onChange={() => {
                    const newReasons = Array.isArray(field.value)
                      ? field.value.includes(reason)
                        ? field.value.filter((item) => item !== reason)
                        : [...field.value, reason]
                      : [reason];
                    field.onChange(newReasons);
                  }}
                />
              )}
            />
          ))}
        </Flex>

        <Flex mt="sm" gap="md">
          <Button onClick={() => modals.closeAll()} fullWidth variant="outline">
            Close
          </Button>
          <Button type="submit" loading={isCancelPlanLoading} fullWidth>
            Cancel Subscription
          </Button>
        </Flex>
      </form>
    </Stack>
  );
}

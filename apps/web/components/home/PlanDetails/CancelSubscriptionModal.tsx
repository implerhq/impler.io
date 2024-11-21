import React from 'react';
import { Checkbox, Flex, Text, Center, Stack } from '@mantine/core';
import { Button } from '@ui/button';
import { Controller } from 'react-hook-form';

import { PlanCancelIllustration } from './illustrations/PlanCancelIllustration';

import { colors, MEMBERSHIP_CANCELLATION_REASONS } from '@config';

interface CancelSubscriptionModalProps {
  control: any;
  handleSubmit: any;
  isCancelPlanLoading: boolean;
  errors: any;
  onClose: () => void;
}

export function CancelSubscriptionModal({
  control,
  handleSubmit,
  isCancelPlanLoading,
  onClose,
}: CancelSubscriptionModalProps) {
  return (
    <Stack spacing="lg">
      <Text color={colors.white} size="md" weight={700} align="center">
        Cancel Subscription
      </Text>

      <Center>
        <PlanCancelIllustration />
      </Center>

      <form onSubmit={handleSubmit}>
        <Flex direction="column" gap="xs">
          <Text color={colors.white} weight={600}>
            Can you let us know the reason for cancellation ?
          </Text>

          <Controller
            name="reasons"
            control={control}
            rules={{
              validate: (value) => (value && value.length > 0) || 'Please select at least one reason for cancellation.',
            }}
            render={({ field, fieldState }) => (
              <>
                {MEMBERSHIP_CANCELLATION_REASONS.map((reason) => (
                  <Checkbox
                    key={reason}
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
                ))}
                {fieldState.invalid && fieldState.error && (
                  <Text color="red" size="sm" weight={500}>
                    {fieldState.error.message}
                  </Text>
                )}
              </>
            )}
          />
        </Flex>

        <Flex mt="sm" gap="md">
          <Button onClick={onClose} fullWidth variant="outline">
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

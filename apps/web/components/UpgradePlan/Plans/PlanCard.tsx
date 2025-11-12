import React, { useEffect, useState } from 'react';
import { plansApi, useSubscription } from 'subos-frontend';
import { Card, Text, Badge, Stack, Divider, LoadingOverlay } from '@mantine/core';
import { Button } from '@ui/button';
import { colors, NOTIFICATION_KEYS, PLANCODEENUM, ROUTES } from '@config';
import { Plan } from './Plans';
import { PlanFeature } from './PlanFeature';
import useStyles from './Plans.styles';
import { useAppState } from 'store/app.context';
import { notify } from '@libs/notify';

interface PlanCardProps {
  plan: Plan;
  isYearly: boolean;
}

export function PlanCard({ plan, isYearly }: PlanCardProps) {
  const { profileInfo } = useAppState();
  const { classes } = useStyles();
  const { createPaymentSession } = plansApi;
  const [isLoading, setIsLoading] = useState(false);
  const { subscription, fetchSubscription } = useSubscription();

  useEffect(() => {
    const loadSubscription = async () => {
      if (!profileInfo?.email) return;

      try {
        setIsLoading(true);
        await fetchSubscription(profileInfo.email);
      } catch (err: any) {
        notify(NOTIFICATION_KEYS.ERROR_FETCHING_SUBSCRIPTION_DETAILS, {
          title: 'Failed to fetch subscription',
          message: err?.message,
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadSubscription();
  }, [profileInfo?.email]);

  const handlePaymentSession = async () => {
    setIsLoading(true);
    try {
      const response = await createPaymentSession(plan.code, {
        returnUrl: `${window.location.origin}${ROUTES.SUBSCRIPTION_STATUS}`,
        externalId: profileInfo?.email,
        cancelUrl: `${window.location.origin}${ROUTES.PAYMENT_CANCEL}`,
      });
      if (response?.success && response?.data?.checkoutUrl) {
        window.location.href = response?.data?.checkoutUrl;

        return response;
      }

      return null;
    } catch (err: any) {
      notify(NOTIFICATION_KEYS.ERROR_CREATE_CHECKOUT_SESSION, {
        title: 'Failed to create the checkout session',
        message: err?.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card
      style={{ width: '800px', position: 'relative' }}
      shadow="sm"
      withBorder
      bg={
        plan.code === PLANCODEENUM.GROWTH || plan.code === PLANCODEENUM.GROWTH_YEARLY ? colors.black : colors.faintGrey
      }
    >
      <LoadingOverlay visible={isLoading} overlayBlur={2} />
      <Stack mt="md">
        {(plan.code === PLANCODEENUM.GROWTH || plan.code === PLANCODEENUM.GROWTH_YEARLY) && (
          <Badge color="blue" variant="gradient" className={classes.recommendedBadge}>
            Recommended
          </Badge>
        )}
        <Text className={classes.planName}>{plan.name}</Text>
        <Text className={classes.planPrice}>
          {plan.price === 0 ? 'Free' : `$${plan.price} / ${isYearly ? 'year' : 'month'}`}
        </Text>
        <Button
          className={classes.button}
          fullWidth
          onClick={handlePaymentSession}
          disabled={plan.code === PLANCODEENUM.STARTER || subscription?.plan?.code === plan.code || isLoading}
        >
          {subscription?.plan.code === plan.code ? 'Active Plan' : 'Choose Plan'}
        </Button>
        <Divider />
      </Stack>
      <Stack spacing={10}>
        <Divider />
        {Object.entries(plan.content).map(([category, items], categoryIndex) => (
          <React.Fragment key={category}>
            {category !== 'Features' && <Text>{category}</Text>}
            {items.map(({ check, title, tooltipLink }, index) => (
              <PlanFeature key={`${category}-${index}`} included={check} value={title} tooltipLink={tooltipLink} />
            ))}
            {category !== 'Features' && categoryIndex < Object.keys(plan.content).length - 1 && <Divider my={5} />}
          </React.Fragment>
        ))}
      </Stack>
    </Card>
  );
}

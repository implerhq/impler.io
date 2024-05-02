import getConfig from 'next/config';
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Switch, Stack, Table, Button, Text } from '@mantine/core';

import { TickIcon } from '@assets/icons/Tick.icon';
import { CrossIcon } from '@assets/icons/Cross.icon';

import useStyles from './Plans.styles';
import { numberFormatter } from '@impler/shared';
import { useCancelPlan } from '@hooks/useCancelPlan';

interface PlansProps {
  profile: IProfileData;
  activePlanCode?: string;
}

interface PlanItem {
  name: string;
  code: string;
  price: number;
  yearlyPrice: number;
  rowsIncluded: number;
  removeBranding: boolean;
  extraChargeOverheadTenThusandRecords?: number;
}

export const Plans = ({ profile, activePlanCode }: PlansProps) => {
  const router = useRouter();
  const { classes } = useStyles();
  const { publicRuntimeConfig } = getConfig();
  const [showYearly, setShowYearly] = useState<boolean>(true);
  const gatewayURL = publicRuntimeConfig.NEXT_PUBLIC_PAYMENT_GATEWAY_URL;
  const plans: Record<string, PlanItem[]> = {
    monthly: [
      {
        name: 'Starter (Defualt)',
        code: 'STARTER',
        rowsIncluded: 5000,
        price: 0,
        yearlyPrice: 0,
        extraChargeOverheadTenThusandRecords: 1,
        removeBranding: false,
      },
      {
        name: 'Growth',
        code: 'GROWTH-MONTHLY',
        price: 42,
        yearlyPrice: 0,
        rowsIncluded: 500000,
        extraChargeOverheadTenThusandRecords: 0.7,
        removeBranding: true,
      },
      {
        name: 'Scale',
        code: 'SCALE-MONTHLY',
        price: 90,
        yearlyPrice: 0,
        rowsIncluded: 1500000,
        extraChargeOverheadTenThusandRecords: 0.5,
        removeBranding: true,
      },
    ],
    yearly: [
      {
        name: 'Growth',
        code: 'GROWTH-YEARLY',
        price: 35,
        yearlyPrice: 420,
        rowsIncluded: 6000000,
        extraChargeOverheadTenThusandRecords: 0.7,
        removeBranding: true,
      },
      {
        name: 'Scale',
        code: 'SCALE-YEARLY',
        price: 75,
        yearlyPrice: 900,
        rowsIncluded: 18000000,
        extraChargeOverheadTenThusandRecords: 0.5,
        removeBranding: true,
      },
    ],
  };
  const { cancelPlan, isCancelPlanLoading } = useCancelPlan({ email: profile.email });

  const onPlanButtonClick = (code: string) => {
    if (activePlanCode === code) {
      cancelPlan();
    } else {
      // activate plan
      router.push(`${gatewayURL}/api/v1/plans/${code}/buy/${profile.email}/redirect`);
    }
  };

  return (
    <Stack align="center" spacing="md">
      <Switch
        size="xl"
        checked={showYearly}
        offLabel={<Text size="md">Monthly</Text>}
        onLabel={<Text size="md">Yearly (20% Off)</Text>}
        onChange={(event) => setShowYearly(event.currentTarget.checked)}
      />
      <Table className={classes.table} fontSize="md" striped withBorder withColumnBorders>
        <thead>
          <tr>
            <th>
              <Text fw="bold">Name</Text>
            </th>
            {plans[showYearly ? 'yearly' : 'monthly'].map((plan, index) => (
              <th key={index}>{plan.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Price</td>
            {plans[showYearly ? 'yearly' : 'monthly'].map((plan, index) => (
              <td key={index}>
                {plan.price ? (
                  <Text>
                    {showYearly && plan.yearlyPrice ? (
                      <Text>
                        <Text fw="bold" component="span" size="xl" inline>{`$${plan.yearlyPrice}`}</Text> / year
                      </Text>
                    ) : (
                      <>
                        <Text fw="bold" component="span" size="xl" inline>{`$${plan.price}`}</Text> / month
                      </>
                    )}
                  </Text>
                ) : (
                  <Text fw="bold" size="xl">
                    Free
                  </Text>
                )}
              </td>
            ))}
          </tr>

          <tr>
            <td>Rows Included</td>
            {plans[showYearly ? 'yearly' : 'monthly'].map((plan, index) => (
              <td key={index}>{numberFormatter(plan.rowsIncluded)}</td>
            ))}
          </tr>
          <tr>
            <td>For extra 10K records</td>
            {plans[showYearly ? 'yearly' : 'monthly'].map((plan, index) => (
              <td key={index}>
                {plan.extraChargeOverheadTenThusandRecords
                  ? `$${plan.extraChargeOverheadTenThusandRecords} (Billed monthly)`
                  : 'Not Available'}
              </td>
            ))}
          </tr>
          <tr>
            <td>Theming</td>
            {plans[showYearly ? 'yearly' : 'monthly'].map((plan, index) => (
              <td key={index}>
                <TickIcon />
              </td>
            ))}
          </tr>
          <tr>
            <td>Projects</td>
            {plans[showYearly ? 'yearly' : 'monthly'].map((plan, index) => (
              <td key={index}>Unlimited</td>
            ))}
          </tr>
          <tr>
            <td>Remove Branding</td>
            {plans[showYearly ? 'yearly' : 'monthly'].map((plan, index) => (
              <td key={index}>{plan.removeBranding ? <TickIcon /> : <CrossIcon size="lg" />}</td>
            ))}
          </tr>

          <tr>
            <td>Custom Validation</td>
            {plans[showYearly ? 'yearly' : 'monthly'].map((plan, index) => (
              <td key={index}>
                <TickIcon />
              </td>
            ))}
          </tr>
          <tr>
            <td>Output Customization</td>
            {plans[showYearly ? 'yearly' : 'monthly'].map((plan, index) => (
              <td key={index}>
                <TickIcon />
              </td>
            ))}
          </tr>
          <tr>
            <td></td>
            {plans[showYearly ? 'yearly' : 'monthly'].map((plan, index) => (
              <td key={index}>
                {plan.code === 'STARTER' ? null : (
                  <Button
                    component="a"
                    variant="filled"
                    loading={isCancelPlanLoading}
                    color={activePlanCode === plan.code ? 'red' : 'blue'}
                    onClick={() => onPlanButtonClick(plan.code)}
                  >
                    {activePlanCode === plan.code ? 'Cancel Plan' : 'Activate Plan'}
                  </Button>
                )}
              </td>
            ))}
          </tr>
        </tbody>
      </Table>
    </Stack>
  );
};

import getConfig from 'next/config';
import React, { useState } from 'react';
import { Switch, Stack, Table, Button, Text } from '@mantine/core';

import { CrossIcon } from '@assets/icons/Cross.icon';
import { numberFormatter } from '@impler/shared';
import { TickIcon } from '@assets/icons/Tick.icon';

import useStyles from './Plans.styles';

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
  const { classes } = useStyles();
  const plans: Record<string, PlanItem[]> = {
    monthly: [
      {
        name: 'Sandbox (Default)',
        code: 'SANDBOX',
        rowsIncluded: 5000,
        price: 0,
        yearlyPrice: 0,
        removeBranding: false,
      },
      {
        name: 'Starter',
        code: 'STARTER-MONTHLY',
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
        name: 'Sandbox  (Default)',
        code: 'SANDBOX',
        rowsIncluded: 5000,
        price: 0,
        yearlyPrice: 0,
        removeBranding: false,
      },
      {
        name: 'Starter',
        code: 'STARTER-YEARLY',
        price: 0,
        yearlyPrice: 0,
        rowsIncluded: 5000,
        extraChargeOverheadTenThusandRecords: 1,
        removeBranding: false,
      },
      {
        name: 'Growth',
        code: 'GROWTH-YEARLY',
        price: 35,
        yearlyPrice: 420,
        rowsIncluded: 500000,
        extraChargeOverheadTenThusandRecords: 0.7,
        removeBranding: true,
      },
      {
        name: 'Scale',
        code: 'SCALE-YEARLY',
        price: 75,
        yearlyPrice: 900,
        rowsIncluded: 1500000,
        extraChargeOverheadTenThusandRecords: 0.5,
        removeBranding: true,
      },
    ],
  };

  const { publicRuntimeConfig } = getConfig();
  const gatewayURL = publicRuntimeConfig.NEXT_PUBLIC_PAYMENT_GATEWAY_URL;
  const [showYearly, setShowYearly] = useState<boolean>(true);

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
                {plan.code === 'SANDBOX' ? null : (
                  <Button
                    component="a"
                    variant="filled"
                    color={activePlanCode === plan.code ? 'red' : 'blue'}
                    href={`${gatewayURL}/api/v1/plans/${plan.code}/buy/${profile.email}/redirect`}
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

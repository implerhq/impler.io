import getConfig from 'next/config';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { modals } from '@mantine/modals';
import { Switch, Stack, Table, Button, Text } from '@mantine/core';

import { MODAL_KEYS } from '@config';
import useStyles from './Plans.styles';
import { numberFormatter } from '@impler/shared';
import { TickIcon } from '@assets/icons/Tick.icon';
import { CrossIcon } from '@assets/icons/Cross.icon';
import { useCancelPlan } from '@hooks/useCancelPlan';
import { SelectCardModal } from '@components/settings';

interface PlansProps {
  profile: IProfileData;
  activePlanCode?: string;
  canceledOn?: Date;
  expiryDate: Date;
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

const plans: Record<string, PlanItem[]> = {
  monthly: [
    {
      name: 'Starter (Default)',
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
      name: 'Starter (Default)',
      code: 'STARTER',
      rowsIncluded: 5000,
      price: 0,
      yearlyPrice: 0,
      extraChargeOverheadTenThusandRecords: 1,
      removeBranding: false,
    },
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

export const Plans = ({ profile, activePlanCode, canceledOn, expiryDate }: PlansProps) => {
  const router = useRouter();
  const { classes } = useStyles();
  const { publicRuntimeConfig } = getConfig();
  const [showYearly, setShowYearly] = useState<boolean>(true);
  const defaultPaymentGateway = publicRuntimeConfig.NEXT_PUBLIC_DEFAULT_PAYMENT_GATEWAY;
  const paymentGatewayURL = publicRuntimeConfig.NEXT_PUBLIC_PAYMENT_GATEWAY_URL;
  const { cancelPlan, isCancelPlanLoading } = useCancelPlan({ email: profile.email });

  const onPlanButtonClick = (code: string) => {
    if (defaultPaymentGateway === 'RAZORPAY') {
      router.push(
        `${paymentGatewayURL}/api/v1/plans/${code}/buy/${profile.email}/redirect/?gateway=${defaultPaymentGateway}`
      );
    }
    if (activePlanCode === code) {
      cancelPlan();
    } else {
      modals.open({
        size: '2xl',
        withCloseButton: false,
        id: MODAL_KEYS.SELECT_CARD,
        modalId: MODAL_KEYS.SELECT_CARD,
        children: <SelectCardModal email={profile.email} planCode={code} onClose={modals.closeAll} />,
      });
    }
  };

  const getButtonTextContent = (planCode: string) => {
    if (canceledOn !== null && activePlanCode === planCode) {
      return `Cancelled On ${canceledOn}`;
    }

    return activePlanCode === planCode ? 'Cancel Plan' : 'Activate Plan';
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
                  <>
                    <Button
                      variant="filled"
                      loading={isCancelPlanLoading}
                      color={activePlanCode === plan.code ? 'red' : 'blue'}
                      onClick={() => onPlanButtonClick(plan.code)}
                      disabled={canceledOn !== null && activePlanCode === plan.code}
                    >
                      {getButtonTextContent(plan.code)}
                    </Button>
                    {canceledOn !== null && activePlanCode === plan.code && expiryDate && (
                      <Text size="sm" mt={2}>
                        {`Expiring on ${expiryDate}`}
                      </Text>
                    )}
                  </>
                )}
              </td>
            ))}
          </tr>
        </tbody>
      </Table>
    </Stack>
  );
};

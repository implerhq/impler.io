import { modals } from '@mantine/modals';
import React, { ChangeEvent, useState } from 'react';
import { Switch, Stack, Table, Button, Text, Group, useMantineColorScheme } from '@mantine/core';

import useStyles from './Plans.styles';
import { Badge } from '@ui/badge';
import { track } from '@libs/amplitude';
import { numberFormatter } from '@impler/shared';
import { TickIcon } from '@assets/icons/Tick.icon';
import { CrossIcon } from '@assets/icons/Cross.icon';
import { useCancelPlan } from '@hooks/useCancelPlan';
import { SelectCardModal } from '@components/settings';
import { TooltipLink } from '@components/guide-point';
import { DOCUMENTATION_REFERENCE_LINKS, MODAL_KEYS, colors } from '@config';

interface PlansProps {
  profile: IProfileData;
  activePlanCode?: string;
  canceledOn?: Date;
  expiryDate?: Date;
}

interface PlanItem {
  name: string;
  code: string;
  price: number;
  seats: number;
  yearlyPrice: number;
  autoImport: boolean;
  imageImport: boolean;
  rowsIncluded: number;
  removeBranding: boolean;
  advancedValidations: boolean;
  extraChargeOverheadTenThusandRecords?: number;
}

const plans: Record<string, PlanItem[]> = {
  monthly: [
    {
      name: 'Starter (Default)',
      code: 'STARTER',
      rowsIncluded: 5000,
      price: 0,
      seats: 1,
      yearlyPrice: 0,
      autoImport: false,
      imageImport: false,
      extraChargeOverheadTenThusandRecords: 1,
      removeBranding: false,
      advancedValidations: false,
    },
    {
      name: 'Growth',
      code: 'GROWTH-MONTHLY',
      price: 42,
      yearlyPrice: 0,
      seats: 4,
      autoImport: false,
      imageImport: false,
      advancedValidations: true,
      rowsIncluded: 500000,
      extraChargeOverheadTenThusandRecords: 0.7,
      removeBranding: true,
    },
    {
      name: 'Scale',
      code: 'SCALE-MONTHLY',
      price: 90,
      seats: 10,
      autoImport: true,
      imageImport: true,
      advancedValidations: true,
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
      seats: 1,
      autoImport: false,
      imageImport: false,
      advancedValidations: false,
      yearlyPrice: 0,
      extraChargeOverheadTenThusandRecords: 1,
      removeBranding: false,
    },
    {
      name: 'Growth',
      code: 'GROWTH-YEARLY',
      price: 35,
      seats: 4,
      autoImport: false,
      imageImport: false,
      advancedValidations: true,
      yearlyPrice: 420,
      rowsIncluded: 6000000,
      extraChargeOverheadTenThusandRecords: 0.7,
      removeBranding: true,
    },
    {
      name: 'Scale',
      code: 'SCALE-YEARLY',
      price: 75,
      seats: 10,
      advancedValidations: true,
      autoImport: true,
      imageImport: true,
      yearlyPrice: 900,
      rowsIncluded: 18000000,
      extraChargeOverheadTenThusandRecords: 0.5,
      removeBranding: true,
    },
  ],
};

export const Plans = ({ profile, activePlanCode, canceledOn, expiryDate }: PlansProps) => {
  const { classes } = useStyles();
  const theme = useMantineColorScheme();
  const [showYearly, setShowYearly] = useState<boolean>(true);
  const { cancelPlan, isCancelPlanLoading } = useCancelPlan({ email: profile.email });
  const onPlanButtonClick = (code: string) => {
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
  const onPlanDurationToggleClick = (event: ChangeEvent<HTMLInputElement>) => {
    setShowYearly(event.currentTarget.checked);
    track({
      name: 'PLAN TOGGLE DURATION',
      properties: {
        yearly: event.currentTarget.checked,
      },
    });
  };
  const getButtonTextContent = (planCode: string) => {
    if (canceledOn !== null && activePlanCode === planCode) {
      return (
        <Text color={theme.colorScheme === 'dark' ? colors.BGPrimaryLight : colors.BGPrimaryDark}>
          Cancelled On {canceledOn?.toString()}
        </Text>
      );
    }

    return activePlanCode === planCode ? 'Cancel Plan' : 'Activate Plan';
  };

  return (
    <Stack align="center" spacing="md">
      <Group>
        <Text weight={700} size="sm">
          Monthly
        </Text>
        <Switch size="md" checked={showYearly} onChange={onPlanDurationToggleClick} />
        <Text weight={700} size="sm">
          Yearly
        </Text>
        <Badge color="cyan" size="lg" variant={showYearly ? 'filled' : 'light'}>
          <Text color={colors.BGPrimaryLight}>Save 20% </Text>
        </Badge>
      </Group>
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
                  ? `$${plan.extraChargeOverheadTenThusandRecords} (Billed ${showYearly ? 'yearly' : 'monthly'})`
                  : 'Not Available'}
              </td>
            ))}
          </tr>
          <tr>
            <td>Team Members</td>
            {plans[showYearly ? 'yearly' : 'monthly'].map((plan, index) => (
              <td key={index}>{plan.seats}</td>
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
            <td>
              Custom Validation <TooltipLink link={DOCUMENTATION_REFERENCE_LINKS.customValidation} />
            </td>
            {plans[showYearly ? 'yearly' : 'monthly'].map((plan, index) => (
              <td key={index}>
                <TickIcon />
              </td>
            ))}
          </tr>
          <tr>
            <td>
              Output Customization <TooltipLink link={DOCUMENTATION_REFERENCE_LINKS.outputCustomization} />
            </td>
            {plans[showYearly ? 'yearly' : 'monthly'].map((plan, index) => (
              <td key={index}>
                <TickIcon />
              </td>
            ))}
          </tr>
          <tr>
            <td>Remove Branding</td>
            {plans[showYearly ? 'yearly' : 'monthly'].map((plan, index) => (
              <td key={index}>{plan.removeBranding ? <TickIcon /> : <CrossIcon size="lg" />}</td>
            ))}
          </tr>
          <tr>
            <td>
              Advanced Validations <TooltipLink link={DOCUMENTATION_REFERENCE_LINKS.advancedValidations} />
            </td>
            {plans[showYearly ? 'yearly' : 'monthly'].map((plan, index) => (
              <td key={index}>{plan.advancedValidations ? <TickIcon /> : <CrossIcon size="lg" />}</td>
            ))}
          </tr>
          <tr>
            <td>
              Auto Import <TooltipLink link={DOCUMENTATION_REFERENCE_LINKS.autoImport} />
            </td>
            {plans[showYearly ? 'yearly' : 'monthly'].map((plan, index) => (
              <td key={index}>{plan.autoImport ? <TickIcon /> : <CrossIcon size="lg" />}</td>
            ))}
          </tr>
          <tr>
            <td>
              Image Import <TooltipLink link={DOCUMENTATION_REFERENCE_LINKS.imageImport} />
            </td>
            {plans[showYearly ? 'yearly' : 'monthly'].map((plan, index) => (
              <td key={index}>{plan.imageImport ? <TickIcon /> : <CrossIcon size="lg" />}</td>
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

import React from 'react';
import getConfig from 'next/config';
import { Text, Button, Stack } from '@mantine/core';
import { numberFormatter } from '@impler/shared';
import CrossIcon from '@assets/icons/Cross-filled.Icon';
import { TickIcon } from '@assets/icons/Tick.icon';
import { colors } from '@config';

const { publicRuntimeConfig } = getConfig();

interface PlanProps {
  name: string;
  rowsIncluded: number;
  price?: number;
  yearlyPrice?: number;
  planCode?: string;
  isActive?: boolean;
  userProfile: IProfileData;
  showButton: boolean;
  extraCharge: number;
  removeBranding: boolean;
  customValidation: boolean;
  outputCustomization: boolean;
  switchPlans?: boolean;
}

export const Plan = ({
  name,
  planCode,
  rowsIncluded,
  price,
  yearlyPrice,
  isActive,
  userProfile,
  showButton,
  extraCharge,
  removeBranding,
  customValidation,
  outputCustomization,
  switchPlans,
}: PlanProps) => {
  return (
    <Stack m="0" w={500} h="100%" p={20} style={{ backgroundColor: colors.BGPrimaryDark }}>
      <Stack spacing="xs" style={{ flexGrow: 1 }} h="100%">
        <Text weight={800} size="xl" align="center" mb="xs">
          {name}
        </Text>
        <Text weight={700} size="xl" align="center" mb="xs">
          {'At :$' + price}
        </Text>

        {switchPlans ? (
          <Text weight={700} size="xl" align="center" mb="xs">
            Billed at: $${yearlyPrice} per year`
          </Text>
        ) : null}

        {extraCharge ? (
          <Text align="center" weight={700}>
            ${extraCharge} Per Extra 10K Records (Billed monthly)
          </Text>
        ) : null}

        <Text align="center" weight={700} style={{ flexGrow: 1 }}>
          No of Rows, {numberFormatter(rowsIncluded)}
        </Text>

        <Text align="center" weight={700}>
          Remove Branding, {removeBranding ? <TickIcon /> : <CrossIcon />}
        </Text>

        <Text align="center" weight={700}>
          Custom Validation, {customValidation ? <TickIcon /> : <CrossIcon />}
        </Text>

        <Text align="center" weight={700}>
          Output Customization, {outputCustomization ? <TickIcon /> : <CrossIcon />}
        </Text>
      </Stack>
      {showButton && (
        <Button
          component="a"
          variant="filled"
          color={isActive ? 'red' : 'blue'}
          href={`${publicRuntimeConfig.NEXT_PUBLIC_PAYMENT_GATEWAY_URL}/api/v1/plans/${planCode}/buy/${userProfile.email}/redirect`}
          fullWidth
        >
          {isActive ? 'Cancel Plan' : 'Activate Plan'}
        </Button>
      )}
    </Stack>
  );
};

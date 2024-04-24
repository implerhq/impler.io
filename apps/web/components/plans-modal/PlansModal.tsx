import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Paper, Text, Flex, Switch, Stack, Title, Container } from '@mantine/core';

import { commonApi } from '@libs/api';
import { API_KEYS } from '@config';
import { Button } from '@ui/button';
import { IErrorObject } from '@impler/shared';

interface PlansModalProps {
  profile: IProfileData;
  title: string;
}

const PAYMENT_GATEWAY_URL = process.env.NEXT_PUBLIC_PAYMENT_GATEWAY_URL;

const PlansModal = ({ title, profile }: PlansModalProps) => {
  const { data } = useQuery<unknown, IErrorObject, ISubscriptionData, [string]>(
    [API_KEYS.FETCH_ACTIVE_SUBSCRIPTION],
    () =>
      commonApi<any>(API_KEYS.FETCH_ACTIVE_SUBSCRIPTION as any, {
        baseUrl: PAYMENT_GATEWAY_URL,
        headers: {
          auth: 'auth',
        },
        parameters: [profile.email],
      })
  );

  const [switchPlans, setSwitchPlans] = useState<boolean>(false);

  const plans = {
    monthly: [
      {
        name: 'Starter',
        code: 'starter-monthly',
        rowsIncluded: '5K',
        price: 0,
      },
      {
        name: 'Growth',
        code: 'growth-monthly',
        price: '$42',
        rowsIncluded: '500K',
      },
      {
        name: 'Scale',
        code: 'scale-monthly',
        price: '$90',
        rowsIncluded: '1500K',
      },
    ],
    yearly: [
      {
        name: 'Starter',
        code: 'starter-yearly',
        price: '$0',
        rowsIncluded: '5K',
      },
      {
        name: 'Growth',
        code: 'growth-yearly',
        price: '$35',
        rowsIncluded: '500K',
      },
      {
        name: 'Scale',
        description: 'scale-yearly',
        price: '$75',
        rowsIncluded: '1500K',
      },
    ],
  };

  return (
    <Container fluid={true}>
      <Stack align="center">
        <Title order={2} align="center">
          {title}
        </Title>

        <Switch
          size="lg"
          label="Yearly"
          checked={switchPlans}
          onChange={(event) => setSwitchPlans(event.currentTarget.checked)}
        />
        <Flex gap="xl" direction="row" justify="flex-end" align="center" maw="100%">
          {plans[switchPlans ? 'yearly' : 'monthly'].map((plan, index) => (
            <Paper key={index} shadow="lg" m="0" radius="sm" w={300} h={250} mb={20} p={20}>
              <Flex direction="column" gap="60" justify="flex-end" h="100%">
                <Text weight={800} size="xl" align="center" mb="xs">
                  {plan.name}
                </Text>
                <Text weight={500} size="xl" align="center" mb="xs">
                  {'Price: ' + plan.price}
                </Text>

                <Text align="center" weight={400} style={{ flexGrow: 1 }}>
                  No of Rows : {plan.rowsIncluded}
                </Text>

                <Flex justify="flex-end">
                  <Button
                    component="a"
                    variant="filled"
                    color={data && data.plan.code === plan.code && data.isActive === true ? 'red' : 'blue'}
                    href={`${PAYMENT_GATEWAY_URL}/api/v1/plans/${plan.code}/buy/${profile.email}/redirect`}
                    fullWidth
                  >
                    {data && data.plan.code === plan.code && data.isActive === true ? 'Cancel' : 'Activate'}
                  </Button>
                </Flex>
              </Flex>
            </Paper>
          ))}
        </Flex>
      </Stack>
    </Container>
  );
};

export default PlansModal;

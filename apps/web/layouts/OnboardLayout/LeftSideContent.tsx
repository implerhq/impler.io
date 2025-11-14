import { ReactNode } from 'react';
import { Box, Text, Title, Stack, Group, useMantineTheme, Center, Divider } from '@mantine/core';
import Image from 'next/image';
import FullLogo from '@assets/images/full-logo-light.png';
import { StocksIcon } from '@assets/icons/Stocks.icon';
import { TimeClockIcon } from '@assets/icons/TimeClock.icon';
import { GiveHeartIcon } from '@assets/icons/GiveHeart.icon';
import { ListTickIcon } from '@assets/icons/ListTick.icon';
import { colors, companyLogos } from '@config';

interface Feature {
  title: string;
  description: ReactNode;
  icon: ReactNode;
}
export function LeftSideContent() {
  const theme = useMantineTheme();

  const ONBOARD_FEATURES: Feature[] = [
    {
      title: 'Integrate in Minutes',
      description: (
        <Text>
          Drop a few lines of code or use our Bubble plugin — start importing data <br />
          instantly.
        </Text>
      ),
      icon: <TimeClockIcon />,
    },
    {
      title: 'Smart, Reliable Validation',
      description: <Text>Hybrid validation engine catches errors before they break your data.</Text>,
      icon: <ListTickIcon />,
    },
    {
      title: 'Fully Yours',
      description: (
        <Text>
          Add your branding, colors, and language — your users won&apos;t even know it&apos;s <br /> Impler.
        </Text>
      ),
      icon: <GiveHeartIcon />,
    },
    {
      title: 'Scalable & Safe',
      description: <Text>Handle millions of rows with chunked uploads and zero data loss.</Text>,
      icon: <StocksIcon />,
    },
  ];

  return (
    <Center>
      <Box mt="xl" p="xl">
        <Stack spacing={''}>
          <Box>
            <Box mb="md">
              <Image
                src={FullLogo}
                alt="Impler Logo"
                width={120}
                height={48}
                style={{ width: 'auto', height: 'auto' }}
                priority
              />
            </Box>

            <Title order={2} size={32} weight={800} color="white" mb="sm">
              Launch Imports That Scale ⚡
            </Title>
            <Text size="md" color={colors.StrokeLight} mb="xl">
              Impler helps you add a powerful, customizable CSV & Excel importer
              <Text component="span" display="block">
                to your app in minutes — no heavy lifting, no maintenance.
              </Text>
            </Text>
          </Box>

          <Stack spacing="lg">
            {ONBOARD_FEATURES.map((feature: Feature, index: number) => (
              <Group key={index} align="flex-start" spacing="md" noWrap>
                <Box>{feature.icon}</Box>
                <Box>
                  <Text size="md" weight={700} color="white" mb={4}>
                    {feature.title}
                  </Text>
                  <Text size="xs" color={colors.StrokeLight}>
                    {feature.description}
                  </Text>
                </Box>
              </Group>
            ))}
          </Stack>

          <Box mt="xl">
            <Divider
              label={
                <Text size="sm" color={colors.StrokeLight} px="md">
                  Trusted by fast-moving SaaS teams and developers
                </Text>
              }
              labelPosition="center"
              styles={{
                label: {
                  fontSize: theme.fontSizes.sm,
                },
              }}
              sx={{
                '&::before, &::after': {
                  borderTopColor: `${theme.colors.gray[3]} !important`,
                  borderTopWidth: '1px !important',
                },
              }}
              mb="lg"
            />

            <Group spacing="xl" align="center">
              {companyLogos.map((company: any) => (
                <Box key={company.id}>
                  <Image src={company.src} alt={company.alt} width={100} height={24} />
                </Box>
              ))}
            </Group>
          </Box>
        </Stack>
      </Box>
    </Center>
  );
}

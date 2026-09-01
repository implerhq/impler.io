import { Flex, Stack } from '@mantine/core';
import { modals } from '@mantine/modals';
import Link from 'next/link';

import { colors, ROUTES, DOCUMENTATION_REFERENCE_LINKS } from '@config';
import { Button } from '@ui/button';
import { Badge } from '@ui/badge';
import { LockIcon } from '@assets/icons/Lock.icon';
import { TooltipLabel } from '@components/guide-point';

interface GatedFieldProps {
  label: string;
  description: string;
  unavailable: boolean;
  children: React.ReactNode;
  link?: keyof typeof DOCUMENTATION_REFERENCE_LINKS;
  containerStyle?: React.CSSProperties;
}

export function GatedField({ label, description, unavailable, children, link, containerStyle }: GatedFieldProps) {
  if (!unavailable) return <>{children}</>;

  return (
    <Flex
      direction="row"
      gap="sm"
      align="center"
      style={{
        padding: '8px',
        backgroundColor: colors.BGPrimaryDark,
        borderRadius: '4px',
        ...containerStyle,
      }}
    >
      <LockIcon size="xl" />
      <Stack spacing={5} w="100%" align="flex-start">
        <Badge color="orange">Feature unavailable on current plan</Badge>
        <div>
          <TooltipLabel label={label} link={link ? DOCUMENTATION_REFERENCE_LINKS[link] : undefined} />
          <p style={{ fontSize: '0.75rem', color: '#868e96', margin: 0 }}>{description}</p>
        </div>
      </Stack>
      <Button component={Link} size="xs" href={ROUTES.EXPLORE_PLANS} onClick={modals.closeAll}>
        Explore Options
      </Button>
    </Flex>
  );
}

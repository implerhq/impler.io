import React from 'react';
import Link from 'next/link';
import { Tooltip, useMantineColorScheme } from '@mantine/core';

import { colors } from '@config';
import { GuidePointIcon } from '@assets/icons/GuidePoint.icon';

interface TooltipLinkProps {
  label?: string;
  link: string;
  iconSize?: 'sm' | 'md' | 'lg';
  iconColor?: string;
}

export function TooltipLink({ label = 'Read More', link, iconSize = 'sm' }: TooltipLinkProps) {
  const theme = useMantineColorScheme();

  return (
    <Tooltip label={label} withArrow>
      <Link href={link} target="_blank" rel="referrer">
        <GuidePointIcon
          size={iconSize}
          color={theme.colorScheme === 'dark' ? colors.BGPrimaryLight : colors.BGPrimaryDark}
        />
      </Link>
    </Tooltip>
  );
}

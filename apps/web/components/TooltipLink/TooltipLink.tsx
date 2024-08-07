import React from 'react';
import { Tooltip, useMantineColorScheme } from '@mantine/core';
import Link from 'next/link';
import { GuidePointIcon } from '@assets/icons/GuidePoint.icon';
import { colors } from '@config';

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
      <Link href={link} target="_blank" rel="noopener noreferrer">
        <GuidePointIcon
          size={iconSize}
          color={theme.colorScheme === 'dark' ? colors.BGPrimaryLight : colors.BGPrimaryDark}
        />
      </Link>
    </Tooltip>
  );
}

export default TooltipLink;

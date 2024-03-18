import Link from 'next/link';
import { MouseEvent } from 'react';
import { Divider, Flex, Stack, Text } from '@mantine/core';

import useStyles from './ImportCard.styles';
import { IconButton } from '@ui/icon-button';
import { CopyIcon } from '@assets/icons/Copy.icon';

interface ImportCardProps {
  id?: string;
  href: string;
  title: string;
  imports: number;
  totalRecords: number;
  errorRecords: number;
  onDuplicateClick?: (e: MouseEvent<HTMLButtonElement>) => void;
}

export function ImportCard({
  id,
  title,
  imports,
  totalRecords,
  errorRecords,
  onDuplicateClick,
  href,
}: ImportCardProps) {
  const { classes } = useStyles();

  return (
    <Link id={id} href={href} className={classes.root}>
      <Flex justify="space-between">
        <Text size="xl" className={`title ${classes.name}`}>
          {title}
        </Text>
        <IconButton label="Duplicate Import" onClick={onDuplicateClick}>
          <CopyIcon className={classes.duplicate} />
        </IconButton>
      </Flex>
      <Divider />
      <Flex justify="space-between" align="center">
        <Stack spacing={0} align="center">
          <Text className={classes.value}>{imports}</Text>
          <Text className={classes.key}>Imports</Text>
        </Stack>
        <Stack spacing={0} align="center">
          <Text className={classes.value}>{totalRecords}</Text>
          <Text className={classes.key}>Records Imported</Text>
        </Stack>
        <Stack spacing={0} align="center">
          <Text className={classes.value}>{errorRecords}</Text>
          <Text className={classes.key}>Error Records</Text>
        </Stack>
      </Flex>
    </Link>
  );
}

import { Flex, Group, Text } from '@mantine/core';
import useStyles from './ImportCard.styles';
import Link from 'next/link';

interface ImportCardProps {
  title: string;
  imports: number;
  totalRecords: number;
  errorRecords: number;
  href: string;
}

export function ImportCard({ title, imports, totalRecords, errorRecords, href }: ImportCardProps) {
  const { classes } = useStyles();

  return (
    <Link href={href} className={classes.root}>
      <Text size="xl" className={classes.name}>
        {title}
      </Text>
      <Flex justify="space-between">
        <Group spacing="xs">
          <Text className={classes.key}>Imports</Text>
          <Text className={classes.value}>{imports}</Text>
        </Group>
        <Group spacing="xs">
          <Text className={classes.key}>Total Records</Text>
          <Text className={classes.value}>{totalRecords}</Text>
        </Group>
        <Group spacing="xs">
          <Text className={classes.key}>Error Records</Text>
          <Text className={classes.value}>{errorRecords}</Text>
        </Group>
      </Flex>
    </Link>
  );
}

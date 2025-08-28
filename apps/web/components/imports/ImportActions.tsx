import Link from 'next/link';
import { createStyles, Group } from '@mantine/core';
import { EyeIcon } from '@assets/icons/Eye.icon';
import { colors } from '@config';

interface ImportActionsProps {
  slug: string;
}

const useStyles = createStyles({
  link: {
    color: colors.white,
    transition: 'color 150ms ease',
    ':hover': {
      color: colors.blue,
    },
  },
});

export function ImportActions({ slug }: ImportActionsProps) {
  const { classes } = useStyles();

  return (
    <Group position="right">
      <Link href={`/imports/${slug}`} className={classes.link}>
        <EyeIcon />
      </Link>
    </Group>
  );
}

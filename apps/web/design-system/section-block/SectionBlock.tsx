import { Stack, Title } from '@mantine/core';
import useStyles from './SectionBlock.styles';

interface SectionBlockProps extends React.PropsWithChildren {
  title: string;
}

export const SectionBlock = ({ children, title }: SectionBlockProps) => {
  const { classes } = useStyles();

  return (
    <Stack spacing="xs" className={classes.root}>
      <Title order={4}>{title}</Title>
      {children}
    </Stack>
  );
};

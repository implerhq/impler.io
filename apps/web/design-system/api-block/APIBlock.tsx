import { Stack, Group, Badge, CopyButton, UnstyledButton, Text } from '@mantine/core';

import useStyles from './APIBlock.styles';
import { CopyIcon } from '@assets/icons/Copy.icon';
import { CheckIcon } from '@assets/icons/Check.icon';

interface APIBlockProps {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  title: string;
}

export function APIBlock({ method, title, url }: APIBlockProps) {
  const { classes } = useStyles();

  return (
    <Stack spacing="sm" className={classes.root}>
      <Group spacing="xs">
        <Badge variant="filled" color="green" radius="xl" p="xs">
          {method}
        </Badge>
        <Text size="lg" className={classes.url}>
          {url}
        </Text>
        <CopyButton value={url}>
          {({ copied, copy }) =>
            copied ? (
              <CheckIcon />
            ) : (
              <UnstyledButton className={classes.button} onClick={copy}>
                <CopyIcon />
              </UnstyledButton>
            )
          }
        </CopyButton>
      </Group>
      <Text weight="bold" size="lg">
        {title}
      </Text>
    </Stack>
  );
}

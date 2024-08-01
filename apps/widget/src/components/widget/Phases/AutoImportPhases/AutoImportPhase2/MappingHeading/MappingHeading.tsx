import React from 'react';
import { TEXTS } from '@config';
import useStyles from './Styles';
import { Group, Text } from '@mantine/core';

export const MappingHeading = React.forwardRef<HTMLDivElement, {}>((props, ref) => {
  const { classes } = useStyles();

  return (
    <Group style={{ justifyContent: 'space-between' }} noWrap ref={ref}>
      <Group className={classes.textWrapper} align="stretch" noWrap>
        <Text color="dimmed" className={classes.text}>
          {TEXTS.AUTOIMPORTPHASE2.NAME_IN_SCHEMA_TITLE}
        </Text>
        <Text color="dimmed" className={classes.text}>
          {TEXTS.AUTOIMPORTPHASE2.KEY_IN_FEED_TITLE}
        </Text>
      </Group>
    </Group>
  );
});

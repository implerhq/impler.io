import React from 'react';
import useStyles from './Styles';
import { Group, Text } from '@mantine/core';
import { WIDGET_TEXTS } from '@impler/client';

interface IMappingHeadingProps {
  texts: typeof WIDGET_TEXTS;
}

export const MappingHeading = React.forwardRef<HTMLDivElement, IMappingHeadingProps>(({ texts }, ref) => {
  const { classes } = useStyles();

  return (
    <Group style={{ justifyContent: 'space-between' }} noWrap ref={ref}>
      <Group className={classes.textWrapper} align="stretch" noWrap>
        <Text color="dimmed" className={classes.text}>
          {texts.AUTOIMPORT_PHASE2.IN_SCHEMA_TITLE}
        </Text>
        <Text color="dimmed" className={classes.text}>
          {texts.AUTOIMPORT_PHASE2.IN_FEED_TITLE}
        </Text>
      </Group>
    </Group>
  );
});

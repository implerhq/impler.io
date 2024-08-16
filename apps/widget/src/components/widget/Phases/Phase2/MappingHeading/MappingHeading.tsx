import React from 'react';
import { WIDGET_TEXTS } from '@impler/shared';
import useStyles from './Styles';
import { Group, Text } from '@mantine/core';

interface IMappingHeadingProps {
  texts: typeof WIDGET_TEXTS;
}

export const MappingHeading = React.forwardRef<HTMLDivElement, IMappingHeadingProps>(({ texts }, ref) => {
  const { classes } = useStyles();

  return (
    <Group style={{ justifyContent: 'space-between' }} noWrap ref={ref}>
      <Group className={classes.textWrapper} align="stretch" noWrap>
        <Text color="dimmed" className={classes.text}>
          {texts.PHASE2.IN_SCHEMA_TITLE}
        </Text>
        <Text color="dimmed" className={classes.text}>
          {texts.PHASE2.IN_SHEET_TITLE}
        </Text>
      </Group>
    </Group>
  );
});

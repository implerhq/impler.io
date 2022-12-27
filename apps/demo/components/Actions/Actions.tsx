import { Button } from '@impler/react';
import { Button as MantineButton, Flex } from '@mantine/core';
import useStyles from './Styles';

const Actions = () => {
  const { classes } = useStyles();

  return (
    <Flex justify="space-between" align="flex-end">
      <Button
        projectId={process.env.NEXT_PUBLIC_PROJECT_ID!}
        accessToken={process.env.NEXT_PUBLIC_ACCESS_TOKEN}
        template={process.env.NEXT_PUBLIC_TEMPLATE}
        primaryColor={process.env.NEXT_PUBLIC_PRIMARY_COLOR}
        className={classes.button}
      />
      <MantineButton className={classes.button}>Download Data File</MantineButton>
    </Flex>
  );
};

export default Actions;

import { PropsWithChildren } from 'react';
import { Heading } from 'components/Common/Heading';
import useStyles from './Styles';

interface IWrapperProps {
  active: number;
}

export function Wrapper(props: PropsWithChildren<IWrapperProps>) {
  const { classes } = useStyles();
  const { children, active } = props;

  return (
    <div className={classes.root}>
      {/* Heading */}
      <Heading active={active} />
      <div className={classes.container}>{children}</div>
    </div>
  );
}

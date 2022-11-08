import { PropsWithChildren } from 'react';
import { Heading } from 'components/Common/Heading';
import useStyles from './Styles';

interface ILayoutProps {
  active: number;
}

export function Layout(props: PropsWithChildren<ILayoutProps>) {
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

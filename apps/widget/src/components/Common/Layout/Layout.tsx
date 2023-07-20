import { PropsWithChildren } from 'react';
import { Heading } from 'components/Common/Heading';
import useStyles from './Styles';
import { PhasesEum } from '@types';

interface ILayoutProps {
  active: PhasesEum;
  title?: string;
}

export function Layout(props: PropsWithChildren<ILayoutProps>) {
  const { classes } = useStyles();
  const { children, active, title } = props;

  return (
    <div className={classes.root}>
      <Heading active={active} title={title} />
      <div className={classes.container}>{children}</div>
    </div>
  );
}

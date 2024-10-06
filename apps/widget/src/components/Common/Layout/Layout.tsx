import { PropsWithChildren } from 'react';
import useStyles from './Styles';
import { PhasesEnum } from '@types';
import { Heading } from 'components/Common/Heading';

interface ILayoutProps {
  active: PhasesEnum;
  title?: string;
  onClose?: () => void;
}

export function Layout(props: PropsWithChildren<ILayoutProps>) {
  const { classes } = useStyles();
  const { children, active, title, onClose } = props;

  return (
    <div className={classes.root}>
      <Heading title={title} active={active} onClose={onClose} />
      <div className={classes.container}>{children}</div>
    </div>
  );
}

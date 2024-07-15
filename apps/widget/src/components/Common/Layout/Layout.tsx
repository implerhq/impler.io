import { PropsWithChildren } from 'react';
import { Heading } from 'components/Common/Heading';
import useStyles from './Styles';
import { PhasesEnum } from '@types';
import { TemplateModeEnum } from '@impler/shared';

interface ILayoutProps {
  active: PhasesEnum;
  title?: string;
}

export function Layout(props: PropsWithChildren<ILayoutProps>) {
  const { classes } = useStyles();
  const { children, active, title } = props;

  return (
    <div className={classes.root}>
      <Heading mode={TemplateModeEnum.AUTOMATIC} active={active} title={title} />
      <div className={classes.container}>{children}</div>
    </div>
  );
}

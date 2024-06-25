import { PropsWithChildren } from 'react';
import { Heading } from 'components/Common/Heading';
import useStyles from './Styles';
import { PhasesEnum } from '@types';

interface ILayoutProps {
  active: PhasesEnum;
  title?: string;
  imageTemplateAvailable?: boolean;
}

export function Layout(props: PropsWithChildren<ILayoutProps>) {
  const { classes } = useStyles();
  const { children, active, title } = props;

  return (
    <div className={classes.root}>
      <Heading active={active} title={title} imageTemplateAvailable={props.imageTemplateAvailable} />
      <div className={classes.container}>{children}</div>
    </div>
  );
}

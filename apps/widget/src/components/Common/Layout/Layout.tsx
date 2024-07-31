import { PropsWithChildren } from 'react';
import useStyles from './Styles';
import { PhasesEnum } from '@types';
import { TemplateModeEnum } from '@impler/shared';
import { Heading } from 'components/Common/Heading';

interface ILayoutProps {
  active: PhasesEnum;
  title?: string;
  mode?: TemplateModeEnum;
  hasImageUpload?: boolean;
}

export function Layout(props: PropsWithChildren<ILayoutProps>) {
  const { classes } = useStyles();
  const { children, active, title, hasImageUpload, mode } = props;

  return (
    <div className={classes.root}>
      <Heading active={active} title={title} hasImageUpload={hasImageUpload} mode={mode} />
      <div className={classes.container}>{children}</div>
    </div>
  );
}

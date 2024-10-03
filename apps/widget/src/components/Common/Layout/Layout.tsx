import { PropsWithChildren } from 'react';
import useStyles from './Styles';
import { PhasesEnum } from '@types';
import { WIDGET_TEXTS } from '@impler/client';
import { TemplateModeEnum } from '@impler/shared';
import { Heading } from 'components/Common/Heading';

interface ILayoutProps {
  active: PhasesEnum;
  title?: string;
  onClose?: () => void;
  mode?: TemplateModeEnum;
  hasImageUpload?: boolean;
  texts: typeof WIDGET_TEXTS;
}

export function Layout(props: PropsWithChildren<ILayoutProps>) {
  const { classes } = useStyles();
  const { children, active, title, hasImageUpload, mode, texts, onClose } = props;

  return (
    <div className={classes.root}>
      <Heading
        mode={mode}
        texts={texts}
        title={title}
        active={active}
        onClose={onClose}
        hasImageUpload={hasImageUpload}
      />
      <div className={classes.container}>{children}</div>
    </div>
  );
}

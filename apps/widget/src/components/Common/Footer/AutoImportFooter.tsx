import { Group, Text } from '@mantine/core';

import useStyles from './Styles';
import { variables } from '@config';
import { WIDGET_TEXTS } from '@impler/shared';
import { PhasesEnum } from '@types';
import { Button } from '@ui/Button';
import { useAppState } from '@store/app.context';

interface IFooterProps {
  active: PhasesEnum;
  primaryButtonDisabled?: boolean;
  secondaryButtonDisabled?: boolean;
  primaryButtonLoading?: boolean;
  secondaryButtonLoading?: boolean;
  onPrevClick: () => void;
  onNextClick: () => void;
  texts: typeof WIDGET_TEXTS;
}

export function AutoImportFooter({
  active,
  onNextClick,
  primaryButtonLoading,
  primaryButtonDisabled,
  texts,
}: IFooterProps) {
  const { importConfig } = useAppState();
  const { classes } = useStyles();

  const FooterActions = {
    [PhasesEnum.CONFIGURE]: (
      <Button loading={primaryButtonLoading} disabled={primaryButtonDisabled} onClick={onNextClick}>
        {texts?.AUTOIMPORTPHASES?.BUTTONTEXT?.MAPCOLUMN}
      </Button>
    ),
    [PhasesEnum.MAPCOLUMNS]: (
      <>
        <Button loading={primaryButtonLoading} disabled={primaryButtonDisabled} onClick={onNextClick}>
          {texts?.AUTOIMPORTPHASES?.BUTTONTEXT?.SCHEDULE}
        </Button>
      </>
    ),
    [PhasesEnum.SCHEDULE]: (
      <>
        <Button loading={primaryButtonLoading} disabled={primaryButtonDisabled} onClick={onNextClick}>
          {texts?.AUTOIMPORTPHASES?.BUTTONTEXT?.CONFIRM}
        </Button>
      </>
    ),
    [PhasesEnum.CONFIRM]: (
      <>
        <Button loading={primaryButtonLoading} disabled={primaryButtonDisabled} onClick={onNextClick}>
          {texts?.AUTOIMPORTPHASES?.BUTTONTEXT?.CLOSE}
        </Button>
      </>
    ),
  };

  return (
    <Group className={classes.wrapper} spacing="xs">
      {importConfig && importConfig.showBranding === true ? (
        <a className={classes.poweredBy} href={variables.implerWebsite} target="_blank" rel="noopener noreferrer">
          <Text size="xs">
            Powered by <img src="/logo-full.png" className={classes.implerImage} />
          </Text>
        </a>
      ) : (
        <div />
      )}
      <Group spacing="xs">{FooterActions[active]}</Group>
    </Group>
  );
}

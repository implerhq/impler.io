import { Group, Text } from '@mantine/core';
import { Button } from '@ui/Button';
import { variables } from '@config';
import { PhasesEnum } from '@types';
import useStyles from './Styles';
import { useAppState } from '@store/app.context';

interface IFooterProps {
  active: PhasesEnum;
  primaryButtonDisabled?: boolean;
  secondaryButtonDisabled?: boolean;
  primaryButtonLoading?: boolean;
  secondaryButtonLoading?: boolean;
  onPrevClick?: () => void;
  onNextClick?: () => void;
}

export function Footer({
  active,
  onNextClick,
  onPrevClick,
  primaryButtonLoading,
  secondaryButtonLoading,
  primaryButtonDisabled,
  secondaryButtonDisabled,
}: IFooterProps) {
  const { importConfig, texts } = useAppState();
  const { classes } = useStyles();

  const FooterActions = {
    [PhasesEnum.IMAGE_UPLOAD]: (
      <>
        <Button loading={primaryButtonLoading} disabled={primaryButtonDisabled} onClick={onNextClick}>
          {texts['PHASE0-1'].GENERATE_TEMPLATE}
        </Button>
      </>
    ),
    [PhasesEnum.MAPPING]: (
      <>
        <Button
          loading={secondaryButtonLoading}
          disabled={secondaryButtonDisabled}
          onClick={onPrevClick}
          variant="outline"
        >
          {texts.COMMON.UPLOAD_AGAIN}
        </Button>
        <Button loading={primaryButtonLoading} disabled={primaryButtonDisabled} onClick={onNextClick}>
          {texts.PHASE2.REVIEW_DATA}
        </Button>
      </>
    ),
    [PhasesEnum.REVIEW]: (
      <>
        <Button
          loading={secondaryButtonLoading}
          disabled={secondaryButtonDisabled}
          onClick={onPrevClick}
          variant="outline"
        >
          {texts.COMMON.UPLOAD_AGAIN}
        </Button>
        <Button loading={primaryButtonLoading} disabled={primaryButtonDisabled} onClick={onNextClick}>
          {texts.PHASE3.RE_REVIEW_DATA}
        </Button>
      </>
    ),
    [PhasesEnum.COMPLETE]: (
      <>
        <Button
          loading={secondaryButtonLoading}
          disabled={secondaryButtonDisabled}
          onClick={onPrevClick}
          variant="outline"
        >
          {texts.COMMON.CLOSE_WIDGET}
        </Button>
        <Button loading={primaryButtonLoading} disabled={primaryButtonDisabled} onClick={onNextClick}>
          {texts.COMMON.UPLOAD_AGAIN}
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

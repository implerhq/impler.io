import { Group, Text } from '@mantine/core';
import { Button } from '@ui/Button';
import { TEXTS, variables } from '@config';
import { PhasesEnum } from '@types';
import useStyles from './Styles';
import { useAppState } from '@store/app.context';

interface IFooterProps {
  active: PhasesEnum;
  primaryButtonDisabled?: boolean;
  secondaryButtonDisabled?: boolean;
  primaryButtonLoading?: boolean;
  secondaryButtonLoading?: boolean;
  onPrevClick: () => void;
  onNextClick: () => void;
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
  const { importConfig } = useAppState();
  const { classes } = useStyles();

  const FooterActions = {
    [PhasesEnum.IMAGE_UPLOAD]: (
      <>
        <Button
          loading={secondaryButtonLoading}
          disabled={secondaryButtonDisabled}
          onClick={onPrevClick}
          variant="outline"
        >
          {TEXTS['PHASE0-1'].IMPORT_FILE}
        </Button>
        <Button loading={primaryButtonLoading} disabled={primaryButtonDisabled} onClick={onNextClick}>
          {TEXTS['PHASE0-1'].GENERATE_TEMPLATE}
        </Button>
      </>
    ),
    [PhasesEnum.UPLOAD]: (
      <Button loading={primaryButtonLoading} disabled={primaryButtonDisabled} onClick={onNextClick}>
        {TEXTS.PHASE1.SEE_MAPPING}
      </Button>
    ),
    [PhasesEnum.MAPPING]: (
      <>
        <Button
          loading={secondaryButtonLoading}
          disabled={secondaryButtonDisabled}
          onClick={onPrevClick}
          variant="outline"
        >
          {TEXTS.PHASE2.UPLOAD_AGAIN}
        </Button>
        <Button loading={primaryButtonLoading} disabled={primaryButtonDisabled} onClick={onNextClick}>
          {TEXTS.PHASE2.SEE_REVIEW}
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
          {TEXTS.PHASE2.UPLOAD_AGAIN}
        </Button>
        <Button loading={primaryButtonLoading} disabled={primaryButtonDisabled} onClick={onNextClick}>
          {TEXTS.PHASE3.RE_REVIEW_DATA}
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
          {TEXTS.PHASE4.CLOSE}
        </Button>
        <Button loading={primaryButtonLoading} disabled={primaryButtonDisabled} onClick={onNextClick}>
          {TEXTS.PHASE2.UPLOAD_AGAIN}
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

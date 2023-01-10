import { Group, Text } from '@mantine/core';
import { Button } from '@ui/Button';
import { TEXTS, variables } from '@config';
import { PhasesEum } from '@types';
import useStyles from './Styles';

interface IFooterProps {
  active: PhasesEum;
  primaryButtonDisabled?: boolean;
  secondaryButtonDisabled?: boolean;
  primaryButtonLoading?: boolean;
  secondaryButtonLoading?: boolean;
  onPrevClick: () => void;
  onNextClick: () => void;
}

export function Footer(props: IFooterProps) {
  const { classes } = useStyles();
  const {
    active,
    onNextClick,
    onPrevClick,
    primaryButtonLoading,
    secondaryButtonLoading,
    primaryButtonDisabled,
    secondaryButtonDisabled,
  } = props;

  const FooterActions = {
    [PhasesEum.UPLOAD]: (
      <Button loading={primaryButtonLoading} disabled={primaryButtonDisabled} onClick={onNextClick}>
        {TEXTS.PHASE1.SEE_MAPPING}
      </Button>
    ),
    [PhasesEum.MAPPING]: (
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
    [PhasesEum.REVIEW]: (
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
          {TEXTS.PHASE3.CONFIRM_UPLOAD}
        </Button>
      </>
    ),
    [PhasesEum.COMPLETE]: (
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
    <Group className={classes.wrapper}>
      <a className={classes.poweredBy} href={variables.implerWebsite} target="_blank">
        <Text size="xs">
          Powered by <img src="/logo-full.png" className={classes.implerImage} />
        </Text>
      </a>
      <Group spacing="md">{FooterActions[active]}</Group>
    </Group>
  );
}

import { Group } from '@mantine/core';
import { Button } from '@ui/Button';
import { TEXTS } from '@config';
import { PhasesEum } from '@types';

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
    <Group spacing="md" style={{ alignSelf: 'flex-end' }}>
      {FooterActions[active]}
    </Group>
  );
}

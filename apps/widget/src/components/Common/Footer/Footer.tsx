import { Group } from '@mantine/core';
import { Button } from '@ui/Button';
import { TEXTS } from '@config';
import { PhasesEum } from '@types';

interface IFooterProps {
  active: PhasesEum;
  primaryButtonLoading?: boolean;
  secondaryButtonLoading?: boolean;
  onPrevClick: () => void;
  onNextClick: () => void;
}

export function Footer(props: IFooterProps) {
  const { active, onNextClick, onPrevClick, primaryButtonLoading, secondaryButtonLoading } = props;

  const FooterActions = {
    [PhasesEum.UPLOAD]: (
      <Button loading={primaryButtonLoading} onClick={onNextClick}>
        {TEXTS.PHASE1.SEE_MAPPING}
      </Button>
    ),
    [PhasesEum.MAPPING]: (
      <>
        <Button loading={secondaryButtonLoading} onClick={onPrevClick} variant="outline">
          {TEXTS.PHASE2.UPLOAD_AGAIN}
        </Button>
        <Button loading={primaryButtonLoading} onClick={onNextClick}>
          {TEXTS.PHASE2.SEE_REVIEW}
        </Button>
      </>
    ),
    [PhasesEum.REVIEW]: (
      <>
        <Button loading={secondaryButtonLoading} onClick={onPrevClick} variant="outline">
          {TEXTS.PHASE3.BACK_TO_MAPPING}
        </Button>
        <Button loading={primaryButtonLoading} onClick={onNextClick}>
          {TEXTS.PHASE3.CONFIRM_UPLOAD}
        </Button>
      </>
    ),
    [PhasesEum.CONFIRMATION]: (
      <>
        <Button loading={secondaryButtonLoading} onClick={onPrevClick} variant="outline">
          {TEXTS.PHASE3.BACK_TO_MAPPING}
        </Button>
        <Button loading={primaryButtonLoading} onClick={onNextClick}>
          {TEXTS.PHASE3.CONFIRM_UPLOAD}
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

import { Group } from '@mantine/core';
import { Button } from '@ui/Button';
import { TEXTS } from '@config';

interface IFooterProps {
  active: number;
  primaryButtonLoading?: boolean;
  secondaryButtonLoading?: boolean;
  onPrevClick: () => void;
  onNextClick: () => void;
}

export function Footer(props: IFooterProps) {
  const { active, onNextClick, onPrevClick, primaryButtonLoading, secondaryButtonLoading } = props;

  return (
    <Group spacing="md" style={{ alignSelf: 'flex-end' }}>
      {active === 1 ? (
        <Button loading={primaryButtonLoading} onClick={onNextClick}>
          {TEXTS.PHASE1.SEE_MAPPING}
        </Button>
      ) : active === 2 ? (
        <>
          <Button loading={secondaryButtonLoading} onClick={onPrevClick} variant="outline">
            {TEXTS.PHASE2.UPLOAD_AGAIN}
          </Button>
          <Button loading={primaryButtonLoading} onClick={onNextClick}>
            {TEXTS.PHASE2.SEE_REVIEW}
          </Button>
        </>
      ) : active === 3 ? (
        <>
          <Button loading={secondaryButtonLoading} onClick={onPrevClick} variant="outline">
            {TEXTS.PHASE3.BACK_TO_MAPPING}
          </Button>
          <Button loading={primaryButtonLoading} onClick={onNextClick}>
            {TEXTS.PHASE3.CONFIRM_UPLOAD}
          </Button>
        </>
      ) : active === 4 ? (
        <Button loading={primaryButtonLoading} onClick={onNextClick}>
          {TEXTS.COMPLETE.UPLOAD_AGAIN}
        </Button>
      ) : null}
    </Group>
  );
}

import { Group } from '@mantine/core';
import { Button } from '@ui/Button';
import { TEXTS } from '@config';

interface IFooterProps {
  active: number;
  onPrevClick: () => void;
  onNextClick: () => void;
}

export function Footer(props: IFooterProps) {
  const { active, onNextClick, onPrevClick } = props;

  return (
    <Group spacing="md" style={{ alignSelf: 'flex-end' }}>
      {active === 1 ? (
        <Button onClick={onNextClick}>{TEXTS.PHASE1.SEE_MAPPING}</Button>
      ) : active === 2 ? (
        <>
          <Button onClick={onPrevClick} variant="outline">
            {TEXTS.PHASE2.UPLOAD_AGAIN}
          </Button>
          <Button onClick={onNextClick}>{TEXTS.PHASE2.SEE_REVIEW}</Button>
        </>
      ) : active === 3 ? (
        <>
          <Button onClick={onPrevClick} variant="outline">
            {TEXTS.PHASE3.BACK_TO_MAPPING}
          </Button>
          <Button onClick={onNextClick}>{TEXTS.PHASE3.CONFIRM_UPLOAD}</Button>
        </>
      ) : active === 4 ? (
        <Button onClick={onNextClick}>{TEXTS.COMPLETE.UPLOAD_AGAIN}</Button>
      ) : null}
    </Group>
  );
}

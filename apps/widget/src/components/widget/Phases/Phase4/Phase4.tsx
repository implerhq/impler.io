import { Group, Title, Text } from '@mantine/core';

import useStyles from './Styles';
import { CheckIcon } from '@icons';
import { PhasesEnum } from '@types';
import { WIDGET_TEXTS } from '@impler/client';
import { useAppState } from '@store/app.context';
import { Footer } from 'components/Common/Footer';
import { numberFormatter, replaceVariablesInString } from '@impler/shared';

interface IPhase4Props {
  rowsCount: number;
  texts: typeof WIDGET_TEXTS;
  onCloseClick: () => void;
  onUploadAgainClick: () => void;
}

export function Phase4(props: IPhase4Props) {
  const { classes } = useStyles();
  const { primaryColor } = useAppState();
  const { rowsCount, onUploadAgainClick, onCloseClick, texts } = props;

  return (
    <>
      <Group className={classes.wrapper}>
        <CheckIcon className={classes.check} />
        <Title className={classes.title} color={primaryColor} order={2} mt="md">
          {replaceVariablesInString(texts.PHASE4.TITLE, { count: numberFormatter(rowsCount) })}
        </Title>
        <Text className={classes.subTitle} color="dimmed">
          {replaceVariablesInString(texts.PHASE4.SUB_TITLE, { count: numberFormatter(rowsCount) })}
        </Text>
      </Group>

      <Footer active={PhasesEnum.COMPLETE} onNextClick={onUploadAgainClick} onPrevClick={onCloseClick} />
    </>
  );
}
